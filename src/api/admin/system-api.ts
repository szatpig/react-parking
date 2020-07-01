// Created by szatpig at 2019/9/5.

import fetch from '@/utils/fetch'
import site from '@/utils/config'

export const userList= (params:any) => fetch(site.base + '/commercialUser/searchSubWithPage' ,{
    type: 'get',
    params
});

export const userDelete= (data:any) => fetch(site.base + `/industryLoginUser/deleteById/${data.id}` ,{
    type: 'post',
    data
});

export const userAdd= (data:any) => fetch(site.base + `/commercialUser/addSubCommercialUser` ,{
    type: 'post',
    data
});

export const userUpdate= (data:any) => fetch(site.base + `/commercialUser/updateSubCommercialUser` ,{
    type: 'post',
    data
});

export const userOff= (data:any) => fetch(site.base + `/industryLoginUser/updataStatus` ,{
    type: 'post',
    data
});

export const userReset= (data:any) => fetch(site.base + `/industryLoginUser/resetPwd` ,{
    type: 'post',
    data
});

export const userGetRoleList= (params:any) => fetch(site.base + '/industryLoginRole/listForCommercialUser' ,{
    type: 'get',
    params
});

export const roleList= (params:any) => fetch(site.base + '/industryLoginRole/listRoleInfo' ,{
    type: 'get',
    params
});

export const roleAdd= (data:any) => fetch(site.base + '/industryLoginRole/insert' ,{
    type: 'post',
    data
});

export const roleUpdate= (data:any) => fetch(site.base + `/industryLoginRole/updateRole` ,{
    type: 'post',
    data
});

export const roleDelete= (data:any) => fetch(site.base + `/industryLoginRole/deleteRole/${data.id}` ,{
    type: 'post'
});

export const roleGet= (data:any) => fetch(site.base + `/industryLoginRole/getRole/${data.id}` ,{
    type: 'get'
});

export const getRoleMenu= (params:any) => fetch(site.base + `/industryLoginRole/getRoleMenu` ,{
    type: 'post'
});