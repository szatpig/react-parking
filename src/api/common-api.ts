// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const getParkingDetailByBusinessId= (data:any) => fetch(site.base + '/parking/getParkingDetailList' ,{
    type: 'post',
    data
});

export const getPublicKey= (params:any) => fetch(site.base + '/permission/getPublicKey' ,{
    type: 'get',
    params
});

export const updateCommonUserPwd = (data:any) => fetch(site.base + '/businessAccount/updateIndustryLoginUserPwd' ,{
    type: 'post',
    data
});

export const getCommonCommercialUser= (params:any) => fetch(site.base + '/commercialUser/getCommercialUser' ,{
    type: 'get',
    params
});

export const getCommonMerchantUser= (params:any) => fetch(site.base + '/merchantUser/getMerchantUser' ,{
    type: 'get',
    params
});