// Created by szatpig at 2020/6/16.
import { lazy } from 'react'
import React from "react";

const CouponList  = lazy(() => import('./../merchant/couponList'));

const CouponGive  = lazy(() => import('./../merchant/couponGive'));

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
        path:'/couponlist',
        component:CouponList,
        authority:["merchant"],
        meta:{
            collapsed:true,
            title:{
                mainMenu:'停车券管理'
            }
        }
    },
    {
        path:'/coupongive',
        component:CouponGive,
        authority:["merchant"],
        meta:{
            collapsed:true,
            title:{
                mainMenu:'停车券发放记录'
            }
        }
    }
]

