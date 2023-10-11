/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-24 10:42:14
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-08-01 11:45:31
 * @FilePath: \barrage_yw_client\assets\script\librarys\module\LoginModule.ts
 * @Description: 登录数据
 */
import UserModule from "./UserModule";
import Http from "../../network/Http"; 
import AccessSocket from "../../network/AccessSocket";
import { EventName } from "../const/EventName";
import Events from "../utils/Events";
import MyApp from "../../MyApp";
import I18n from "../utils/I18n";
import UIManager from "../../ui/UIManager";
import ComDialog from "../../ui/common/ComDialog";
const protores = require('protores');
const Message = protores.com.hb.socket;
const { MessageCode, MessageType, CMsgBase, CMsgHead } = Message;

const STAGE = {
    OPENID: 1,
    ROOM: 2,
    FETCH: 3,
    WS: 4,
    HALL: 5,   
    VERSION: 6, 
    READY: 7
}

const _LINK_READY = STAGE.READY;
const _LINK_VERSION = STAGE.VERSION;

const {ccclass} = cc._decorator;
@ccclass('LoginModule')
export default class LoginModule {
    private static _instance: LoginModule;
    private _time: number = 0;
    private _state: number = 0;
    private _number: number = 0;
    private _roomId: number = 0;
    private _wsLink: boolean = false;
    private _maintainData: any = null;
    private _timer: Function;
    static get instance() {
        if (this._instance == null){
            this._instance = new LoginModule();
        }
        return this._instance
    }


    /**
     * @description: 初始化
     */  
    init() {
        this.registerEvents();
        AccessSocket.getInstance().setSocketDelegate(this);
        cc.director.getScheduler().enableForTarget(this);
        this.initSchedule();
    }

    /**
     * @description: 清理数据
     */    
    clear() {
        if (AccessSocket.getInstance()) {
            AccessSocket.getInstance().removeSocketDelegage(this);
        }
        this.unregisterEvents();
        LoginModule._instance = null;
    }

    registerEvents() {
        Events.on(EventName.TOKEN_ERROR, this.onConnectError, this);
        Events.on(EventName.SOCKET_SUCCESS, this.onAccessConnect, this);
    }

    unregisterEvents() {
        Events.off(EventName.TOKEN_ERROR, this.onConnectError, this);
        Events.off(EventName.SOCKET_SUCCESS, this.onAccessConnect, this);
    }

    dealwithResponse(msgType, buffer, code) {
        switch (msgType) {
            case MessageType.MSG_PRE_CREATE: { // 支付获取订单号
                var data = Message.SC_PRE_CREATE.decode(new Uint8Array(buffer));
                // SDKManagerModule.getInstance().pay(data)
                console.log('>>>>>>>>>>>>>>>MessageType.MSG_PRE_CREATE', data);
            }
                break;
            case MessageType.MSG_DATA_CHANGE: { // 充值通知 
                let data = Message.SC_DATA_CHANGE_MSG.decode(new Uint8Array(buffer));
                console.log('>>>>>>>>>>>>>>>MessageType.MSG_DATA_CHANGE', data); 
                // this.onPayNotify(data);
            }
                break;
            default:
                // console.warn('not deal login msg type = ', msgType);
                break;
        }
    }

    onConnectError() {
        console.log('CONNECT ERROR!', this._state);

        const idx = this._state;
        if (idx < 4) {
            if (this._timer) {
            console.log('CONNECT ERROR! timeer', this._state);
                this.checkLogin();
                return
            }
        }

        const Access = AccessSocket.getInstance();
        Access.showLoading();

        this._state = 0;
        this.doLogin();

    }

    onAccessConnect() {
        this._state = 5;
        this._time = Date.now();
        this.checkVersion();
        // this.onEnterRoom();
    }

    // onEnterRoom() {
    //     let data = new Message.CS_ENTER_ROOM();
    //     data.roomId = UserModule.instance.roomId;
    //     console.log("---sendLoginReq:" + JSON.stringify(data));
    //     AccessSocket.getInstance().sendMsg(MessageType.MSG_ENTER_ROOM, Message.CS_ENTER_ROOM.encode(data).finish());
    // }

