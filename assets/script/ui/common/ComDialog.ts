/*
 * @Author: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Date: 2023-07-24 19:59:12
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @LastEditTime: 2023-07-25 10:17:54
 * @FilePath: \barrage_yw_client\assets\script\ui\common\ComDialog.ts
 * @Description: 通用弹窗
 */
import DialogBase from "../../base/DialogBase"
import { EventName } from "../../librarys/const/EventName";
import { DirUrl } from "../../librarys/const/Url"
import Events, { eventsOnEnable, preloadEvent } from "../../librarys/utils/Events";
import Tool from "../../librarys/utils/Tool";

const { ccclass, property } = cc._decorator;

@ccclass
@eventsOnEnable()
export default class ComDialog extends DialogBase {
    public static pUrl: string = DirUrl.PREFAB_COMMON + "ComDialog";

    @property(cc.Label) infoLab: cc.Label = null;
    _callback: Function = null;

    public onOpen(param) {
        if (param) {
            if (param.text) {
                this.infoLab.string = param.text;
            }
            if (param.callback) {
                this._callback = param.callback;
            }
        }
    }

    public onClose() {
        if (this._callback) {
            this._callback();
        }
    }

    private async onClickEmit() {
        await Events.emitAsync(EventName.EVENT_TEST1, "触发了事件1，请等待事件2");
        Events.emit(EventName.EVENT_TEST2, "触发了事件2");
    }



    @preloadEvent(EventName.EVENT_TEST1)
    private async eventTest1(str: string) {
        this.infoLab.string = str;
        await Tool.waitCmpt(this, 1);
    }

    @preloadEvent(EventName.EVENT_TEST2)
    private eventTest2(str: string) {
        this.infoLab.string = str;
    }
}
