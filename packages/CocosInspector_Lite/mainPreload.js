const _0x12b0 = [
    '16983BTnmWX',
    '9029EOeOMF',
    'config.jso',
    'readFileSy',
    'join',
    '3WVDwLl',
    'VqIZn',
    'nspector-l',
    'utf-8',
    '385NkEzZQ',
    'readConfig',
    '477pcOehr',
    'stringify',
    '182947OScnHm',
    '.json',
    'saveConfig',
    'existsSync',
    'ync',
    '1YvVhts',
    '58842EmInzG',
    '../cocos-i',
    '121153hURRPQ',
    'path',
    '247IRRBCx',
    'ite-config',
    'writeFileS',
    'parse',
    '2417etLCnR',
    'sRJlP'
];
const _0x183273 = _0x25a8;
function _0x25a8(_0x138ae3, _0x3cbcef) {
    _0x138ae3 = _0x138ae3 - (0x1c4e + -0x1f0d + 0x1 * 0x395);
    let _0x20d404 = _0x12b0[_0x138ae3];
    return _0x20d404;
}
(function (_0x1cff50, _0x5a8242) {
    const _0xa8cc0c = _0x25a8;
    while (!![]) {
        try {
            const _0x44bc8c = -parseInt(_0xa8cc0c(0xd8)) * parseInt(_0xa8cc0c(0xda)) + -parseInt(_0xa8cc0c(0xdc)) + parseInt(_0xa8cc0c(0xe4)) * -parseInt(_0xa8cc0c(0xe1)) + parseInt(_0xa8cc0c(0xe2)) + -parseInt(_0xa8cc0c(0xed)) + -parseInt(_0xa8cc0c(0xf1)) * parseInt(_0xa8cc0c(0xec)) + -parseInt(_0xa8cc0c(0xea)) * -parseInt(_0xa8cc0c(0xe6));
            if (_0x44bc8c === _0x5a8242)
                break;
            else
                _0x1cff50['push'](_0x1cff50['shift']());
        } catch (_0x4483e0) {
            _0x1cff50['push'](_0x1cff50['shift']());
        }
    }
}(_0x12b0, -0x7 * 0x444b + -0x2b * -0x991 + 0x1e908));
let fs = require('fs'), path = require(_0x183273(0xe5)), _configPath = path[_0x183273(0xf0)](__dirname, _0x183273(0xee) + 'n'), __parentConfig = path[_0x183273(0xf0)](__dirname, _0x183273(0xe3) + _0x183273(0xd6) + _0x183273(0xe7) + _0x183273(0xdd));
global[_0x183273(0xd9)] = () => {
    const _0x19d73a = _0x183273, _0x472c82 = { 'VqIZn': _0x19d73a(0xd7) };
    let _0x4480b0 = '';
    return fs[_0x19d73a(0xdf)](__parentConfig) ? _0x4480b0 = fs[_0x19d73a(0xef) + 'nc'](__parentConfig, { 'encoding': _0x472c82[_0x19d73a(0xf2)] }) : _0x4480b0 = fs[_0x19d73a(0xef) + 'nc'](_configPath, { 'encoding': _0x472c82[_0x19d73a(0xf2)] }), JSON[_0x19d73a(0xe9)](_0x4480b0);
}, global[_0x183273(0xde)] = _0x5b9aaa => {
    const _0x4cfa73 = _0x183273, _0x3819ad = { 'sRJlP': _0x4cfa73(0xd7) };
    let _0x175993 = JSON[_0x4cfa73(0xdb)](_0x5b9aaa);
    fs[_0x4cfa73(0xe8) + _0x4cfa73(0xe0)](__parentConfig, _0x175993, { 'encoding': _0x3819ad[_0x4cfa73(0xeb)] });
};