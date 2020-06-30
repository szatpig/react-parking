// Created by szatpig at 2019/5/21.
import axios from 'axios'
import { createBrowserHistory } from 'history';
import { stringify } from 'qs'
import store from '@/store'

import { message } from 'antd';

const history = createBrowserHistory();

// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.baseURL = '';

// http request 拦截器
axios.interceptors.request.use(
    config => {
        const { user:{ token } } = store.getState()
        if (token) {
            config.headers.token = token;
        }
        // message.loading('加载中...',15);
        return config;
    },
    err => {
        message.destroy();
        return Promise.reject(err);
    });

axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        message.destroy();
        if (error.response) {
            console.log(error.response)
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                    message.error(error.response.statusText);
                    break;
                case 403:
                    break;
                case 504:
                    break;
                case 500:
                    //store.dispatch(types.AJAX_ERROR,500);
                    message.error('网络超时，请刷新重试');
                    break;
                case 404:
                    message.error('网页丢失，请刷新重试');
                    break;
                default:
                    message.error('程序员罢工了,哄哄她去');
            }
        }else{
            message.error('请求服务拒绝，请稍候重试');
            return Promise.reject({
                data:{
                    status:5001,
                    msg:'请求服务拒绝'
                }
            })
        }
        return Promise.reject(error.response)
    });

interface Options {
    type?:string,
    params?:any,
    data?:any,
    headers?:any,
    timeout?:any,
    [propName: string]: any;
}


// 封装请求
export default function fetch (url:string, options:Options) {
    let opt = options || {};
    // console.log(store.getState())
    return new Promise((resolve, reject) => {
        axios({
            method: opt.type || "post",
            url: url,
            params: opt.params || {},
            // 判断是否有自定义头部，以对参数进行序列化。不定义头部，默认对参数序列化为查询字符串。
            data: (opt.headers && opt.headers['Content-Type'].indexOf('x-www-form-urlencoded') > 0 ? stringify(opt.data) : opt.data) || {},
            responseType: opt.dataType || 'json',
            // 设置默认请求头
            headers: opt.headers || {'Content-Type': 'application/json; charset=UTF-8'},
            //设置超时时间
            timeout: opt.timeout || 30000
        }).then(response => {
            if (response.data.status === 1000) {
                resolve(response.data)
            } else {
                switch (response.data.status) {
                    case 1001:
                    case 8001:
                        if(document.getElementsByClassName('global-message').length === 0){
                            store.dispatch({type:'USER_LOGIN_OUT'});
                            history.push('/etc-verification/login');
                            message.error({
                                content:response.data.msg || '账号已在其他设备登录',
                                className:'global-message'
                            })
                        }
                        reject(response.data);
                        break;
                    default:
                        message.error(response.data.msg || '什么都没有留下');
                        reject(response.data);
                }
            }
        }).catch(error => {
            reject(error)
        })
    })
}