    doLogin() {
        AccessSocket.getInstance().showLoading();
        console.log('LOGIN..', this._state);
        const idx = this._state;
        if (idx && idx < _LINK_READY) {
            this.checkLogin();
            return
        }

        this.initSchedule();

        // 检查连接
        if (idx >= 4) {
            // 处理旧连接
            AccessSocket.getInstance().doClose();
        }

        this._time = Date.now();
        if (window['tt']) {
            if (UserModule.instance.openId) {
                this._state = 2;
                this.fetchRoomInfo();
            } else {
                this._state = 1;
                this.channelLogin();
            }
        } else {
            console.log('LOGIN.1.', this._state);
            this._state = 3;
            this.fetchChannel();
        }
    }

    checkVersion() {
        const idx = Date.now();
        this._time = idx;
        this._state = 6;
        if (this._time === idx) {
            this.toGame();
        }
    }


    initSchedule() {
        if (this._timer) {
            return
        }

        const callback = () => {
            this.checkLogin();
        };

        this._timer = callback;
        const scheduler = cc.director.getScheduler();

        const num = cc.macro.REPEAT_FOREVER;
        scheduler.schedule(callback, this, 1, num, 2.4, false);

    }

    ceaseSchedule() {
        const callback = this._timer;
        if (callback) {
            this._timer = null;
            cc.director.getScheduler().unschedule(callback, this);
        }
    }

    checkLogin() {
        const idx = this._state;
        if (!idx || idx >= _LINK_READY) {
            return
        }

        // 定时限制
        const LIMIT = (idx < 3) ? 2400 : 4000;

        const time = Date.now();
        if (Math.abs(time - this._time) < LIMIT) {
            return
        }
        this.onLoginError();
    }

    onLoginError() {
        const idx = this._state;
    
        if (idx === _LINK_VERSION) {
            this._time = 0;
            this._number = 0;

            this.toGame();
            return
        }
        
        const num = this._number + 1;
        if (num > 2) {
            // my.showToast(my.getLan('common_lan', 1));
            console.error('LOGIN TRY ERROR!');

            this._time = 0;
            this._state = 0;
            this._number = 0;
            Events.emit(EventName.LOGIN_ERROR);
            AccessSocket.getInstance().hideLoading();
            return
        }

        this._number = num;
        this._time = Date.now();
        console.log('LOGIN ERROR:', idx, this._time);
        
        switch (idx) {
            case 1:
                this.channelLogin();
                break;
            case 2:
                if (this._roomId) {
                    this.fetchUser(false);
                } else {
                    this.fetchRoomInfo();
                }
                break;
            case 3:
                this.fetchUser(false);
                break;
            case 4:
                this.fetchUser(true);
                break;
            case 5:
                this.fetchUser(true);
                break;
        
            default:
                console.error('Unknown Login State:', idx);
                break;
        }

    }

    fetchUser(d) {
        this._state = STAGE.FETCH;

        if (d) {
            const Access = AccessSocket.getInstance();
            Access.doClose();
            Access.showLoading();
        }
        this.fetchChannel();
    }

    _channelData: any = {};
    channelLogin() {
        console.log('channel');
        const time = this._time;
        if (UserModule.instance.openId) {
            this._time = Date.now();
            this._state = 2;
            this.fetchRoomInfo();
            return;
        }
        window["tt"].getLiveUserInfo({
            success: (data) => { // {code, anonymousCode, isLogin}
                if (time !== this._time) {
                    return
                }
                this._number = 0;
                console.log('byte:', data);

                const info = data.userInfo
                if (info) {
                    this._channelData = info;
                    UserModule.instance.openId = info.openUID;
                    UserModule.instance.channelData = info.role;
                    this._time = Date.now();
                    this._state = 2;
                    this.fetchRoomInfo();
                } else {
                    this.onLoginError();
                }
                
            },
            fail: (info) => {
                console.error('ERROR:', info);
                if (time == this._time) {
                    this.onLoginError();
                }
                
            }
        });
    }

    fetchRoomInfo() {
        const time = this._time;
        if (UserModule.instance.openId) {
            this._time = Date.now();
            this._state = 3;
            this._number = 0;
            this.fetchChannel();
            return;
        }
        window["tt"].getRoomInfo({
            success: (data) => {
                const vid = data.roomInfo.roomID;
                this._roomId = vid;
                UserModule.instance.roomId = vid;  // 保存数据
                if (time !== this._time) {
                    return
                }
                
                this._time = Date.now();
                this._state = 3;
                this._number = 0;
                this.fetchChannel();

            },
            fail: (data) => {
                console.error('Room ERROR:', data);
                if (time === this._time) {
                    this.onLoginError();
                }
            },
        });

    }

