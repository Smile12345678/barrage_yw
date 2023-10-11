import Events from "../librarys/utils/Events";
import { EventName } from "../librarys/const/EventName";
import UIManager from "../ui/UIManager";

const protores = require('protores');
const Message = protores.com.hb.socket;
const { MessageCode, MessageType, CMsgBase, CMsgHead } = Message;
const {ccclass, property} = cc._decorator;

@ccclass()
export default class AccessSocket extends cc.Component {
    private static _instance: AccessSocket;

    private _socket = null;
    private _time: number = 0;
    private _state: number = 0;
    private _ready: number = 0;
    private _handler = null;
    private _alldelegate: any = [];

    private _lastSendTime: number = 0;
    private _lastRecvTime: number = 0;
    private _checkInterval: number = 5000;
    private _lastRequestMagicTime: number = 0;
    private _requestMagicStrInterval: number = 300000;

    private _link: boolean = false;
    private _waitPulsResp: boolean = false;
    private _isInBackground: boolean = false;
    private _gotoForegroundTime: number = 0;
    private _checkTimerFunc: any = null;
    private _addr: string = '';
    private _isReconnecting: boolean = false;

    public static getInstance(): AccessSocket {
        if (null == this._instance) {
            this._instance = new AccessSocket();
        }
        return this._instance;
    }

    init() {
        cc.game.on(cc.game.EVENT_SHOW, this.gotoForeground, this);
        cc.game.on(cc.game.EVENT_HIDE, this.gotoBackground, this);
        this.startCheckTimer();
    }

    onDestroy() {
        console.info('Access Destroy!');
        if (!this._alldelegate) return;
        this._alldelegate.splice(0,this._alldelegate.length)
    }

    onClear(bInstance) {
        cc.game.off(cc.game.EVENT_HIDE);
        cc.game.off(cc.game.EVENT_SHOW);
        this.unscheduleAllCallbacks();
        this.doClose();
        this.stopCheckTimer();
        this._checkTimerFunc = null;
        if (this._alldelegate) {
            this._alldelegate.splice(0,this._alldelegate.length);
        }
        if (bInstance) return;
        AccessSocket._instance = null;
    }

    isInBackground() {
        return this._isInBackground;
    }

    setInBackground(bInBackground) {
        this._isInBackground = bInBackground;
    }

    gotoForeground() {
        if (Math.abs(Date.now() - this._gotoForegroundTime) > 2000) {
            // console.log('----->>>>>gotoForeground=======================', new Date());
            this.setInBackground(false);
            // if (MyApp.isInStartScene()) return; //TODO 
            if (this._addr) {
                this._waitPulsResp = false;
                if (!this.isConnected()) {
                    this.scheduleOnce(()=>{
                        this.onConnectError();
                    }, 0.1);
                } else {
                    this.checkConnect(true);
                }
            }
        }
        this._gotoForegroundTime = Date.now();
        
    }


    gotoBackground() {
        console.warn('---> BACKGROUND:', Date.now());
        this.setInBackground(true);
    }

    ////////////////////////////网络连接相关/////////////////////////////////////
    isConnected() {
        if (this._socket && this._socket.readyState === WebSocket.OPEN) {
            return true;
        }
        else {
            return false;
        }
    }

    isConnectClose() {
        if (!this._socket || this._socket.readyState == WebSocket.CLOSED) {
            return true;
        }
        else {
            return false;
        }
    }

    isClosing() {
        if (this._socket && this._socket.readyState == WebSocket.CLOSING) {
            return true;
        }
        else {
            return false;
        }
    }

    doConnect(addr) {
        this.startReconnect(addr, false);
    }

