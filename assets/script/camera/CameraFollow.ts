/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-21 10:45:50
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-08-01 11:39:41
 * @FilePath: \barrage_yw_client\assets\script\camera\CameraFollow.ts
 * @Description: 相机跟随
 */

const {ccclass, property} = cc._decorator;

@ccclass()
export default class CameraFollow extends cc.Component {

    @property(cc.Node)
    poleNode: cc.Node = null;

    cameraW: number = 375; // 场景宽
    @property(cc.Node)
    mainBg: cc.Node = null;
    // LIFE-CYCLE CALLBACKS:
    _cameraMaxX: number = 0;
    _cameraMaxY: number = 0;
    _bGameStart: boolean = false;
    // onLoad () {}

    start () {
        this._cameraMaxX = this.mainBg.width/2 - cc.winSize.width/2;
        this._cameraMaxY = this.mainBg.height/2 - cc.winSize.height/2;
        cc.tween(this.node).to(2, {position: cc.v3(this._cameraMaxX, 0, 0)}, {easing: "smooth"}) //smooth sineOut
        .call(() => {
            cc.tween(this.node).to(2, {position: cc.v3(-this._cameraMaxX, 0, 0)}, {easing: "smooth"}) //smooth sineOut
            .call(() => {
                cc.tween(this.node).to(2, {position: cc.v3(this.poleNode.position.x, 0, 0)}, {easing: "smooth"}) //smooth sineOut
                .call(() => {
                    this._bGameStart = true;
                })
                .start();
            })
            .start();
        })
        .start();
        // this._bGameStart = true;

    }

    update (dt) {
        // if (this.cameraW - this.poleNode.x <= 0 || this.cameraW + this.poleNode.x <= 0) {
        //     return;
        // }
        // this.node.x = this.poleNode.x;
        if (this._bGameStart) {
            this.updateCameraPosition();
        }
    }

    updateCameraPosition() {
        let target = this.poleNode.position;
        if (target.x > this._cameraMaxX) {
            target.x = this._cameraMaxX;
        }
        if (target.x < -this._cameraMaxX) {
            target.x = -this._cameraMaxX;
        }
        // if (target.y > this._cameraMaxY) {
        //     target.y = this._cameraMaxY;
        // }
        // if (target.y < -this._cameraMaxY) {
        //     target.y = -this._cameraMaxY;
        // }
        
        this.node.x = target.x;
        // console.log('xxxxxxxxxxxx: ', this.poleNode.x)
    }
}
