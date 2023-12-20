import { _decorator, CCFloat, CCString, Component, instantiate, Node, Prefab, ScrollView, UITransform } from 'cc';
import { DEV } from 'cc/env';
import { Logger } from '../utils/Logger';
const { ccclass, property, menu, requireComponent, executionOrder, disallowMultiple } = _decorator;

@ccclass('TableViewExtend')
@menu('TableViewExtend')
@requireComponent(ScrollView)
@disallowMultiple()
@executionOrder(-5000)
export class TableViewExtend extends Component {
    @property({
        type: Prefab,
        tooltip: DEV && '模板Item',
    })
    cellPfb: Prefab = null;

    @property({
        type: Prefab,
        tooltip: DEV && '展开Item',
    })
    detailPfb: Prefab = null;

    @property({
        type: CCFloat,
        tooltip: DEV && '间距',
    })
    cellInterval = 0;

    @property({
        type: CCFloat,
        tooltip: DEV && '高度',
    })
    cellHeight = 0;

    // @property({
    //     type: CCFloat,
    //     tooltip: DEV && '数量',
    // })
    // _cellNumber = 0;

    @property({
        type: CCString,
        tooltip: DEV && 'item的脚本名',
    })
    cellJsName = 'cell';

    @property({
        type: CCFloat,
        tooltip: DEV && 'detail间距',
    })
    detailInterval = 0;

    @property({
        type: CCFloat,
        tooltip: DEV && '展开二级的高度',
    })
    detailHeight = 0;

    @property({
        type: CCString,
        tooltip: DEV && '展开二级的脚本名',
    })
    detailJsName = 'detail';

    private _javaScriptName: string = 'TableViewExtend';
    private _default_cell: Node = null;
    private _detail: Node = null;
    private _idx_arr: number[];
    private _cell_arr: Node[];
    private _cell_pool: Node[];
    private _last_touchCell_idx: number = -1;
    private _detail_isAdd: boolean = false;
    private _detail_idx: number = -1;
    private _visibleCellNum: number = -1;
    private _data_arr: any[];
    private _scrollView: ScrollView = null;
    private _content: Node = null;
    private _tableHeight: number = null;
    private _cellNumber: number = 0;
    private _detailInterval = 0;
    // 外部调用初始化，出入数据
    init(data) {
        // cell
        if (data.length == 0) {
            return;
        }
        this._default_cell = instantiate(this.cellPfb);
        this._detail = instantiate(this.detailPfb);

        this._idx_arr = [];// 当前显示几个cell的idx数组
        this._cell_arr = [];// 当前显示的cell数组
        this._cell_pool = [];// 回收池中的cell数组
        this._last_touchCell_idx = -1;// 保存前一次点击的cell
        this._detail_isAdd = false;// 是否添加了detail
        this._detail_idx = -1;// detail的idx
        this._detailInterval = 0;
        /**
         * 初始化数据
        */
        this._data_arr = data;

        /*
        *   动态设置基本属性
        */
        this.cellHeight = this._default_cell.getComponent(UITransform).height;
        this._cellNumber = this._data_arr.length;
        this.detailHeight = this._detail.getComponent(UITransform).height;

        // 添加滚动监听
        this._content = this.getComponent(ScrollView).content;
        this._scrollView = this.node.getComponent(ScrollView);
        // this.initScrollViewEvent();
        this._registerEvent();

        // 设置滚动区域
        this._visibleCellNum = 0;// 显示cell的个数
        this.setContenSizeWithCellNumber(this._cellNumber);

        this.initCell();
    }

    initScrollViewEvent() {
        // 滚动监听
        const scrollViewEventHandler = new Component.EventHandler();
        scrollViewEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
        scrollViewEventHandler.component = this._javaScriptName;// 这个是代码文件名
        scrollViewEventHandler.handler = 'callback';
        scrollViewEventHandler.customEventData = 'foobar';
        this._scrollView.scrollEvents.push(scrollViewEventHandler);
    }

    _registerEvent() {
        this.node.on('scrolling', this.callback, this);
    }
    _unregisterEvent() {
        this.node.off('scrolling', this.callback, this);
    }

