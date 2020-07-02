// Created by szatpig at 2019/9/5.
import { createBrowserHistory } from 'history';

import { take,  call, put  } from 'redux-saga/effects';

import { userLogin,userLogout } from '@/api/login-api'
import { getRoleMenu } from '@/api/admin/system-api'

const history = createBrowserHistory();

const menuArray = [[
    {
        id:1,
        title:'白名单管理',
        path:'/home/white',
        icon:'sale'
    },{
        id:9,
        title:'商户管理',
        path:'/home/store',
        icon:'merchant'
    },{
        id:2,
        title:'停车券管理',
        path:'/home/coupon',
        icon:'record',
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
        icon:'store',
        path:'/home/verification'
    },{
        id:4,
        title:'企业账户',
        path:'/home/account',
        icon:'account',
        children:[
            {
                id:7,
                title:'基础信息',
                path:'/home/account/info',
            },
            {
                id:8,
                title:'账单',
                path:'/home/account/bill',
            }
        ]
    }
],[
    {
        id:1,
        title:'销售管理',
        path:'/home/sale',
        icon:'sale'
    },{
        id:2,
        title:'销售记录',
        path:'/home/record',
        icon:'record'
    },
    {
        id:3,
        title:'商家管理',
        path:'/home/merchant',
        icon:'store'
    },
    {
        id:5,
        title:'系统管理',
        path:'/home/system',
        icon:'system',
        children:[
            {
                id:6,
                title:'用户管理',
                path:'/home/system/user'
            },
            {
                id:7,
                title:'角色管理',
                path:'/home/system/role'
            },
            {
                id:8,
                title:'企业账户',
                path:'/home/system/account'
            },
        ]
    },
],[
    {
        id:1,
        title:'停车券管理',
        path:'/home/ticketlist',
        icon:'sale'
    },{
        id:2,
        title:'停车券发放记录',
        path:'/home/ticketgive',
        icon:'record'
    },
    {
        id:3,
        title:'企业账户',
        path:'/home/system/account',
        icon:'account'
    }
]]

const AuthorityList = ['user','admin','merchant']

function* loginAsync(payload:any) {
    try {
        let { data } =  yield call(userLogin,payload);
        data = { ...data,currentAuthority:AuthorityList[data.loginType] }
        sessionStorage.setItem('USER_TOKEN', data.token);
        sessionStorage.setItem('USER_INFO', JSON.stringify(data));
        yield put({ type: 'USER_TOKEN', payload:{ token:data.token }})
        yield put({ type: 'USER_INFO', payload:data })
        let { data:_menuList } = yield call(getRoleMenu,{})
        let menuList = data.loginType === 1 ? _menuList : menuArray[data.loginType];
        sessionStorage.setItem('USER_MENU_LIST',JSON.stringify(menuList || []));
        yield put({ type: 'USER_MENU_LIST', payload:menuList });
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

export function* loginOutFlow() {

    while (true){
        const { payload } = yield take('LOGIN_OUT_REQUEST')
        yield call(userLogout,payload);
        yield put({ type: 'USER_LOGIN_OUT' })
    }

}

