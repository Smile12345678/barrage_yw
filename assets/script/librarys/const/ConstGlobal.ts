/*
 * @Author: zzq
 * @Date: 2020-07-09 10:15:27
 * @LastEditTime: 2023-08-01 10:33:57
 * @LastEditors: DESKTOP-340FTRG\admin 1102702578@qq.com
 * @Description: In User Settings Edit
 */
// declare var Plat: string; // 渠道标识
// declare var LocalVersion: string; // 客户端本地版本
// declare var ServerVersion: string; // 服务器版本
// declare var bMaintain: boolean; // 是否停服
// declare var debug: boolean; // 是否是debug
// declare var HOST_URL: string; // 连接地址

window['LocalVersion'] = '1.0.0';
window['ServerVersion'] = '1.0.0';
window['bMaintain'] = false;
window['debug'] = true;
window['HOST_URL'] = 'https://hdtest.byxgame.com';
window['Plat'] = 'dev';
// declare global {
//     console.log('global method called'); 
    // this.Plat = 0;
    // //本地登录
    // this.LocalVersion = '1.0.4';
    // this.ServerVersion = '1.0.0';
    // // --------------- config 文件 ----------
    // this.CONFIG_URL = `https://by-game.byxgame.com/island2/debug/${this.LocalVersion}/config.json`;

    // // 语音配置
    // this.LAN_TYPE = 'cn_lan';
    // // 维护中

    // //是否debug模式( )
    // this.debug = true;
    // //是否显示log
    // this.debugLog = true;
    if (window['debug']) {
        window['HOST_URL'] = 'http://192.168.0.220:8080';// hwq地址
    //     // this.HOST_URL = 'http://192.168.20.54:997';// csj地址
        // this.HOST_URL = 'https://hdtest.byxgame.com';  // 测试服;//'http://121.5.180.131:8001';// 内网地址
    } else {
        window['HOST_URL'] = 'https://island.byxgame.com';  // 测试服;//'http://121.5.180.131:8001';// 内网地址
    //     this.CONFIG_URL = `https://by-game.byxgame.com/island2/release/${this.LocalVersion}/config.json`;
    }
// }
// export {};

//------------------Env Begin------------------

