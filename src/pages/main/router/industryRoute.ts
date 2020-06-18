// Created by szatpig at 2020/6/16.
import { lazy } from 'react'
import React from "react";

const Account  = lazy(() => import('./../industryUser/account/index'));
const AccountBill  = lazy(() => import('./../industryUser/account/bill'));

const Coupon  = lazy(() => import('./../industryUser/coupon'));
const CouponSale  = lazy(() => import('./../industryUser/coupon/sale'));
const CouponEquity  = lazy(() => import('./../industryUser/coupon/equity'));

const Store  = lazy(() => import('./../industryUser/store'));

const Verification  = lazy(() => import('./../industryUser/verification'));

const White  = lazy(() => import('./../industryUser/white'));
const Equity  = lazy(() => import('./../industryUser/white/equity'));
const EquityClass  = lazy(() => import('./../industryUser/white/class'));

interface routes {
    path:string;
    component:React.ComponentType<any>;
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
        authority:["user"],
        meta:{
            collapsed:true,
            title:{
                mainMenu:'白名单管理'
            }
        }
    },
    {
        path:'/store',
        component:Store,
        authority:["user"],
        meta:{
            collapsed:true,
            title:{
                mainMenu:'商户管理'
            }
        }
    },
    {
        path:'/white/equity/:type',
        component:Equity,
        authority:["user"],
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
        authority:["user"],
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
        authority:["user"],
        meta:{
            collapsed:true,
            title:{
                mainMenu:'核销记录'
            }
        }
    },
    {
        path:'/coupon/give/:type',
        component:CouponEquity,
        authority:["user"],
        meta:{
            collapsed:true,
            title:{
                mainMenu:'停车券发放'
            }
        }
    },
    {
        path:'/coupon/give',
        component:Coupon,
        authority:["user"],
        meta:{
            collapsed:true,
            title:{
                mainMenu:'停车券管理'
            }
        }
    },
    {
        path:'/coupon/sale',
        component:CouponSale,
        authority:["user"],
        meta:{
            collapsed:true,
            title:{
                mainMenu:'销售管理'
            }
        }
    },
    {
        path:'/account/info',
        component:Account,
        authority:["user"],
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
        authority:["user"],
        meta:{
            collapsed:true,
            title:{
                mainMenu:'账单'
            }
        }
    }
]