    // 注意参数的顺序和类型是固定的
    callback(scrollview, eventType, customEventData) {
        // 这里 scrollview 是一个 Scrollview 组件对象实例
        // 这里的 eventType === cc.ScrollView.EventType enum 里面的值
        // 这里的 customEventData 参数就等于你之前设置的 "foobar"
        // if (eventType == ScrollView.EventType.SCROLLING) {
        this.scrollviewDidScroll(scrollview);
        // }
    }

    scrollviewDidScroll(scrollview) {
        // Logger.log('scrollviewDidScroll');
        const p = this._scrollView.getScrollOffset();
        const topLine = p.y;
        const bottomLine = p.y + this.node.getComponent(UITransform).height;
        // Logger.log("topLine:"+ topLine + " --bottomLine:"+bottomLine);
        let firstIdx = parseInt((topLine / (this.cellHeight + this.cellInterval)).toString());
        if (this._detail_isAdd && firstIdx > this._detail_idx) {
            // eslint-disable-next-line max-len
            firstIdx = parseInt(((topLine - this.detailHeight - this.cellInterval - this.detailInterval) / (this.cellHeight + this.cellInterval)).toString());
        }

        let lastIdx = firstIdx + this._visibleCellNum;
        // Logger.log("top-idx:" + firstIdx + "  lastIdx:" + (firstIdx + this._visibleCellNum));
        if (lastIdx > this._cellNumber - 1) {
            lastIdx = this._cellNumber - 1;
        }
        // Logger.log('lastIdx:'+lastIdx + '  this._cellNumber:'+this._cellNumber);
        if (firstIdx >= 0) {
            this.reload(firstIdx, lastIdx);
        }
    }

    reload(firstIdx, lastIdx) {
        for (let i = 0; i < this._idx_arr.length; i++) {
            const currentIdx = this._idx_arr[i];
            // Logger.log('currentIdx:'+currentIdx +'--firstIdx:'+firstIdx + '  lastIdx:'+lastIdx);
            if (currentIdx < firstIdx || currentIdx > lastIdx) {
                Logger.log('currentIdx:'+currentIdx +'--firstIdx:'+firstIdx + '  lastIdx:'+lastIdx);
                this.removeCell(currentIdx);
                this._idx_arr.splice(i, 1);
            }
        }
        // Logger.log(this.idx_arr);
        // Logger.log(this.cell_arr);

        for (let k = firstIdx; k <= lastIdx; k++) {
            let tmp = k;
            for (let j = 0; j < this._idx_arr.length; j++) {
                if (this._idx_arr[j] == k) {
                    tmp = -1;
                }
            }
            // Logger.log('this.cell_arr.length:'+tmp);
            if (tmp >= 0) {
                this.addCell(tmp);
                this._idx_arr.push(tmp);
            }
        }
        // Logger.log('this.cell_arr.length:'+this._cell_arr.length);
    }

    // cell的点击回调
    touchCellCallBack(idx) {
        this._detail_idx = idx;// 保存位置，用于计算坐标
        if (this._last_touchCell_idx == idx) {
            Logger.log('REOMVE');
            this._last_touchCell_idx = -1;
            this._content.removeChild(this._detail);
            this._detail_isAdd = false;
            this._content.getComponent(UITransform).height -= this.detailHeight + this.detailInterval;
            this.reLayout();
            this.scrollviewDidScroll(this._scrollView); // 最后几个detail收起的时候 有空白区域留存 加这句代码可以解决
            return;
        }
        this._last_touchCell_idx = idx;
        Logger.log('Touch cell call back   idx:' + idx);
        this.addDetail(idx);
    }

    // 添加详情
    addDetail(idx) {
        const detailJs = this._detail.getComponent(this.detailJsName);
        // @ts-ignore
        detailJs.init(idx, this._data_arr[idx]);
        this._detail.setPosition(0, -((this.cellHeight + this.cellInterval) * idx + this.cellHeight + this.detailInterval));
        if (!this._detail_isAdd) {
            this._content.addChild(this._detail);
            this._detail_isAdd = true;
            this._content.getComponent(UITransform).height += this.detailHeight + this.detailInterval;
        }
        this.reLayout();
        if (idx == (this._data_arr.length - 1)) {
            this._scrollView.scrollToBottom(0.1, false);
        }
    }

