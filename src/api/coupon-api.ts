// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const couponList= (data:any) => fetch(site.base + '/customerCoupon/seachWithPage' ,{
    type: 'post',
    data
});

export const verifyRevokeAvailable= (data:any) => fetch(site.base + '/customerCoupon/verifyRevokeAvailable' ,{
    type: 'post',
    data
});

export const revokeCouponBatch= (data:any) => fetch(site.base + '/customerCoupon/revokeCouponBatch' ,{
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

export const grantEquity= (data:any) => fetch(site.base + '/customerEquity/grantEquity' ,{
    type: 'post',
    data
});

export const importEquity= (data:any) => fetch(site.base + '/customerEquity/importEquity' ,{
    type: 'post',
    data
});