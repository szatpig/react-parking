// Created by szatpig at 2019/8/19.

import {
    USER_LOGIN_OUT,
    USER_MENU_LIST,
    USER_TOKEN,
    USER_INFO
} from './../actionTypes'

const initState:State = {
    token:sessionStorage.getItem('USER_TOKEN') || null,
    menuList: sessionStorage.getItem('USER_MENU_LIST') && JSON.parse(sessionStorage.getItem('USER_MENU_LIST') || '') || [],
    info: sessionStorage.getItem('USER_INFO') && JSON.parse(sessionStorage.getItem('USER_INFO') || '') || {},
};

let userReducer = (state:State = initState,action:any):any => {
    switch (action.type) {
        case USER_LOGIN_OUT:
            return {
                token:null,
                menuList:[],
                info:{}
            };
        case USER_TOKEN:
            return Object.assign({},state,action.payload);
        case USER_INFO:
            return Object.assign({},state,{ info:action.payload });
        case USER_MENU_LIST:
            return Object.assign({},state,{ menuList:action.payload });
        default:
            return state
    }
};

interface State {
    token:any,
    menuList:any[],
    info:any
}

export default userReducer

