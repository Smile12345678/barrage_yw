/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-24 14:54:54
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-08-01 11:44:39
 * @FilePath: \barrage_yw_client\assets\script\scene\StartCtrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { EventName } from "../librarys/const/EventName";
import { eventsOnLoad, preloadEvent } from "../librarys/utils/Events";
import UIManager from "../ui/UIManager";
import ComDialog from "../ui/common/ComDialog";
import LoginModule from "../librarys/module/LoginModule";
import DataModule from "../librarys/module/DataModule";
const {ccclass, property} = cc._decorator;

@ccclass
@eventsOnLoad()
export default class StartCtrl extends cc.Component {

    // @property(cc.Node)
    // testNode: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    onLoginEvent() {
        // LoginModule.instance.doLogin();
        // var itemData = DataModule.instance.findOneBin('stage', 1);
        // console.log('----item', itemData);
        // var itemData = DataModule.getInstance().findOneBin('Item', rewardId);
        // this.testNode.x = 0;
        LoginModule.instance.doLogin();

    }

    //@ts-ignore



    // update (dt) {}
}
