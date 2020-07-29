// Created by szatpig at 2019/10/21.
import fetch from '../../utils/fetch'
import site from '../../utils/config'

export const getAllDepart= (params:any) => fetch(site.base + '/depart/getAllDepart' ,{
    type: 'get',
    params
});
export const deleteDepart= (data:any) => fetch(site.base + '/depart/deleteDepart' ,{
    type: 'post',
    data
});
export const updateDepart= (data:any) => fetch(site.base + '/depart/updateDepart' ,{
    type: 'post',
    data
});
export const addDepart= (data:any) => fetch(site.base + '/depart/addDepart' ,{
    type: 'post',
    data
});


export const userInfoList= (data:any) => fetch(site.base + '/userinfo/queryUserInfoList' ,{
    type: 'post',
    data
});

export const getRandomPwd= (data:any) => fetch(site.base + '/custManager/getRandomPwd' ,{
    type: 'post',
    data
});

export const addUser= (data:any) => fetch(site.base + '/userinfo/addUserInfo' ,{
    type: 'post',
    data
});

export const updateUser= (data:any) => fetch(site.base + '/userinfo/updateUserInfo' ,{
    type: 'post',
    data
});

export const deleteUser= (data:any) => fetch(site.base + '/userinfo/deleteUserInfo' ,{
    type: 'post',
    data
});

export const updateUserStatus= (data:any) => fetch(site.base + '/userinfo/upUserStatus' ,{
    type: 'post',
    data
});

export const userRoleList= (data:any) => fetch(site.base + '/role/queryRoleList' ,{
    type: 'post',
    data
});

export const getRoleListByDepartList= (data:any) => fetch(site.base + '/role/getRoleListByDepartList' ,{
    type: 'post',
    data
});

export const getDepartAndChild= (params:any) => fetch(site.base + '/userinfo/getDpartAndChild' ,{
    type: 'get',
    params
});