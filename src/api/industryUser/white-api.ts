// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const whiteList= (data:any) => fetch(site.base + '/customerEquity/list' ,{
    type: 'post',
    data
});

export const confirmRevokeEquity= (data:any) => fetch(site.base + '/customerEquity/confirmRevokeEquity' ,{
    type: 'post',
    data
});

export const revokeEquitySubmit= (data:any) => fetch(site.base + '/customerEquity/revokeEquity' ,{
    type: 'post',
    data
});

export const equityConfigList= (data:any) => fetch(site.base + '/equityConfig/list' ,{
    type: 'post',
    data
});

export const equityConfigUpdate= (data:any) => fetch(site.base + '/equityConfig/update' ,{
    type: 'post',
    data
});

export const equityConfigAdd= (data:any) => fetch(site.base + '/equityConfig/add' ,{
    type: 'post',
    data
});

export const equityConfigDelete= (data:any) => fetch(site.base + '/equityConfig/delete/'+ data.id ,{
    type: 'post',
    data
});

export const validRevokeAvailable= (data:any) => fetch(site.base + '/customerEquity/validRevokeAvailable' ,{
    type: 'post',
    data
});
//判断列表页余额是不是够发
export const grantValid= (data:any) => fetch(site.base + '/customerEquity/grantValid' ,{
    type: 'post',
    data
});

export const getRevocable= (params:any) => fetch(site.base + '/permission/getRevocable' ,{
    type: 'get',
    params
});

export const grantConfirmData= (data:any) => fetch(site.base + '/customerEquity/grantConfirmData' ,{
    type: 'post',
    data
});

export const grantEquity= (data:any) => fetch(site.base + '/customerEquity/grantEquity' ,{
    type: 'post',
    data
});

export const parseWhitelist= (data:any) => fetch(site.base + '/customerEquity/parseWhitelist' ,{
    type: 'post',
    data
});

export const importEquity= (data:any) => fetch(site.base + '/customerEquity/importEquity' ,{
    type: 'post',
    data
});