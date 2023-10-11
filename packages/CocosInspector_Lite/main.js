'use strict';
const _0x5ace = [
    'file://',
    'GJydw',
    'electron.h',
    'exports',
    'loadURL',
    'process',
    'path',
    'Cocos\x20Insp',
    'tml',
    'name',
    '1sPfqHx',
    'AorpA',
    'ready-to-s',
    'ZypOp',
    'showWindow',
    './package.',
    'zfLDk',
    '146318KiriGv',
    'json',
    'gyJXA',
    'index_low_',
    'aScript',
    '148847EFQfRZ',
    '1wjiyXW',
    '#2e2c29',
    'how',
    'electron',
    'closed',
    'dow',
    '215854xekLBc',
    'previewPor',
    'PreviewSer',
    'index.html',
    'de(',
    '418048VfKqmL',
    '22hpCNKu',
    'v.switchMo',
    'executeJav',
    '339553KbIlwk',
    'GTcXX',
    '100661KclgPq',
    '&mode=',
    'd.js',
    'tryShowWin',
    '3ExLrDf',
    'mainPreloa',
    '2ntkhsy',
    'webContent',
    'ector\x20Lite',
    'show',
    '?port=',
    '13070AbWurj',
    'larHt',
    'error',
    'setMenu',
    'ver',
    'join'
];
function _0x40c7(_0x277426, _0x136c90) {
    _0x277426 = _0x277426 - (0x7 * 0x9d + -0x1 * -0x6a + 0x1f * -0x22);
    let _0x27e05f = _0x5ace[_0x277426];
    return _0x27e05f;
}
const _0x24bf27 = _0x40c7;
(function (_0x33e02a, _0x17670e) {
    const _0x22e29e = _0x40c7;
    while (!![]) {
        try {
            const _0x2cbaaa = -parseInt(_0x22e29e(0xbd)) * parseInt(_0x22e29e(0xa1)) + -parseInt(_0x22e29e(0xa6)) * -parseInt(_0x22e29e(0xcf)) + parseInt(_0x22e29e(0xc3)) * -parseInt(_0x22e29e(0xc9)) + parseInt(_0x22e29e(0xc2)) * parseInt(_0x22e29e(0x9f)) + parseInt(_0x22e29e(0x99)) + -parseInt(_0x22e29e(0xb6)) * -parseInt(_0x22e29e(0x9b)) + -parseInt(_0x22e29e(0xce));
            if (_0x2cbaaa === _0x17670e)
                break;
            else
                _0x33e02a['push'](_0x33e02a['shift']());
        } catch (_0x44f376) {
            _0x33e02a['push'](_0x33e02a['shift']());
        }
    }
}(_0x5ace, -0x20 * 0x3a69 + 0x1 * -0x4250e + 0xf39fb));
const {BrowserWindow, app, remote, ipcMain} = require(_0x24bf27(0xc6)), path = require(_0x24bf27(0xb2)), pcs = require(_0x24bf27(0xb1)), folder = '', devTools = ![];
let win, mode = 0x198 + 0xf00 + -0x1098, unloaded = ![];
const PKG_NAME = require(_0x24bf27(0xbb) + _0x24bf27(0xbe))[_0x24bf27(0xb5)];
module[_0x24bf27(0xaf)] = {
    'load'() {
    },
    'unload'() {
        unloaded = !![];
    },
    'showWindow'() {
        const _0x23a324 = _0x24bf27, _0x61df58 = {
                'gyJXA': _0x23a324(0xb3) + _0x23a324(0xa3),
                'zfLDk': _0x23a324(0xc4),
                'GTcXX': _0x23a324(0xb8) + _0x23a324(0xc5),
                'ZypOp': _0x23a324(0xc7),
                'GJydw': function (_0x44d455, _0x1fd283) {
                    return _0x44d455 + _0x1fd283;
                },
                'AorpA': _0x23a324(0xa5),
                'larHt': _0x23a324(0x9c)
            };
        if (win) {
            win[_0x23a324(0xa4)](), win[_0x23a324(0xa2) + 's'][_0x23a324(0x98) + _0x23a324(0xc1)](_0x23a324(0x97) + _0x23a324(0xcd) + mode + ')');
            return;
        }
        win = new BrowserWindow({
            'minWidth': 0x36e,
            'minHeight': 0x258,
            'width': 0x36e,
            'height': 0x258,
            'title': _0x61df58[_0x23a324(0xbf)],
            'backgroundColor': _0x61df58[_0x23a324(0xbc)],
            'useContentSize': ![],
            'webPreferences': {
                'enablePreferredSizeMode': !![],
                'preferredSizeMode': !![],
                'webviewTag': !![],
                'nodeIntegration': !![],
                'enableRemoteModule': !![],
                'devTools': devTools,
                'contextIsolation': ![],
                'preload': path[_0x23a324(0xab)](__dirname, folder + (_0x23a324(0xa0) + _0x23a324(0x9d)))
            }
        }), win[_0x23a324(0xa9)](null), win['on'](_0x61df58[_0x23a324(0x9a)], () => win[_0x23a324(0xa4)]()), win['on'](_0x61df58[_0x23a324(0xb9)], () => {
            win = null;
        });
        let _0x57630c = folder + (_0x23a324(0xc0) + _0x23a324(0xae) + _0x23a324(0xb4));
        _0x57630c = folder + _0x23a324(0xcc);
        let _0x48524e = path[_0x23a324(0xab)](__dirname, _0x61df58[_0x23a324(0xad)](_0x61df58[_0x23a324(0xad)](_0x61df58[_0x23a324(0xad)](_0x61df58[_0x23a324(0xad)](_0x57630c, _0x61df58[_0x23a324(0xb7)]), Editor[_0x23a324(0xcb) + _0x23a324(0xaa)][_0x23a324(0xca) + 't']), _0x61df58[_0x23a324(0xa7)]), mode));
        win[_0x23a324(0xb0)](_0x23a324(0xac) + _0x48524e);
    },
    'tryShowWindow'(_0x41e3fb) {
        const _0xa75192 = _0x24bf27;
        mode = _0x41e3fb;
        try {
            this[_0xa75192(0xba)]();
        } catch (_0x4e9ecd) {
            Editor[_0xa75192(0xa8)](_0x4e9ecd);
        }
    },
    'messages': {
        'previewMode'() {
            const _0x4d82ca = _0x24bf27;
            if (unloaded)
                return;
            this[_0x4d82ca(0x9e) + _0x4d82ca(0xc8)](-0x21e9 + -0x1e5c + 0x4045);
        },
        'buildMode'() {
            const _0x3a287b = _0x24bf27;
            if (unloaded)
                return;
            this[_0x3a287b(0x9e) + _0x3a287b(0xc8)](0xb1c + 0x1 * -0x3ee + -0x72d);
        }
    }
};