import { EventName } from "../../librarys/const/EventName";
import { ResUrl } from "../../librarys/const/Url";
import RecyclePool from "../../librarys/utils/RecyclePool";
import Res from "../../librarys/utils/Res";
import SkillNode from "./SkillNode";

/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-26 15:00:44
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-07-27 15:21:32
 * @FilePath: \barrage_yw_client\assets\script\ui\Skill\SkillManager.ts
 * @Description: 技能管理器
 */
export class SkillManager {
    private static _instance: SkillManager;
    static get instance() {
        if (this._instance ==null) {
            this._instance = new SkillManager();
        }
        return this._instance;
    }

    private skillPools: RecyclePool = new RecyclePool();
    
    init() {
        for (let index = 0; index < 30; index++) {
            this.createSkillPool();
        }
    }

    /**
     * @description: 创建技能放入对象池
     * @return {*}
     */    
    private async createSkillPool() {
        let prefab: cc.Prefab = Res.get(ResUrl.SKILL, cc.Prefab) || await Res.load(ResUrl.SKILL, cc.Prefab);
        var skillNode = Res.instantiate(prefab);
        this.skillPools.put('skill', skillNode);
        skillNode.getComponent(SkillNode).init();
        console.log('------创建 技能对象池: ', this.skillPools.size('skill'));
    }

    /**
     * @description: 对象池中获取技能
     * @param {string} key
     * @param {any} data
     * @param {cc} parentNode
     */    
    public getSkillByPool(key: string, data: any, parentNode: cc.Node) {
        var skillNode = this.skillPools.get(key);
        if (skillNode == null) {
            this.createSkillPool();
            skillNode = this.skillPools.get(key);
        }
        skillNode.parent = parentNode;
        skillNode.once(EventName.SKILL_DEAD, this.onSkillDead, this);
        skillNode.getComponent(SkillNode).reuse(data);
    
    }

    /**
     * @description: 技能销毁
     * @param {cc} skillNode
     */    
    private onSkillDead(skillNode: cc.Node) {
        skillNode.getComponent(SkillNode).unuse();
        this.skillPools.put('skill', skillNode);
        // skillNode.active = false;
    }
}
