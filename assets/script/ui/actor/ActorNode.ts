/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-21 15:14:35
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-08-01 11:36:46
 * @FilePath: \barrage_yw_client\assets\script\ui\actor\ActorNode.ts
 * @Description: 角色Node
 */
import { ActorCamp, ActorProperty, ActorState, ActorType } from "../actor/ActorProperty";
import { EventName } from "../../librarys/const/EventName";
import DataModule from "../../librarys/module/DataModule";
import Tool from "../../librarys/utils/Tool";
import { Simulator } from "../../librarys/rvo/Simulator";
import { RVOMath, Vector2 } from "../../librarys/rvo/Common";
const {ccclass, property} = cc._decorator;

@ccclass()
export default class ActorNode extends cc.Component {

    @property(cc.Animation)
    actorAction: cc.Animation = null;
    
    // 角色属性
    actorProperty: ActorProperty = new ActorProperty();
    // 当前状态
    currState: ActorState | string = ActorState.Idle;
    // 当前角色类型
    _actorType: ActorType | string = ActorType.actor1;
    _actorId: number = 0; // 角色Id
    _actionName: string = ''; //播放的动画名称
    _campName: string = ''; // 阵营 red || blue
    _campType: string = '1'; // 阵营 1 || 2
    _actionIndex: number = 1; // 怪物动画下标
    _bMove: boolean = false; // 是否移动
    _speed: number = 2; // 移动的距离
    // onLoad () {}

    start () {

    }

    /**
     * @description: 初始化角色数据
     * @param {any} data
     * @return {*}
     */    
    init(campType) {
        this._campType = campType;
        this._campName = this._campType == '1' ?  'red' : 'blue';
        this.actorProperty.hp = 0;
        this.actorProperty.maxHp = 0;
    }

    /**
     * @description: 回调函数，Pool 在 pool.get 函数中，会调用对象的 reuse 这里可以做对象重用的初始化
     */    
    reuse(data: any) {
        this.node.scale = 0.5 //Tool.randFloat(0.5, 0.8);
        this._actionIndex = Tool.randInt(1,4)//DataModule.instance.findOneBin('actor', data.configId).action_index;
        // this._actionIndex = DataModule.instance.findOneBin('actor', data.configId).action_index;
        this.actorProperty.hp = data.hp;
        this.actorProperty.maxHp = data.maxHp;
        this._moveX = data.x;
        this.node.setPosition(data.x, data.y);
        // this.changeState(ActorState.Move, data);
        this._actionName = `${this._campName}_actor_${ActorState.Move}_${this._actionIndex}`;
        Tool.waitCmpt(this, Tool.randFloat(0, 0.5)).then(() => {
            this.actorAction.play(this._actionName);
        })
        // let speed = 1200
        // let radius = 20
        // let mass = 1
        // let p = cc.v2(-(Tool.randInt(90, 1000)), Tool.randInt(-170, 180))
        // this._sid = Simulator.instance.addAgent(p, radius, speed, null, mass);
        // let agentObj = Simulator.instance.getAgentByAid(this._sid)
        // agentObj.neighborDist = 40 //动态修改每个agent的巡视范围

        // setTimeout(() => {
        //     this.actorDie();
        // }, 5 * 1000);
    }

    /**
     * @description: 回调函数，Pool 在 pool.put 函数中，会调用对象的 unuse 这里可以做对象的一些清理工作
     */    
    unuse() {
        this.currState = ActorState.Idle;
        this.actorProperty.hp = 0;
        this.actorProperty.maxHp = 0;
        this._actionName = '';
        this._moveX = 0;

    }
    /**
     * @description: 角色状态
     * @param {ActorState} state
     * @param {any} data
     * @return {*}
     */
    changeState(state: ActorState | string, data: any) {
        this._actionName = `${this._campName}_actor_${state}_${this._actionIndex}`;
        if (state == ActorState.Idle) { // 等待
            if (this.currState != state) {
                this.actorIdle();
            }
        } else if (state == ActorState.Move) { // 移动
            this.actorMove(state, data.x, data.y);
        } else if (state ==  ActorState.Attack) { // 攻击
            this.actorAttack()
        } else if (state == ActorState.UnAttack) { // 受到攻击
            this.actorUnAttack();
        } else if (state == ActorState.Defense) { //防御
            this.actorDefense();
        } else if (state == ActorState.Die) { // 死亡
            this.actorDie();
        }
        this.currState = state;
    }

