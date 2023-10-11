/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-25 15:39:25
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-07-25 16:35:42
 * @FilePath: \barrage_yw_client\assets\script\ui\game\GameRank.ts
 * @Description: 玩法进度
 */

import { EventName } from "../../librarys/const/EventName";
import { eventsOnLoad, preloadEvent } from "../../librarys/utils/Events";

const {ccclass, property} = cc._decorator;

@ccclass
@eventsOnLoad()
export default class GameRank extends cc.Component {

    @property(cc.ProgressBar) // 红方进度
    redBar: cc.ProgressBar = null;

    @property(cc.ProgressBar) // 蓝方进度
    blueBar: cc.ProgressBar = null;

    @property(cc.Node)
    redRankNode: cc.Node[] = [];

    @property(cc.Node)
    blueRankNode: cc.Node[] = [];
    // onLoad () {}

    start () {

    }

    init() {

    }

    /**
     * @description: 更新游戏进度
     * @return {*}
     */    
    @preloadEvent(EventName.UPDATE_GAME_PROGRESS)
    private updateProgress(data: []) {

    }

    /**
     * @description: 更新游戏中排行信息
     * @return {*}
     */    
    @preloadEvent(EventName.UPDATE_RANK_INFO)
    private updateRankActor(data: []) {

    }
} 
