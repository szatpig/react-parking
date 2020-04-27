// Created by szatpig at 2019/9/5.

import fetch from './../utils/fetch'
import site from './../utils/config'

export const userLogin= (data:any) => fetch(site.base + '/permission/login' ,{
    type: 'post',
    data
});

export const getPublicKey= (params:any) => fetch(site.base + '/permission/getPublicKey' ,{
    type: 'get',
    params
});

export const getRoleMenu= (params:any) => fetch(site.base + '/menu/getRoleMenu' ,{
    type: 'get',
    params
});