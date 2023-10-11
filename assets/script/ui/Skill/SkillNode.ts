import { EventName } from "../../librarys/const/EventName";
import { SkillProperty } from "./SkillProperty";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkillNode extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;


    private _preX: number = 0;
    private _preY: number = 0;
    private _skillPlay: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    /**
 * @description: 初始化角色数据
 * @param {any} data
 * @return {*}
 */    
    init() {
        this.node.zIndex = SkillProperty.SLILL_ZINDEX;
    }

    /**
     * @description: 回调函数，Pool 在 pool.get 函数中，会调用对象的 reuse 这里可以做对象重用的初始化
     */    
    reuse(data: any) {
        this.doSkill(data.sx, data.sy, data.ex, data.ey);
    }

    /**
     * @description: 回调函数，Pool 在 pool.put 函数中，会调用对象的 unuse 这里可以做对象的一些清理工作
     */    
    unuse() {

    }

    doSkill(sx, xy, ex, ey) {
        let jump2 = this.jumpTo(0.5, cc.v2(sx, xy), cc.v2(ex, ey), 100, 1); 
        jump2.clone(this.node).start();
    }

    // let jump2 = this.jumpTo(0.5, this.testNode.getPosition(), cc.v2(500, this.testNode.getPosition().y), 300, 1); 
    // jump2.clone(this.testNode).start();
    /**
     * @description: 
     * @param {number} t 时间
     * @param {cc} spos 开始位置
     * @param {cc} epos 最终位置
     * @param {number} height 高度
     * @param {number} num 需要弹的次数
     * @param {Function} twFinished 结束回调
     * @return {*}
     */    
    jumpTo (t: number, spos: cc.Vec2, epos: cc.Vec2, height: number, num: number = 1) {
        this._skillPlay = true;
        this._preX = this.node.x;
        this._preY = this.node.y;
        num = Math.round(Math.max(num, 1)); // 最小为1 四舍五入取整
        let tween = cc.tween();
        tween.set({x: spos.x, y: spos.y});
        let lastPos = spos;
        for (let i = 0; i < num; ++i) {
            let p = cc.v2();
            p.x = lastPos.x + (epos.x - spos.x) / num;
            p.y = lastPos.y + (epos.y - spos.y) / num;
            let m = cc.v2();
            m.x = (p.x + lastPos.x) / 2;
            m.y = Math.max(p.y, lastPos.y) + height * 2;
            tween.then(cc.tween().bezierTo(t / num, lastPos, m, p));
            lastPos = p;
        }
        tween.call(() => {
            this.node.emit(EventName.SKILL_DEAD, this.node);
        })
        tween.union();
        return tween;
    }

    update (dt) {
        if (this._skillPlay) {
            // 计算技能旋转角度
            let dx = this.node.x - this._preX;
            let dy = this.node.y - this._preY;
            let vector = cc.v2(dx, dy);
            if (vector.mag() != 0) {
                let angle = vector.signAngle(cc.v2(1, 0));
                this.node.angle = -(angle*180/Math.PI);
            }
            this._preX = this.node.x;
            this._preY = this.node.y;
        }
    }
}
