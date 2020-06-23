// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const merchantUserCouponList= (data:any) => fetch(site.base + '/merchantCustomerCoupon/selectMerchantUserCouponList' ,{
    type: 'post',
    data
});

export const merchantUserCouponRecordList= (data:any) => fetch(site.base + '/merchantCustomerCoupon/selectGrantLogListWithPage' ,{
    type: 'post',
    data
});

export const provideCustomerCoupon= (data:any) => fetch(site.base + '/merchantCustomerCoupon/provideCustomerCoupon' ,{
    type: 'post',
    data
});
