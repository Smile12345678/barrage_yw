import AccessSocket from "../../network/AccessSocket";
import { ActorCamp } from "../../ui/actor/ActorProperty";
import { EventName } from "../const/EventName";
import Events from "../utils/Events";
import Tool from "../utils/Tool";
import UserModule from "./UserModule";
const protores = require('protores');
const Message = protores.com.hb.socket;
const { MessageCode, MessageType, CMsgBase, CMsgHead } = Message;
const {ccclass} = cc._decorator;

@ccclass
export default class GameModule {
    private static _instance: GameModule;
    _poleId: number = 0;
    static get instance() {
        if (this._instance == null) {
            this._instance = new GameModule();
        }
        return this._instance;
    }

    /**
     * @description: 初始化
     */  
    init() {
        this.registerEvents();
        AccessSocket.getInstance().setSocketDelegate(this);
    }

    /**
     * @description: 清理数据
     */    
    clear() {
        if (AccessSocket.getInstance()) {
            AccessSocket.getInstance().removeSocketDelegage(this)
        }
        this.unregisterEvents();
        GameModule._instance = null;
    }

    /**
     * @description: 注册消息
     */
    registerEvents() {

    }

    /**
     * @description: 销毁消息
     */
    unregisterEvents() {

    }

    dealwithResponse(msgType, buffer) {
        switch (msgType) {
            case MessageType.MSG_ENTER_ROOM: { // 登入房间
                let data = Message.SC_ENTER_ROOM.decode(buffer);
                if (data) {
                    AccessSocket.getInstance().onConnectReady();
                }
                this.initGameData(data);
                this._poleId = data.pole.id;
                Events.emit(EventName.ENTER_ROOM, data);
                console.log("MSG_ENTER_ROOM data = ", data);
            }
            break;
            case MessageType.MSG_SKILL_ATTACK: { // 技能攻击
                let data = Message.SC_SKILL_ATTACK.decode(buffer);
                console.log('--------recv MSG_SKILL_ATTACK : ', data);
            }
                
                break;
            case MessageType.MSG_DEAD: { // 死亡
                let data = Message.SC_DEAD.decode(buffer);
                console.log('--------recv MSG_DEAD : ', data);
                Events.emit(EventName.ACTOR_DEAD, data);
                for (let index = 0; index < data.length; index++) {
                    this.clearActorDataById(data[index])
                }
            }

                break;
            case MessageType.MSG_MOVE: { // 移动
                let data = Message.SC_MOVE.decode(buffer);
                if (data.id == this._poleId) {
                    Events.emit(EventName.POLE_MOVE, data);
                    console.log('--------recv POLE_MOVE : ', data);
                } else {
                    console.log('--------recv MSG_MOVE : ', data);
                    var copyData = Tool.deepCopy(this.redActorMap.get(data.id) || this.blueActorMap.get(data.id));
                    copyData["x"]= data.x;
                    copyData["y"]= data.y;
                    this.setActorData(data.id, copyData, false);
                    Events.emit(EventName.ACTOR_MOVE, copyData);
                }
            }

                break
            case MessageType.MSG_MONSTER_ENTER: { // 新加入角色
                let data = Message.SC_MONSTER_ENTER.decode(buffer);
                console.log('--------recv MSG_MONSTER_ENTER : ', data);
                for (let index = 0; index < data.monsters.length; index++) {
                    let actorData = data.monsters[index];
                    this.setActorData(actorData.id, actorData, true);
                    Events.emit(EventName.ACTOR_ADD, actorData);
                }
            }
        
            default:
                break;
        }
    }

