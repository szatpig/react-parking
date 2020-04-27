// Created by szatpig at 2019/8/22.
let config:ConfigInterface = {};
const hostname = window.location.host.split('.')[0];
/*
@base: 基础接口 api域名
@registerPath: 单独处理-申请列表-开通正式  调用外呼前台api域名
@voicePath： 固定前后台使用的音频文件地址
@moneyBase： 单独处理-收款记录 调用充值模块的api域名
*/

//dev 环境192.168.88.54:7302   qa环境192.168.88.54:7303  uat环境192.168.88.54:7304   本地自动会走dev环境
const port = window.location.port === '7303' ? 'qa' : (window.location.port === '7304' ? 'uat' : 'dev');

let base = '',
        registerPath = '',
        moneyBase = '',
        voicePath = 'http://192.168.88.71/',
        listenAudioPath = 'http://192.168.88.71/outbound/' + port + '/audio/upAndCompose/',
        iaAudioPath = 'http://192.168.88.71/',
        downTempPath = 'http://192.168.88.71/outbound/' + port + '/download';


switch (hostname) {
    case 'outbound': //线上的地址
        base = '/outbound-cms';
        registerPath = '/outplan/';
        voicePath = 'https://file.ynt.ai/';
        listenAudioPath = 'https://file.ynt.ai/outbound/product/audio/upAndCompose/';
        iaAudioPath = 'https://file.ynt.ai/';
        downTempPath = 'https://file.ynt.ai/outbound/product/download';
        break;
    case 'localhost':
    case '10':
    case '127': //我们本地的地址
        base = 'http://192.168.88.54:7304/outbound-cms';
        // base = 'http://10.1.50.235:8002/outbound-cms';
        registerPath = 'http://192.168.88.54:7304/outplan/';
        break;
    default: //默认各种测试环境的地址
        base = '/outbound-cms'; /*更改路径注意点：修改listenAudioPath中的dev也要换掉*/
        registerPath = '/outplan/';
}

config = {
    base: 'http://192.168.88.54:7304/outbound-cms',
    registerPath: registerPath,
    voicePath: voicePath,
    moneyBase: moneyBase,
    listenAudioPath: listenAudioPath,
    iaAudioPath: iaAudioPath,
    downTempPath: downTempPath,
}

interface ConfigInterface {
    base?: string,
    registerPath?: string,
    voicePath?: string,
    moneyBase?: string,
    listenAudioPath?: string,
    iaAudioPath?: string,
    downTempPath?: string,
}

export default config;


/*
更改说明：
如果是线上的地址更改：修改21行的case
*/

