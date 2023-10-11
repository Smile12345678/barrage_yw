import AccessSocket from "../script/network/AccessSocket";
import UserModule from "./librarys/module/UserModule";
import LoginModule from "./librarys/module/LoginModule";
import GameModule from "./librarys/module/GameModule";
import I18n, { LangType } from "./librarys/utils/I18n";
const {ccclass, property} = cc._decorator;

@ccclass
export default class MyApp extends cc.Component {

   
    private static _instance: MyApp;
    static get instance() {
        if (this._instance == null) {
            this._instance = new MyApp();
        }
        return this._instance;
    }

    start () {
        console.log('------MyApp.start---');
        cc.game.addPersistRootNode(this.node); //添加为常驻节点
         ////////////底层代码//////////////////////////
        cc.game.setFrameRate(30);

        AccessSocket.getInstance().init();
        LoginModule.instance.init();
        UserModule.instance.init();
        GameModule.instance.init();
        I18n.switch(LangType.ZH);
    }

    /**
     * @description: 清空数据
     */    
    clear() {
        AccessSocket.getInstance().onClear(false);
        LoginModule.instance.clear()
        UserModule.instance.clear();
        GameModule.instance.clear();
    }

    isInStartScene() {
        if (cc.director.getScene() && cc.director.getScene().name === 'startScene') {
            return true;
        }
        else {
            return false;
        }
    }

    isInGameScene() {
        if (cc.director.getScene() && cc.director.getScene().name === 'gameScene') {
            return true;
        }
        else {
            return false;
        }
    }

    // update (dt) {}
}
