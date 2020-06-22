// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const commercialUserList= (data:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'post',
    data
});

export const getQrCodeImage= (params:any) => fetch(site.base + '/businessAccount/getQrCodeImage' ,{
    type: 'get',
    params
});


export const commercialUserId= (data:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'post',
    data
});

export const commercialUserAdd= (data:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'post',
    data
});

export const commercialUserEdit= (data:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'post',
    data
});

export const commercialUserOff= (data:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'post',
    data
});

export const commercialUserDelete= (data:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'post',
    data
});

export const commercialUserReset= (data:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'post',
    data
});

