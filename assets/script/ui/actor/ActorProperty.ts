/**
 * @description: 角色状态
 */
export enum ActorState {
    Idle = "idle", // 等待
    Move = "move", // 玩家移动
    Attack = "Attack", // 攻击
    UnAttack = "UnAttack", // 受到攻击
    Defense = "defense", // 防御
    Die = "die", // 死亡
}

/**
 * @description: 角色类型
 */
export enum ActorType {
    actor1 = "1",
    actor2 = "2",
    actor3 = "3",
    actor4 = "4",
}

/**
 * @description: 角色类型
 */
export enum ActorCamp {
    CampRed = "1",
    CampBlue = "2",
}

/**
 * @description: 角色属性
 */
export class ActorProperty {

    /**
     * 最大生命值
     */    
    maxHp: number = 100;

    /**
     * 生命值
     */
    hp: number = 0;

    /**
     * 攻击力
     */
    attack: number = 10;

    /**
     * 等级 
     */    
    level: number = 1;

    /**
     * 经验
     */    
    exp: number = 0;

    get hpPrecent():number {
        return cc.misc.clamp01(this.hp / this.maxHp);
    }

}
