/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-24 13:39:20
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-07-25 17:33:54
 * @FilePath: \barrage_yw_client\assets\script\librarys\module\UserModule.ts
 * @Description: User数据
 */

import Tool from "../utils/Tool";

export default class UserModule {
    private static _instance: UserModule;

    static get instance() {
        if (this._instance == null) {
            this._instance = new UserModule();
        }
        return this._instance;
    }


    /**
     * @description: 初始化
     */  
    init() {

    }

    /**
     * @description: 清理数据
     */    
    clear() {

    }

    /**
     * @description: openId
     * @param {*} openId
     */
    private _openId: string = '';
    set openId(openId) {
        this._openId = openId;
    }

    get openId() {
        this._openId = cc.sys.localStorage.getItem("openId"); // '4E5E20EF-1E52-4236-9EDB-2501820EBCDA'  '4E5E20EF-1E52-4236-9EDB-2501820EBGAT'
        if (!this._openId) {
            var date = new Date();
            var strMonth = '' + (date.getMonth() + 1);
            if (strMonth.length === 1) {
                strMonth = '0' + strMonth;
            }
            var strDate = '' + (date.getDate());
            if (strDate.length === 1) {
                strDate = '0' + strDate;
            }
            var strHour = '' + (date.getHours());
            if (strHour.length === 1) {
                strHour = '0' + strHour;
            }
            var strMinutes = '' + (date.getMinutes());
            if (strMinutes.length === 1) {
                strMinutes = '0' + strMinutes;
            }
            var strSeconds = '' + (date.getSeconds());
            if (strSeconds.length === 1) {
                strSeconds = '0' + strSeconds;
            }
            var deviceID = cc.js.formatStr('%s%s%s%s%s%s', strMonth, strDate,
                strHour, strMinutes, strSeconds, Tool.randInt(1000, 9999));
        
            this._openId = deviceID;
            cc.sys.localStorage.setItem("openId", this._openId);
        }
        return this._openId;
    }

    /**
     * @description: 房间Id
     * @param {*} roomId
     */    
    private _roomId: string = '';
    set roomId(roomId) {
        this._roomId = roomId;
    }

    get roomId() {
        return this._roomId;
    }

    /**
     * @description: 渠道数据
     */    
    private _channelData: any = {};
    set channelData(data) {
        this._channelData = data;
    }

    get channelData() {
        return this._channelData;
    }

    /**
     * @description: user数据（登录成功之后才有）
     */    
    private _userData: any = {}
    set userData(data) {
        this._userData = data;
    }

    get userData() {
        return this._userData;
    }

    /**
     * @description: 是否登录game
     */    
    private _bLoginGame: boolean = false;
    set bLoginGame(b) {
        this._bLoginGame = b;
    }

    get bLoginGame() {
        return this._bLoginGame;
    }

}
