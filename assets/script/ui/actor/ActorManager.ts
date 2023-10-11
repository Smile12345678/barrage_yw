/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-21 15:14:35
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-07-29 16:02:53
 * @FilePath: \barrage_yw_client\assets\script\ui\actor\PlayerManager.ts
 * @Description: 角色管理器
 */
import RecyclePool from "../../librarys/utils/RecyclePool";
import Res from "../../librarys/utils/Res";
import { ResUrl } from "../../librarys/const/Url";
import { EventName } from "../../librarys/const/EventName";
import { ActorCamp } from "./ActorProperty";
import  ActorNode  from "../actor/ActorNode";

export class ActorManager {
    private static _instance: ActorManager;
    private allActorMap: Map<string, cc.Node> = new Map();

    static get instance() {
        if (this._instance == null) {
            this._instance = new ActorManager();
        }
        return this._instance;
    }

    //创建对象池
    private actorPools: RecyclePool = new RecyclePool();
    
    async init() {
        for (let index = 0; index < 50; index++) {
            await this.createActorPool(ActorCamp.CampRed);
        }
        for (let index = 0; index < 50; index++) {
            await this.createActorPool(ActorCamp.CampBlue);
        }
    }

    /**
     * @description: 创建的角色放入对象池
     * @param {string} campType 角色类型(红、蓝)
     */    
    private async createActorPool(campType: string) {
        let prefab: cc.Prefab = Res.get(ResUrl.ACTOR['ACTOR' + campType], cc.Prefab) || await Res.load(ResUrl.ACTOR['ACTOR' + campType], cc.Prefab);
        var actorNode = Res.instantiate(prefab);
        this.actorPools.put(campType, actorNode);
        actorNode.getComponent(ActorNode).init(campType);
        console.log('------创建 角色对象池: ', this.actorPools.size(campType));
        // return actorNode;
    }

    /**
     * @description: 对象池中获取角色
     * @param {string} campType
     * @param {any} data
     * @param {cc} parentNode
     * @return {*}
     */    
    public async getActorByCampType(campType: string, data: any, parentNode: cc.Node) {
        let actorNode = this.actorPools.get(campType);
        if (actorNode == null) {
            actorNode = await new Promise((resolve, reject) => {
                this.createActorPool(campType);
                actorNode = this.actorPools.get(campType);
                if (actorNode) {
                    resolve(actorNode);
                } else {
                    resolve(null);
                }
            });
        }

        if (!actorNode) {
            console.log();
        } else {
            actorNode.parent = parentNode;
            actorNode.once(EventName.ACTOR_DEAD, this.onActorDead, this);
            actorNode.getComponent(ActorNode).reuse(data);
            // 所有在场景里的角色
            this.allActorMap.set(data.id, actorNode);
            console.log('------取出 角色对象池: ', this.actorPools.size(campType));
        }
    }

    /**
     * @description: 玩家死亡(放回对象池)
     * @param {Node} actorNode
     * @return {*}
     */    
    private onActorDead(campType: string, actorNode: cc.Node, actorId: string) {
        console.log('------放入 角色对象池: ', this.actorPools.size(campType));
        actorNode.getComponent(ActorNode).unuse();
        this.actorPools.put(campType, actorNode);
        this.allActorMap.delete(actorId);
        // actorNode.active = false;
        // let skeletonAnimation = node.getComponent(Actor).skeletalAnimation;
        // skeletonAnimation.once(Animation.EventType.FINISHED, (type: Animation.EventType, state: SkeletalAnimationState) => {
        //     if (state.name == StateDefine.Die) {
        //         this.enemyPools.free(node.name, node);
        //         let index = this.enemies.indexOf(node);
        //         this.enemies.splice(index, 1);
        //         EffectManager.instance?.play(
        //             DynamicResourceDefine.Effect.EffDie,
        //             node.worldPosition);
        //         node.active = false;
        //     }
        // }, this);
    }

    /**
     * @description: 根据角色ID 返回Node
     * @param {*} actorId
     * @return {*} Node
     */    
    public getActorNodeById(actorId) {
        return this.allActorMap.get(actorId);
    }

    /**
     * @description: 清空所有角色数据
     */    
    clear() {
        this.actorPools.clearAll()
        this.allActorMap.clear()
    }

    

}
