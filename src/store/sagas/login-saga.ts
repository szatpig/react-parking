// Created by szatpig at 2019/9/5.
import { createBrowserHistory } from 'history';

import { take,  call, put  } from 'redux-saga/effects';

import { userLogin,getRoleMenu } from '@/api/login-api'

const history = createBrowserHistory();

function* loginAsync(payload:any) {
    try {
        let { data } =  yield call(userLogin,payload);
        data = { ...data,currentAuthority:'user' }
        sessionStorage.setItem('USER_TOKEN', data.token);
        sessionStorage.setItem('USER_INFO', JSON.stringify(data));
        yield put({ type: 'USER_TOKEN', payload:{ token:data.token }})
        yield put({ type: 'USER_INFO', payload:data })
        // let menuList = yield call(getRoleMenu,{})
        let menuList = [
           {
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
           }
        ];
        // menuList = [
        //     {
        //         id:1,
        //         title:'销售管理',
        //         path:'/home/white'
        //     },{
        //         id:2,
        //         title:'销售记录',
        //         path:'/home/coupon'
        //     },
        //     {
        //         id:3,
        //         title:'商家管理',
        //         path:'/home/coupon'
        //     },
        //     {
        //         id:4,
        //         title:'人工核销',
        //         path:'/home/coupon'
        //     },
        //     {
        //         id:5,
        //         title:'人工核销',
        //         path:'/home/coupon',
        //         children:[
        //             {
        //                 id:6,
        //                 title:'用户管理',
        //                 path:'/home/coupon'
        //             },
        //             {
        //                 id:7,
        //                 title:'角色管理',
        //                 path:'/home/coupon'
        //             },
        //             {
        //                 id:8,
        //                 title:'企业账户',
        //                 path:'/home/coupon'
        //             },
        //         ]
        //     },
        // ];
        // menuList = [
        //     {
        //         id:1,
        //         title:'停车券管理',
        //         path:'/home/white'
        //     },{
        //         id:2,
        //         title:'停车券发放记录',
        //         path:'/home/coupon',
        //         children:[]
        //     },
        //     {
        //         id:3,
        //         title:'企业账户',
        //         path:'/home/coupon',
        //         children:[]
        //     }
        // ];
        sessionStorage.setItem('USER_MENU_LIST',JSON.stringify(menuList || []));
        yield put({ type: 'USER_MENU_LIST', payload:menuList });

        return history.push('home/white')
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

