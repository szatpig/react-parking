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
            sessionStorage.setItem('USER_TOKEN', '');
            sessionStorage.setItem('USER_INFO', JSON.stringify(''));
            return {
                token:null,
                menuList:[],
                info:{}
            };
            break;
        case USER_TOKEN:
            return Object.assign({},state,action.payload);
            break;
        case USER_INFO:
            return Object.assign({},state,{ info:action.payload });
            break;
        case USER_MENU_LIST:
            return Object.assign({},state,{ menuList:action.payload });
            break;
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

