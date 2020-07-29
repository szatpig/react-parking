// Created by szatpig at 2020/6/16.
import { lazy } from 'react'
import React from "react";

const Enterprise  = lazy(() => import('./../common/enterprise'));

const NoMatch = lazy(() => import('./../../error/404'));

interface routes {
    path:string;
    component:React.ComponentType<any>;
    authority:string[],
    meta:{
        collapsed:boolean;
        title:any;
        [propName: string]: any;
    }
}

export default [
    {
        path:'/system/account',
        component:Enterprise,
        authority:["merchant", "admin"],
        meta:{
            title:{
                mainMenu:'企业账户'
            }
        }
    },
    {
        path:null,
        component:NoMatch
    }
]

