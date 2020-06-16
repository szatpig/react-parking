// Created by szatpig at 2019/8/21.

import { lazy } from 'react'

const Account  = lazy(() => import('./industryUser/account/index'));
const AccountBill  = lazy(() => import('./industryUser/account/bill'));

const Coupon  = lazy(() => import('./industryUser/coupon'));
const CouponSale  = lazy(() => import('./industryUser/coupon/sale'));
const CouponEquity  = lazy(() => import('./industryUser/coupon/equity'));

const Verification  = lazy(() => import('./industryUser/verification'));

const White  = lazy(() => import('./industryUser/white'));
const Equity  = lazy(() => import('./industryUser/white/equity'));
const EquityClass  = lazy(() => import('./industryUser/white/class'));

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
            },
            class:1
        }
    },
    {
        path:'/white/equity/:type',
        component:Equity,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'权益金管理'
            },
            class:1
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
            },
            class:1
        }
    },
    {
        path:'/coupon/give/:type',
        component:CouponEquity,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'停车券发放'
            },
            class:2
        }
    },
    {
        path:'/coupon/give',
        component:Coupon,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'停车券管理'
            },
            class:2
        }
    },
    {
        path:'/coupon/sale',
        component:CouponSale,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'销售管理'
            },
            class:2
        }
    },
    {
        path:'/account/info',
        component:Account,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'基础信息'
            }
        }
    },
    {
        path:'/account/bill',
        component:AccountBill,
        meta:{
            collapsed:true,
            title:{
                mainMenu:'账单'
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
