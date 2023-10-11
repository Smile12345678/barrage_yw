/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-06-27 15:19:26
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-08-01 11:44:43
 * @FilePath: \barrage_yw_client\assets\script\librarys\const\EventName.ts
 * @Description: 事件
 */
const { ccclass, property } = cc._decorator;
/**
 * 事件名
 */
@ccclass('EventName')
export class EventName {
	

	
	static LOGIN_ERROR: string = "LOGIN_ERROR"; //登录错误
	static ENTER_ROOM: string = "ENTER_ROOM"; // 进入房间
	static TOKEN_ERROR: string = "TOKEN_ERROR";// token失败
	static SOCKET_SUCCESS: string = "SOCKET_SUCCESS"; // socket连接成功

	/** cc.view 调整视窗尺寸的事件，仅在 Web 平台下有效 */
	static RESIZE: string = "RESIZE";
	/** 更新多语言组件 */
	static UPDATE_LOCALIZED_CMPT: string = "UPDATE_LOCALIZED_CMPT";

	/** 游戏暂停 */
	static GAME_PAUSE: string = "GAME_PAUSE";
	/** 游戏恢复 */
	static GAME_RESUME: string = "GAME_RESUME";
	/** 游戏时间缩放值修改 */
	static TIME_SCALE: string = "TIME_SCALE";

	/** 相机移动 */
	static CAMERA_MOVE: string = "CAMERA_MOVE";

	static EVENT_TEST1: string = "EVENT_TEST1";
	static EVENT_TEST2: string = "EVENT_TEST2";

	static UPDATE_GAME_PROGRESS: string = "UPDATE_GAME_PROGRESS"; // 更新游戏进度
	static UPDATE_RANK_INFO: string = "UPDATE_RANK_INFO"; // 更新游戏中排行信息
	
	static ACTOR_ADD: string = "ACTOR_ADD"; // 角色添加
	static ACTOR_DEAD: string = "ACTOR_DEAD"; // 角色死亡
	static ACTOR_MOVE: string = "ACTOR_MOVE"; // 角色移动
	static POLE_MOVE: string = "POLE_MOVE"; // 杆子移动
	static UPDATE_OBSTACLE: string = "UPDATE_OBSTACLE"; //障碍物刷新

	static SKILL_DEAD: string = "SKILL_DEAD"; // 技能消失

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