    /**
     * @description: 初始化游戏数据（加入房间）
     * @param {*} data
     * @return {*}
     */
    private redActorMap: Map<number, []> = new Map(); // 红方怪物
    private blueActorMap: Map<number, []> = new Map(); // 蓝方怪物
    private redObstaclesMap: Map<number, []> = new Map(); // 红方障碍物
    private blueObstaclesMap: Map<number, []> = new Map(); // 蓝方障碍物
    initGameData(data) {
        for (let index = 0; index < data.campInfos.length; index++) {
            let campData = data.campInfos[index];
            if (campData.campId == ActorCamp.CampRed) {
                for (let i = 0; i < campData.monsters.length; i++) {
                    let actorData = campData.monsters[i];
                    this.redActorMap.set(actorData.id, actorData);
                }
                for (let i = 0; i < campData.obstacles.length; i++) {
                    let obstaclesData = campData.obstacles[i];
                    this.redObstaclesMap.set(obstaclesData.id, obstaclesData);
                }
            } else if (campData.campId == ActorCamp.CampBlue) {
                for (let i = 0; i < campData.monsters.length; i++) {
                    let actorData = campData.monsters[i];
                    this.blueActorMap.set(actorData.id, actorData);
                }
                for (let i = 0; i < campData.obstacles.length; i++) {
                    let obstaclesData = campData.obstacles[i];
                    this.blueObstaclesMap.set(obstaclesData.id, obstaclesData);
                }
            }
        }
    }

    /**
     * @description: 修改角色数据
     * @param {number} actorId
     * @param {*} data
     * @param {*} bAdd // 是否是新加入
     * @return {*}
     */    
    setActorData(actorId: number, data: [], bAdd: boolean) {
        if (this.redActorMap.has(actorId) || (bAdd && data['campId'] == ActorCamp.CampRed)) {
            this.redActorMap.set(actorId, data);
        } else if (this.blueActorMap.has(actorId) || (bAdd && data['campId'] == ActorCamp.CampBlue)) {
            this.blueActorMap.set(actorId, data);
        }
    }

    /**
     * @description: 根据角色ID获取角色数据
     * @param {ActorCamp} campType 阵营
     * @param {*} actorId 角色id
     * @return {*} data
     */
    public getActorDataById(actorId: number) {
        return this.redActorMap.get(actorId) || this.blueActorMap.get(actorId)
    }

    /**
     * @description: 根据角色ID删除角色数据
     * @param {*} actorId
     * @return {*}
     */    
    public clearActorDataById(actorId: number) {
        if (this.redActorMap.has(actorId)) {
            this.redActorMap.delete(actorId)
        } else if (this.blueActorMap.has(actorId)) {
            this.blueActorMap.delete(actorId);
        }
    }

    /**
     * @description: 根据障碍物ID 获取障碍物数据
     * @param {*} actorId 障碍物id
     * @return {*} data
     */
    public getObstaclesDataById(obstaclesId: number) {
        return this.redObstaclesMap.get(obstaclesId) || this.blueObstaclesMap.get(obstaclesId);
    }
    
    /**
     * @description: 根据障碍物ID 删除障碍物数据
     * @param {ActorCamp} campType
     * @param {*} obstaclesId
     * @return {*}
     */    
    public clearObstaclesDataById(obstaclesId: number) {
        if (this.redObstaclesMap.has(obstaclesId)) {
            this.redObstaclesMap.delete(obstaclesId);
        } else if (this.blueObstaclesMap.has(obstaclesId)) {
            this.blueObstaclesMap.delete(obstaclesId);
        }
    }

    /**
     * @description: 根据阵容类型获取 角色map
     * @param {ActorCamp} campType
     * @return {*}
     */    
    public getActorMapByCamp(campType: ActorCamp | string) {
        if (campType == ActorCamp.CampRed) {
            return this.redActorMap;
        } else if (campType == ActorCamp.CampBlue) {
            return this.blueActorMap;
        }
    }
    
    /**
     * @description: 进入房间
     * @return {*}
     */
    onEnterRoom() {
        let data = new Message.CS_ENTER_ROOM();
        data.roomId = UserModule.instance.roomId;
        console.log("---sendLoginReq:" + JSON.stringify(data));
        AccessSocket.getInstance().sendMsg(MessageType.MSG_ENTER_ROOM, Message.CS_ENTER_ROOM.encode(data).finish());
    }
}
