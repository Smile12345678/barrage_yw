/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-21 15:19:17
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-07-24 15:05:26
 * @FilePath: \barrage_yw_client\assets\script\ui\game\Obstacle.ts
 * @Description: 障碍物
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class Obstacle extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
