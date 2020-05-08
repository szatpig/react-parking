// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const getCompanyLogo= (params:any) => fetch(site.base + '/businessAccount/getCompanyLogo' ,{
    type: 'get',
    params
});

export const getQrCodeImage= (params:any) => fetch(site.base + '/businessAccount/getQrCodeImage' ,{
    type: 'get',
    params
});

export const getAccountDetails= (params:any) => fetch(site.base + '/businessAccount/getAccountdetails' ,{
    type: 'get',
    params
});

export const uploadLogo= (data:any) => fetch(site.base + '/businessAccount/uploadLogo' ,{
    type: 'post',
    data
});

export const updateIndustryLoginUserPwd= (data:any) => fetch(site.base + '/businessAccount/updateIndustryLoginUserPwd' ,{
    type: 'post',
    data
});
