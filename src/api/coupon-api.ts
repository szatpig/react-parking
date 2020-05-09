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

export const confirmRevokeCoupon= (data:any) => fetch(site.base + '/customerCoupon/confirmRevokeCoupon' ,{
    type: 'post',
    data
});

export const getProvideConfirmData= (data:any) => fetch(site.base + '/customerCoupon/getProvideConfirmData' ,{
    type: 'post',
    data
});

export const provideCouponOne= (data:any) => fetch(site.base + '/customerCoupon/provideCouponOne' ,{
    type: 'post',
    data
});

export const importDataConfirm= (data:any) => fetch(site.base + '/customerCoupon/importDataConfirm' ,{
    type: 'post',
    data
});

export const importCouponBatch= (data:any) => fetch(site.base + '/customerCoupon/importCouponBatch' ,{
    type: 'post',
    data
});