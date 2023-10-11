/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-21 15:16:02
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-07-31 11:23:20
 * @FilePath: \barrage_yw_client\assets\script\ui\game\Pole.ts
 * @Description: 中间标杆
 */

import { EventName } from "../../librarys/const/EventName";
import { eventsOnLoad, preloadEvent } from "../../librarys/utils/Events";

const {ccclass, property} = cc._decorator;

@ccclass
@eventsOnLoad()
export default class Pole extends cc.Component {

    _moveX: number = 1;
    _speed: number = 1;
    _poleId: number = 0;

    start () {

    }

    @preloadEvent(EventName.ENTER_ROOM)
    initUi(data) {
        this._moveX = data.pole.x;
        this._poleId = data.pole.id;
        this.node.x = this._moveX;
    }

    @preloadEvent(EventName.POLE_MOVE)
    updateMove(data) {
        this._moveX = data.x;
    }

    update (dt) {
        if (this._moveX > this.node.x) {
            this.node.x = this.node.x + this._speed;
        } else if (this._moveX < this.node.x) {
            this.node.x = this.node.x - this._speed;
        }
    }
}
