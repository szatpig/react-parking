// Created by szatpig at 2020/6/16.
import { lazy } from 'react'
import React from "react";

const Sale  = lazy(() => import('./../admin/sale'));

const Record  = lazy(() => import('./../admin/record'));

const Merchant  = lazy(() => import('./../admin/merchant'));
const MerchantSale  = lazy(() => import('./../admin/merchant/merchantSale'));

const ManualVerification  = lazy(() => import('./../admin/verification'));

const Role  = lazy(() => import('./../admin/system/role'));
const User  = lazy(() => import('./../admin/system/user'));
const Enterprise  = lazy(() => import('./../common/enterprise'));

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
        path:'/sale',
        component:Sale,
        authority:["admin"],
        meta:{
            title:{
                mainMenu:'销售管理'
            }
        }
    },
    {
        path:'/record',
        component:Record,
        authority:["admin"],
        meta:{
            title:{
                mainMenu:'销售记录'
            }
        }
    },
    {
        path:'/merchant',
        component:Merchant,
        authority:["admin"],
        meta:{
            title:{
                mainMenu:'商户管理'
            }
        }
    },
    {
        path:'/merchant/sale',
        component:MerchantSale,
        authority:["admin"],
        meta:{
            title:{
                mainMenu:'商户管理'
            }
        }
    },
    {
        path:'/manual',
        component:ManualVerification,
        authority:["admin"],
        meta:{
            title:{
                mainMenu:'人工核销'
            }
        }
    },
    {
        path:'/system/user',
        component:User,
        authority:["admin"],
        meta:{
            title:{
                mainMenu:'用户管理'
            }
        }
    },
    {
        path:'/system/role',
        component:Role,
        authority:["admin"],
        meta:{
            title:{
                mainMenu:'角色管理'
            }
        }
    }

]

