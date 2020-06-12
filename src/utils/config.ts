// Created by szatpig at 2019/8/22.
let config:ConfigInterface = {};

//统一前端面加反斜杠
const hostname = window.location.host.split('.')[0]
/*
@base: 基础接口 api域名
@registerPath: 单独处理-申请列表-开通正式  调用外呼前台api域名
@voicePath： 固定前后台使用的音频文件地址
@moneyBase： 单独处理-收款记录 调用充值模块的api域名
*/

let base='',
    admin='', //中台请求地址
    prefix='/industryUser',
    version='202003091319',
    exeUrl='http://192.168.88.54'


switch (hostname){
    case '10':
    case 'localhost':
        base = 'http://192.168.88.51:8085';
        admin = "http://192.168.88.51:8080"
        exeUrl = 'http://192.168.88.54'
        break;
    default:
        base = '';
        break;
}

config = {
    base: base + prefix,
    upload:base + prefix,
    admin: admin+ '/internal',
    download:'http://192.168.88.71',
    version,
    exeUrl
}

interface ConfigInterface {
    base?: string,
    admin?: string,
    upload?: string,
    download?:string,
    version?: string,
    exeUrl?: string
}

export default config;


/*
更改说明：
如果是线上的地址更改：修改21行的case
*/

