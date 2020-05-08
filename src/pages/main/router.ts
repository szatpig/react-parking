// Created by szatpig at 2019/8/21.

import { lazy } from 'react'

const Account  = lazy(() => import('./account/index'));

const Coupon  = lazy(() => import('./coupon'));
const CouponEquity  = lazy(() => import('./coupon/equity'));

const Verification  = lazy(() => import('./verification'));

const White  = lazy(() => import('./white'));
const Equity  = lazy(() => import('./white/equity'));
const EquityClass  = lazy(() => import('./white/class'));

const NoMatch = lazy(() => import('./../error/404'));

interface routes {
    path:string;
    component:any;
    meta:{
        collapsed:boolean;
        title:any;
        [propName: string]: any;
    }
}

export default [
    {
        path:'/white',
        component:White,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'白名单管理'
            }
        }
    },
    {
        path:'/white/equity/:type',
        component:Equity,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'权益金管理'
            }
        }
    },
    {
        path:'/white/class',
        component:EquityClass,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'权益等级管理'
            }
        }
    },
    {
        path:'/verification',
        component:Verification,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'核销记录'
            }
        }
    },
    {
        path:'/coupon/equity/:type',
        component:CouponEquity,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'停车券发放'
            }
        }
    },
    {
        path:'/coupon',
        component:Coupon,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'停车券管理'
            }
        }
    },
    {
        path:'/account',
        component:Account,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'个人账户设置'
            }
        }
    },
    {
        path:'/system/departManage/add/info',
        component:NoMatch,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'系统设置',
                secondMenu:'用户设置',
                thirdMenu:'编辑',
                fourMenu:'信息'
            }
        }
    },
    {
        path:null,
        component:NoMatch
    }
]