    fetchChannel() { 
        var openId = UserModule.instance.openId;
        const value = {platform: window['Plat'], version: window['LocalVersion'], openId: openId, type: 1, roomId:"100007"};
        const time = this._time;
        console.log('----param--------', value);
        Http.instance.post('/game/api/login', value)
        .then(info => {
            console.log('Login Resp:', info);
            if (time !== this._time) {
                return
            }
            const code = info.code;
            if (code) {
                if (1000 == code) {
                    this._maintainData = info;
                    this.showMaintain();
                } else if (2 == code) {
                    this.onSeverNotOpenTip(info.msg)
                } else if (5 == code) {
                    AccessSocket.getInstance().hideLoading();
                    return
                } else {
                    // my.showToast(my.getLan('http_error_lan', code));
                    UIManager.inst.showTip({ text: I18n.getText("http_err_" + code), unique: true, end: cc.v2(0, 100) });
                }

                this._time = 0;
                this._state = 0;
                this._number = 0;
                Events.emit(EventName.LOGIN_ERROR);
                AccessSocket.getInstance().hideLoading();
                return
            }

            const data = info.data;

            this._state = 4;
            this._number = 0;
            this._time = Date.now();

            const Access = AccessSocket.getInstance();
            UserModule.instance.roomId = data.roomId;  // 保存数据
            UserModule.instance.userData = data;
            UserModule.instance.bLoginGame = false;
            // if (data.ver) {
            //     Global.ServerVersion = `${data.ver[0]}.${data.ver[1]}.${data.ver[2]}`;
            // }
            let bWss = false;
            if (data.wss) {
                bWss = true;
            }
            const ws = (data.wss && (data.port == 443)) ? 
                    `wss://${data.ip}/ws?token=${encodeURI(data.token)}&userId=${data.userId}` :
                    `${data.wss ? 'wss' : 'ws'}://${data.ip}:${data.port}/ws?token=${encodeURI(data.token)}&userId=${data.userId}`; 
                
            // const ws =`${bWss ? 'wss' : 'ws'}://${data.ip}${bWss ? '' : ':' + data.port}${data.wsPath}?token=${encodeURI(data.token)}&userId=${data.userId}&version=${Global.LocalVersion}`; 
            // 连接大厅常连接
            if (this._wsLink) {
                Access.doConnect(ws);
                return
            }

            this._wsLink = true;
            Access.connectSocket(ws);
        })
        .catch(e => {
            console.error('ERROR:', e);
            if (time === this._time) {
                this.onLoginError();
            }

        })
       
    }

    // 停服公告
    showMaintain() {
        window['bMaintain'] = true;
        const Access = AccessSocket.getInstance();
        Access.hideLoading();
        if (MyApp.instance.isInStartScene() && this._maintainData) {
            // my.loadPrefabRes(cc.director._scene, GAME_ENUM.VIEW.NOTICE_GAME, (node) => {
            //     node.getComponent('NoticeCtrl').onWithdrawalShow(this._maintainData.msg);
            //     node.zIndex = ROOM_ZORDER.NOTICE;
            // });
        } else if (MyApp.instance.isInGameScene()) {
            MyApp.caller();
            cc.director.loadScene('game_start/startScene');
        }
    }

    // 服务器未开放
    onSeverNotOpenTip(tipStr) {
        let param = {
            text: "tipStr",
            onlyOK: true,
            callback: (bok) => {
                if (bok) {
                    if (MyApp.instance.isInGameScene()) {
                        MyApp.instance.clear();
                        this.gotoStartScene();
                    }
                }
            },
        }
        UIManager.inst.openUniDialogAsync(ComDialog.pUrl, param);
    }

    gotoStartScene(){
        console.log('------gotoStartScene--');
        cc.director.loadScene('game_start/startScene');
    }

    toGame() {
        this._time = 0;
        this._state = _LINK_READY;

        this.ceaseSchedule();

        // 检测场景
        if (MyApp.instance.isInStartScene()) {
            cc.director.loadScene('scenes/gameScene');
        }

    }

}
