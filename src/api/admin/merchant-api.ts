// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const humanVerifyList= (data:any) => fetch(site.base + '/humanVerify/list' ,{
    type: 'post',
    data
});

export const humanVerify= (data:any) => fetch(site.base + '/humanVerify/verify' ,{
    type: 'post',
    data
});


export const merchantDiscountList= (data:any) => fetch(site.base + '/merchantDiscountInfo/list' ,{
    type: 'post',
    data
});

export const merchantDiscountGet= (data:any) => fetch(site.base + '/merchantDiscountInfo/list' ,{
    type: 'post',
    data
});
export const merchantDiscountDelete= (data:any) => fetch(site.base + '/merchantDiscountInfo/get' ,{
    type: 'post',
    data
});

export const merchantDiscountAdd= (data:any) => fetch(site.base + '/merchantDiscountInfo/save' ,{
    type: 'post',
    data
});

export const merchantDiscountUpdate= (data:any) => fetch(site.base + '/merchantDiscountInfo/update' ,{
    type: 'post',
    data
});