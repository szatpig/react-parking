// Created by szatpig at 2019/8/21.

import { lazy } from 'react'

// const SceneList  = lazy(() => import('./scene/sceneList'));

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
    // {
    //     path:'/sceneManager/sceneList',
    //     component:SceneList,
    //     meta:{
    //         collapsed:true,
    //         title:{
    //             mainMenu:'话术配置',
    //             secondMenu:'场景配置'
    //         }
    //     }
    // },
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
