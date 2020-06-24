// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const commercialUserList= (params:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'get',
    params
});

export const getQrCodeImage= (params:any) => fetch(site.base + '/businessAccount/getQrCodeImage' ,{
    type: 'get',
    params
});


export const getCommercialUserById= (data:any) => fetch(site.base +`/commercialUser/getCommercialUser/${data.id}` ,{
    type: 'post',
    data
});

export const commercialUserAdd= (data:any) => fetch(site.base + '/commercialUser/insert' ,{
    type: 'post',
    data
});

export const commercialUserEdit= (data:any) => fetch(site.base + '/commercialUser/updateCommercialUser' ,{
    type: 'post',
    data
});

export const commercialUserOff= (data:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'post',
    data
});

export const commercialUserDelete= (data:any) => fetch(site.base + `commercialUser/deleteCommercialUser/${ data.id }` ,{
    type: 'post',
    data
});

export const commercialUserReset= (data:any) => fetch(site.base + '/commercialUser/searchWithPage' ,{
    type: 'post',
    data
});

