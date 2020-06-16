// Created by szatpig at 2019/9/5.
import { take,  call, put  } from 'redux-saga/effects';

import { userLogin,getRoleMenu } from '@/api/login-api'

function* loginAsync(payload:any) {
    try {
        let { data } =  yield call(userLogin,payload);
        sessionStorage.setItem('USER_TOKEN', data.token);
        sessionStorage.setItem('USER_INFO', JSON.stringify(data));
        yield put({ type: 'USER_TOKEN', payload:{ token:data.token }})
        yield put({ type: 'USER_INFO', payload:data })
        // let menuList = yield call(getRoleMenu,{})
        let menuList = [{
            id:1,
            title:'白名单管理',
            path:'/home/white'
        },{
            id:2,
            title:'停车券管理',
            path:'/home/coupon',
            children:[
                {
                    id:6,
                    title:'发放停券',
                    path:'/home/coupon/give',
                },
                {
                    id:5,
                    title:'销售管理',
                    path:'/home/coupon/sale',
                }
            ]
        },{
            id:3,
            title:'核销记录',
            path:'/home/verification'
        },{
            id:4,
            title:'企业账户',
            path:'/home/account',
            children:[
                {
                    id:6,
                    title:'基础信息',
                    path:'/home/account/info',
                },
                {
                    id:5,
                    title:'账单',
                    path:'/home/account/bill',
                }
            ]
        }]
        sessionStorage.setItem('USER_MENU_LIST',JSON.stringify(menuList || []));
        yield put({ type: 'USER_MENU_LIST', payload:menuList })
    }catch (e) {
        console.log(e);
        yield put({ type: 'FETCH_ERROR', payload:e })
    }
}

export function* loginFlow() {

    while (true){
        const { payload } = yield take('LOGIN_REQUEST')
        yield call(loginAsync,payload);
    }

}