    reLayout() {
        for (let i = 0; i < this._cell_arr.length; i++) {
            const cell = this._cell_arr[i];
            const cellJs = cell.getComponent(this.cellJsName);
            let y = 0;
            // @ts-ignore
            if (this._detail_isAdd && cellJs.idx > this._detail_idx) {
                // cell.getPosition().y = -((this.cellHeight + this.cellInterval) * cellJs.idx + this.detailHeight + this.cellInterval);
                y = -((this.cellHeight + this.cellInterval) * cellJs.idx + this.detailHeight + this.detailInterval + this._detailInterval);
                cell.setPosition(0, y);
            } else {
                // cell.getPosition().y = -(this.cellHeight + this.cellInterval) * cellJs.idx;
                y = -(this.cellHeight + this.cellInterval) * cellJs.idx;
                cell.setPosition(0, y);
            }
            // cell.setPosition(0, y);
            // Logger.log('reLayout---', y);
        }
    }

    /**
    * 设置滚动区域大小
    */
    setContenSizeWithCellNumber(num) {
        Logger.log(num, this.cellHeight, this.cellInterval);
        this._tableHeight = this.cellHeight + this.cellInterval;
        this._content.getComponent(UITransform).height = this._tableHeight * num - this.cellInterval;
        Logger.log('this.content.height', this._content.getComponent(UITransform).height);
        this._visibleCellNum = parseInt(((this.node.getComponent(UITransform).height / this._tableHeight) + 1).toString());
        Logger.log('visiblecell num', this._visibleCellNum);
        // Logger.log("this.content.height:"+this.content.height);
    }

    /**
    * 设置可视区域大小
    */
    setVisibleSize(width, height) {
        this.node.getComponent(UITransform).width = width;
        this.node.getComponent(UITransform).height = height;
    }

    // 初始化cell
    initCell() {
        for (let i = 0; i < this._cellNumber; i++) {
            this.addCell(i);
            this._idx_arr.push(i);
        }
    }

    // 重用或者新建cell
    getCell() {
        let cell = null;
        if (this._cell_pool.length == 0) {
            Logger.log('creat new cell');
            cell = instantiate(this._default_cell);
        } else {
            Logger.log('recycle old cell');
            cell = this._cell_pool[0];
            this._cell_pool.splice(0, 1);
        }
        this._cell_arr.push(cell);

        // Logger.log(this.cell_arr);
        // Logger.log(this.cell_pool);

        return cell;
    }

    // 添加cell
    addCell(idx) {
        const cell = this.getCell();
        const cellJs = cell.getComponent(this.cellJsName);

        /* cell的多样性 **************/
        const cellType = this._data_arr[idx] % 2;
        /** *************/

        // Logger.log('this._data_arr', this._data_arr);
        cellJs.init(this, idx, this._data_arr[idx], cellType);
        // cell.x = 0;

        let y = 0;
        if (this._detail_isAdd && idx > this._detail_idx) {
            y = -((this.cellHeight + this.cellInterval) * idx + this.detailHeight + this.cellInterval + this.detailInterval);
        } else {
            y = -(this.cellHeight + this.cellInterval) * idx;
        }

        this._content.addChild(cell);
        cell.setPosition(0, y);
    }

    // 移除cell
    removeCell(idx) {
        for (let i = 0; i < this._cell_arr.length; i++) {
            const cell = this._cell_arr[i];
            const cellJs = cell.getComponent(this.cellJsName);
            // @ts-ignore
            if (idx == cellJs.idx) {
                this._content.removeChild(cell);
                this._cell_arr.splice(i, 1);
                this._cell_pool.push(cell);
                break;
            }
        }
    }

    getCellArr() {
        return this._cell_arr;
    }

    getDetailIsAdd() {
        return this._detail_isAdd;
    }
}