    /**
     * @description: 角色等待
     */    
    actorIdle () {

    }

    /**
     * @description: // 角色移动
     */
    _moveX: number = 0;
    actorMove(state, x, y) {
        this._bMove = true;
        this._moveX = x;
        console.log('---角色移动---', x);
        // this.node.setPosition(cc.v2(x, y));
        if (this.currState != state) {
            this.actorAction.play(this._actionName);
        }
    }

    /**
     * @description: 角色攻击
     */
    actorAttack() {

    }

    /**
     * @description: 角色受到攻击
     */
    actorUnAttack() {

    }

    /**
     * @description: 角色防御
     */
    actorDefense() {

    }

    /**
     * @description: 角色死亡
     */
    actorDie() {
        // 播放死亡动画
        
        this.node.emit(EventName.ACTOR_DEAD, this._campType, this.node, this._actorId);
    }

    onDestroy() {
        console.log('---onDestroy------')
    }

    update (dt) {
        if (this._bMove) {
            if (this._campType == ActorCamp.CampRed) {
                if (this._moveX > this.node.x) {
                    this.node.x = this.node.x + this._speed;
                } else {
                    // this._speed = 1;
                    this.node.x = this._moveX;
                    this._bMove = false;
                }
            } else if (this._campType == ActorCamp.CampBlue) {
                if (this._moveX < this.node.x) {
                    this.node.x = this.node.x - this._speed;
                } else {
                    // this._speed = 1;
                    this.node.x = this._moveX;
                    this._bMove = false;
                }
            }
            if (this._campType  == '2') {
                console.log("---update: ", this.node.x)
            }
        }
        // this.updatePrefVelocity();
        // console.log('x---------: ', this.node.x)
    }

    public targetSid: number = -1;
    public targetPos: Vector2;
    private _sid: number = -1;
    public set sid(val: number) {
        this._sid = val;
    }
    speedFactor: number = 1;
    public updatePrefVelocity() {
        this.targetPos = new Vector2(10, 10);
        if (this.targetPos != null) {
            let t_speedFactor = this.speedFactor;
            let curPos = Simulator.instance.getAgentPosition(this._sid);
            let targetPos = this.targetPos;
            if (!Number.isNaN(curPos.x) && !Number.isNaN(curPos.y))
            {
                this.node.setPosition(curPos.x, curPos.y);
                // console.log(`sid=${this._sid}的对象PosX=${curPos.x},PosY=${curPos.y}`);
            } else
            {
                // console.log(`sid=${this._sid}的对象PosX=${curPos.x},PosY=${curPos.y}`);
            }
            let goalVector = Vector2.subtract(targetPos, curPos);
            if (RVOMath.absSq(goalVector) > 1) {
                goalVector =RVOMath.normalize(goalVector);
            }
            if (t_speedFactor != 1) {
                Simulator.instance.setAgentPrefVelocity(this._sid, Vector2.multiply2(t_speedFactor, goalVector));
            }
            else {
                Simulator.instance.setAgentPrefVelocity(this._sid, goalVector);
            }

            //由于完美对称，稍微扰动一下以避免死锁,但是不注释坐标始终会有变化
            // let angle = Math.random() * 2.0 * Math.PI;
            // let dist = Math.random() * 0.1;
            // Simulator.Instance.setAgentPrefVelocity(this._sid, Vector2.addition(Simulator.Instance.getAgentPrefVelocity(this._sid),
            //     Vector2.multiply2(dist, new Vector2(Math.cos(angle), Math.sin(angle)))));
        }
    }
}
