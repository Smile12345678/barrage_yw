/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-06-27 10:48:10
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-07-31 18:31:36
 * @FilePath: \barrage_yw_client\assets\script\scenes\GameCtrl.ts
 * @Description: 游戏主场景
 */
import { ActorType, EventName } from "../librarys/const/EventName";
import DataModule from "../librarys/module/DataModule";
import GameModule from "../librarys/module/GameModule";
import { Vector2 } from "../librarys/rvo/Common";
import { Simulator } from "../librarys/rvo/Simulator";
import { eventsOnLoad, preloadEvent } from "../librarys/utils/Events";
import Tool from "../librarys/utils/Tool";
import { SkillManager } from "../ui/Skill/SkillManager";
import { ActorManager } from "../ui/actor/ActorManager"
import ActorNode from "../ui/actor/ActorNode";
import { ActorCamp, ActorState } from "../ui/actor/ActorProperty";

const {ccclass, property} = cc._decorator;

@ccclass()
@eventsOnLoad()
export default class GameCtrl extends cc.Component {

    // @property(cc.Node)
    // poleNode: cc.Node = null;
    @property(cc.Node) 
    actorLayer: cc.Node = null;
    _obstacleNodeMap: Map<string, {}> = new Map();


    onLoad() {
        this.initData();
    }
    
    start () {
        this.initUi();
        // Simulator.instance.setAgentDefaults(60, 3, 1, 0.1, 14, 80, new Vector2(0, 0));
        // cc.tween(this.poleNode).to(10, {position: cc.v3(700, -234, 0)}).start();
        Tool.waitCmpt(this, 2).then(() => {
            // 加入房间
            GameModule.instance.onEnterRoom();
        })
    }

    /**
     * @description: 初始数据
     * @return {*}
     */    
    private  _stageData = null;
    initData() {
        this._stageData = DataModule.instance.findOneBin('stage', 1);
    }

    /**
     * @description: 初始UI
     * @return {*}
     */  
    initUi() {
        let obstaclesData = JSON.parse(this._stageData.obstacle)
        for (let index = 0; index < obstaclesData.length; index++) {
            let obstacleItem = obstaclesData[index];
            let node1 = cc.find(`MainLayer/mainBg/obstacle_${obstacleItem.campId}_${index + 1}_1`, this.node);
            let node2 = cc.find(`MainLayer/mainBg/obstacle_${obstacleItem.campId}_${index + 1}_2`, this.node);
            let obstacleVaule = {'obstacleItem': obstacleItem.id, "obstacleNode1": node1, 'obstacleNode2': node2};
            this._obstacleNodeMap.set(obstacleItem.id, obstacleVaule);
        }

        ActorManager.instance.init();
        SkillManager.instance.init();
    }

    /**
     * @description: 加入房间成功
     * @return {*}
     */    
    @preloadEvent(EventName.ENTER_ROOM)
    initEnterRoom(data: any) {
        console.log('------data:', data);
        // 数据<key: id, value: data>
        let redActorMap = GameModule.instance.getActorMapByCamp(ActorCamp.CampRed);
        let blueActorMap = GameModule.instance.getActorMapByCamp(ActorCamp.CampBlue);

          // 遍历map
        redActorMap.forEach((value:[], key:number, map:Map<number,[]>)=>{
            console.log("redActorMap: ",key,value);
            ActorManager.instance.getActorByCampType(ActorType.actor1, value, this.actorLayer);

        });
            // 遍历map
        blueActorMap.forEach((value:[], key:number, map:Map<number,[]>)=>{
            console.log("blueActorMap: ",key,value);
            ActorManager.instance.getActorByCampType(ActorType.actor2, value, this.actorLayer);
        });
    }

    /**
     * @description: 角色加入
     * @return {*}
     */    
    @preloadEvent(EventName.ACTOR_ADD)
    onAddActor(data: any) {
        ActorManager.instance.getActorByCampType(data.campId + '', data, this.actorLayer);
        console.log('新加入角色：', data.id)

    }

    /**
     * @description: 角色死亡
     */    
    @preloadEvent(EventName.ACTOR_DEAD)
    onActorDead(data: any) {
        for (let index = 0; index < data.length; index++) {
            let actorId = data[index];
            let actorNode = ActorManager.instance.getActorNodeById(actorId);
            actorNode.getComponent(ActorNode).changeState(ActorState.Die, data);
        }
    }

    /**
     * @description: 角色移动
     */    
    @preloadEvent(EventName.ACTOR_MOVE)
    onActorMove(data: any) {
        // for (let index = 0; index < data.length; index++) {
        //     let actorId = data[index];
            let actorNode = ActorManager.instance.getActorNodeById(data.id);
            actorNode.getComponent(ActorNode).changeState(ActorState.Move, data);
        // }
    }

    /**
     * @description: 刷新障碍物
     */
    @preloadEvent(EventName.UPDATE_OBSTACLE)
    onUpdateObstacle(data: any) {
        
    }

    update(dt) {
        // console.log('----------', this.centerLeverNode.x)
        // Simulator.instance.run(dt);
    }

    testAdd() {
        let data1 = {'x': -(Tool.randInt(90, 1000)), 'y': Tool.randInt(-170, 180), actorType: 1, actorState: 'move'};
        let data2 = {'x': Tool.randInt(90, 1000), 'y': Tool.randInt(-170, 180), actorType: 1, actorState: 'move'};
        // ActorManager.instance.getActorByCampType(ActorType.actor2, data2, this.actorLayer);
       
        ActorManager.instance.getActorByCampType(ActorType.actor1, data1, this.actorLayer);
    }


    testAddKill() {
        let data1 = {'sx': -(Tool.randInt(90, 1000)), 'sy': Tool.randInt(-170, 180), 'ex': Tool.randInt(90, 1000), 'ey': Tool.randInt(-170, 180)};
        let data2 = {'sx': Tool.randInt(90, 1000), 'sy': Tool.randInt(-170, 180), 'ex': -(Tool.randInt(90, 1000)), 'ey': Tool.randInt(-170, 180)};
        SkillManager.instance.getSkillByPool('skill', data1, this.actorLayer);
        SkillManager.instance.getSkillByPool('skill', data2, this.actorLayer);
    }

    onDestroy() {
        ActorManager.instance.clear();
    }

}
