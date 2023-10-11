/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-26 10:24:26
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-07-28 17:43:50
 * @FilePath: \barrage_yw_client\assets\script\librarys\module\DataModule.ts
 * @Description: 表数据
 */

export enum PrimaryKeySource {
    "stage" = "id",
    "actor" = "id",
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class DataModule {
    private static _instance: DataModule;
    // private _binDataDict;
    // private _binRawDataDict;

    static get instance() {
        if (this._instance == null) {
            this._instance = new DataModule();
        }
        return this._instance;
    }

    init() {
        // this._binDataDict = {};
        // this._binRawDataDict = {};
    }

    clear() {

    }
     private _binDataDict = {};
    findOneBin(dataSourceName, primaryValue) {
        var dataDict = this._binDataDict[dataSourceName];
        if (dataDict == null || dataDict[primaryValue] == null) {
            // 首先确定一下主键
            var primaryKey = PrimaryKeySource[dataSourceName];
            var len = window["XMLData"][dataSourceName].length;
            var binInfo = null;
            for (var i = 0; i < len; i ++) {
                if (window["XMLData"][dataSourceName][i][primaryKey] == primaryValue) {
                    binInfo = window["XMLData"][dataSourceName][i];
                    break;
                }
            }
            if (dataDict == null) {
                this._binDataDict[dataSourceName] = {};
            }
            if (binInfo) {
                if (dataSourceName == 'newOnline') {
                    console.log('============', binInfo);
                }
                this._binDataDict[dataSourceName][primaryValue] = binInfo;
            }
        }
        if (dataSourceName == 'newOnline') {
            console.log('============', binInfo);
        }

        var data = this._binDataDict[dataSourceName][primaryValue];
        if (data == null) {
            return null;
        }
        if (dataSourceName == "item") {
            //如果是搜索item表则特殊处理String的id为int
            data.item_id = parseInt(data.item_id);
            if (data.buy_num) {
                data.buy_num = parseInt(data.buy_num);
            }
            if (data.give_num) {
                data.give_num = parseInt(data.give_num);
            }
            if (data.price) {
                data.price = parseInt(data.price);
            }
        }
        return data;
    }

    private _binRawDataDict = {};
    findAllBin(dataSourceName) {
        if (this._binRawDataDict[dataSourceName] == null || this._binRawDataDict[dataSourceName] == undefined) {
            this._binRawDataDict[dataSourceName] = window["XMLData"][dataSourceName];
        }
        else {
            console.log("findAllBin: JS加载这个数据");
        }
        if (dataSourceName == "item") {
            //如果是搜索item表则特殊处理String的id为int
            for (var i = 0; i < this._binRawDataDict[dataSourceName].length; i ++) {
                var data = this._binRawDataDict[dataSourceName][i];
                if (data.buy_num) {
                    data.buy_num = parseInt(data.buy_num);
                }
                if (data.give_num) {
                    data.give_num = parseInt(data.give_num);
                }
                if (data.price) {
                    data.price = parseInt(data.price);
                }
            }
        }
        return this._binRawDataDict[dataSourceName];
    }
}