    doClose() {
        console.info('Access Close!');
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._addr = null;
            this._link = false;
            this._socket.close();
            this._socket = null;
            this._lastSendTime = 0;
            this._lastRecvTime = 0;
            this._waitPulsResp = false;
        }
    }

    connectSocket(addr) { 
        if (!addr) return;

        console.log('connect:', addr);
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            console.warn('----->>>>>Socket vaild onconnect curstate = ', this._socket.readyState);
            this._isReconnecting = false;
            return
        }


        const ws = new WebSocket(addr);
        console.log('---->>>>>start operate open socket', Date.now(), addr);
        this._addr = addr;

        this._state = 1;
        this._socket = ws;

        this._link = true;
        ws.binaryType = 'arraybuffer';
        ws.onopen = (event) => {
            console.log('Access Open!');
            this._link = false;
            this._ready = Date.now();

            this._time = 0;
            this._state = 2;
            this._isReconnecting = false;
            this.onConnectSuccess();
        };

        ws.onmessage = (event) => {
            if (event && event.data) {
                this.onRecvMsg(event.data);
            }
        };

        ws.onerror = (event) => {
            this._ready = 0;
            this._link = false;
            this._isReconnecting = false;

            // const state = this._socket.readyState;
            console.warn('WS ERROR:', Date.now());

            // 检查有效性
            if (this._socket === ws) {
                this.onConnectError();
            }
        };

        ws.onclose = (event) => {
            this._lastSendTime = 0;
            this._isReconnecting = false;
            console.warn('WS closed.', Date.now());

            // 对象检查
            if (this._socket === ws) {
                this._ready = 0;
                this._socket = null;
            }

            if (!event.wasClean) {
                this.onConnectError();
            }
        };

    }

    onConnectReady() {
        this._ready = 0;
    }

    startReconnect(addr, bDirectConnect) {
        console.warn('-----startReconnect', Date.now(), bDirectConnect);
        if (bDirectConnect || !this._socket || this._socket.readyState === WebSocket.CLOSED) { 
            console.warn('-----startReconnect direct reconnect', Date.now());
            this.reconnect(addr);
        } else if (this._socket.readyState === WebSocket.OPEN || this._socket.readyState === WebSocket.CLOSING) {
            console.warn('-----start close socket', Date.now());
            this._socket.onopen = (event) => {
                console.warn('-----socket open', event);
            };
            this._socket.onmessage = (event) => {
                console.warn('-----socket onmessage', event);
            };
            this._socket.onerror = (event) => {
                console.warn('-----socket onerror', event);
            };
            this._socket.onclose = (event) => {
                console.warn('-----socket onclose');
            };
            this._socket.close();

            this._socket = null;
            this.scheduleOnce(() => {
                this.reconnect(addr);
            }, 0.48);
        } else {
            console.warn('-----when startReconnect, curstate = ', this._socket.readyState);
            this.reconnect(addr);
        }
    }

    onConnectSuccess() {
        const tm = Date.now();
        this._lastSendTime = tm;
        this._lastRecvTime = tm;
        this.hideLoading();
        this.scheduleOnce(function() {
            console.log('SOCKET_SUCCESS');
            if (this._socket && this._socket.readyState === WebSocket.OPEN) {
                Events.emit(EventName.SOCKET_SUCCESS);
            }
        }, 0.24);
    }

    private _viewLoading: any = null;
    showLoading() {
        const data = this._viewLoading;
        if (data) {
            data.time = Date.now();
            return
        }

        const view = UIManager.inst.showLoading() //my.showWaitAni({parent: this.node, timeOut: 10});
        this._viewLoading = {view, time: Date.now()};
    }

    hideLoading() {
        const data = this._viewLoading;
        if (!data) {
            return
        }

        this._viewLoading = false;
        UIManager.inst.hideLoading();
        // data.view.destroy();

    }

    checkLoading() {
        const data = this._viewLoading;
        if (!data) {
            return
        }

        if (bMaintain) { // 阻止连接
            this.hideLoading();
            return
        }

        // 检查时间
        if (Math.abs(data.time - Date.now()) > 4800) {
            data.time = Date.now();
            this.onConnectError();
            
        }
    }

    private _magic: any = null;
    //发送报文
    sendMsg(messageID, messageData) {
        const socket = this._socket;
        console.log("sMsg :", messageID, Date.now());
        
        if (!socket) {
            console.error('sMsg Error: Socket is nil!');
            this.checkLink(messageID);
            return false;
        }

        // 检查连接状态
        if (socket.readyState !== WebSocket.OPEN) {
            console.error('sMsg Error:', socket.readyState);
            this.checkLink(messageID);
            return false;
        }
        
        // 发送数据的处理办法
        const msg = new CMsgBase();
        const msghead = new CMsgHead();

        msghead.msgtype = messageID;
        msghead.code = MessageCode.SYS_NORMAL;

        const magic = this._magic;
        if (magic) {
            msghead.magicstr = magic;
        }
        
        msg.msghead = msghead;

        // 检查消息体
        if (messageData) {
            msg.msgbody = messageData;
        }

        var data = CMsgBase.encode(msg).finish();
        var array = new ArrayBuffer(data.length);
        var dv = new DataView(array);
        for (var i = 0; i < data.length; i++) {
            dv.setUint8(i, data[i]);
        }

        socket.send(array);
        this._lastSendTime = Date.now();
    }

    //接收报文
    onRecvMsg(pData) {
        this._waitPulsResp = false;
        this._lastRecvTime = Date.now();

        // 接收数据的处理办法
        const msg = CMsgBase.decode(new Uint8Array(pData));

        const { msghead, msgbody } = msg;
        const {msgcode: code, msgtype: kind } = msghead;
        
        if (kind !== 10001) {
            console.log("rMsg :", kind, code);
        } 
        // TODO 添加错误处理
        // if (code > 1) {
        //     if (code == MessageCode.OTHER_DEVICE_LOGIN) {
        //         Global.bMaintain = true;
        //         this.onClear(true); // 顶号 关闭网络
        //         EventCenter.emit(EVENT_NAME.ACCOUNT_EXIT);
        //         return
        //     }

        //     if (msg.msghead.msgcode != Message.MessageCode.SYS_NORMAL) {
        //         if (msg.msghead.msgcode == Message.MessageCode.NO_MONEY_ERROR) {
        //             EventCenter.emit(EVENT_NAME.EVENT_INSUFFICIENT_CURREMCY);
        //         } else {
        //             // console.showTip(code);
        //             if (code == Message.MessageCode.RECHARGE_CLOSE) {
        //                 my.showToast(my.getLan('game_error_lan', 21)); //关闭支付
        //             }
        //         }
        //         return;
        //     }
        // }
        
        if (kind === MessageType.MSG_HEART_BEAT) {
            this.onRecvPuls(msgbody); //心跳
        } else {
            this.dispatchAllRecvDelegate(kind, msgbody, code);
        }
    }

    setCheckConnectInterval(interval) { 
        if (typeof (interval) === 'number' && interval >= 1000) {
            this._checkInterval = interval;
        }
        else { 
            this._checkInterval = 5000;
        }
        console.log('>>>>setCheckConnectInterval>>>', this._checkInterval);
    }
    
    // 消息分发
    addRecvDelegate(delegate) {
        this._alldelegate.push(delegate);
    }

    setSocketDelegate(h) {
        this._handler = h;
        this._alldelegate.push(h);
    }

    removeSocketDelegage(h) {
        if (h === this._handler) {
            this._handler = null;
        }

        this.removeRecvDelegate(h);
    }

    removeRecvDelegate(delegate) {
        if (!this._alldelegate) return;
        for (var i = 0; i < this._alldelegate.length; i++) {
            if (this._alldelegate[i] == delegate) {
                delete this._alldelegate[i];
                break;
            }
        }
    }

    dispatchAllRecvDelegate(msgType, buffer, msgcode) {
        const data = this._alldelegate;
        if (data) {
            const num = data.length;
            for (var i = 0; i < num; i++) {
                const d = data[i];
                if (d) {
                    try {
                        d.dealwithResponse(msgType, buffer, msgcode);
                    } catch (error) {
                        console.error('NETWORK ERROR:', error);
                    }
                    
                }
            }
        } else {
            console.warn('undeal msg, id = %d', msgType);
        }
    }

    reconnect(addr) {
        if (this._isReconnecting) {
            console.warn('WS Reconnecting!');
        }

        this._isReconnecting = true;
        if (this._socket && this._socket.readyState !== WebSocket.CLOSED) {
            this._socket.close();

            this._socket = null;
            this.scheduleOnce(() => {
                this.reconnect(addr);
            }, 0.48);
            return
        }

        this._socket = null;
        console.warn('Reconnect:', Date.now());

        this.connectSocket(addr);
        this.showLoading();

    }

    onConnectError() {
        this._ready = 0;
        this._state = 0;
        
        if (bMaintain || this._isInBackground) {
            return
        }
        
        this.hideLoading();
        this.doClose();
        Events.emit(EventName.TOKEN_ERROR);
    }

    checkLink(idx) {
        const MT = MessageType;
        if (idx === MT.MSG_BOWLING) {
            this.recoverLink();
            return
        }
    }

    checkHealth() {
        console.info('checkHealth');
        const socket = this._socket;

        // 检查连接状态
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            this.recoverLink();
            return
        }

    }

    recoverLink() {
        const time = this._time;
        if (time && Math.abs(Date.now() - time) < 2400) {
            return
        }

        this._time = Date.now();

        // 处理异常数据
        if (bMaintain) {
            bMaintain = false;
        }
        if (this._isInBackground) {
            this._isInBackground = false;
        }

        this.onConnectError();
    }

    // 心跳相关
    startCheckTimer() {
        this.stopCheckTimer();
        if (!this._checkTimerFunc) {
            this._checkTimerFunc = () => this.checkConnect(false);
        }

        this.schedule(this._checkTimerFunc, 1);
    }

    stopCheckTimer() {
        if (this._checkTimerFunc) {
            this.unschedule(this._checkTimerFunc);
        }
        // this.unschedule(this.checkConnect);

        this._lastSendTime = 0;
        this._lastRecvTime = 0;
        this._waitPulsResp = false;
    }

    checkConnect(bForce) {
        if (this._link) {
            this.checkLoading();
            return
        }

        if (!this._state) {
            return
        }

        let curTime = Date.now(); // 毫秒级时间戳

        const d = this._ready;
        if (d && Math.abs(curTime-d) > 4500) {
            console.error('Link Timeout!');
            this.onConnectError();
            return
        }

        if (this._waitPulsResp || this.isClosing()) {
            if (curTime - this._lastSendTime > 2000) { // 心跳超时了
                console.warn('!!!!!!!!!!!!!!!!!!!access plus resp timeout');
                this._waitPulsResp = false;
                this.onConnectError();
            }
            return
        }

        if (!this._lastRecvTime) return;
        if (bForce || curTime - this._lastSendTime > this._checkInterval) {
            this._waitPulsResp = true;
            this.sendOnePulsPack(); //5秒内没有发送过报文 发送一个心跳检测包
        } else if (this._lastRecvTime && (curTime - this._lastRecvTime > this._checkInterval)) {
            console.warn('!!!send a puls for test connect !!!');
            this._waitPulsResp = true;
            this.sendOnePulsPack(); //5秒内没有收到过报文 发送一个心跳检测包
        }

        /* 请求验证码
        if (curTime - this._lastRequestMagicTime > this._requestMagicStrInterval) {
            this.sendRequestMagicStr();
        }   // */
    }

    // 发送心跳包
    sendOnePulsPack() {
        if (bMaintain) {
            return
        }
        // 心跳
        this.sendMsg(MessageType.MSG_HEART_BEAT, null);
    }

    onRecvPuls(buffer) {
        this._waitPulsResp = false;
    }

    getNetRecvDataTimestampDiff() {
        return new Date().getTime() - this._lastRecvTime;
    }

    getNetRecvDataTimestamp() { 
        return this._lastRecvTime;
    }

    sendRequestMagicStr() {
        this._lastRequestMagicTime = Date.now();
        this.sendMsg(MessageType.MSG_REQUEST_MAGICSTR, null);
    }

    onRecvMagicStr(data) {
        var nowServerTime = data.time;
        // my.setServerTime(nowServerTime);
    }
}