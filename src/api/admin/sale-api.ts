// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const saleList= (data:any) => fetch(site.base + '/commercialUserCoupon/list' ,{
    type: 'post',
    data
});

export const getMerchantUserNameList= (data:any) => fetch(site.base + '/merchantUser/getMerchantUserNameList' ,{
    type: 'post',
    data
});

export const addMerchantUserCoupon= (data:any) => fetch(site.base + '/merchantUserCoupon/addMerchantUserCoupon' ,{
    type: 'post',
    data
});




