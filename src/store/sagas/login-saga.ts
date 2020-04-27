// Created by szatpig at 2019/9/5.
import { take,  call, put  } from 'redux-saga/effects';

import { userLogin,getRoleMenu } from './../../api/login-api'

function* loginAsync(payload:any) {
    try {
        let { data } =  yield call(userLogin,payload);
        sessionStorage.setItem('USER_TOKEN', data.token);
        sessionStorage.setItem('USER_INFO', JSON.stringify(data));
        yield put({ type: 'USER_TOKEN', payload:{ token:data.token }})
        yield put({ type: 'USER_INFO', payload:data })
        let menuList = yield call(getRoleMenu,{})
        sessionStorage.setItem('USER_MENU_LIST',JSON.stringify(menuList.data || []));
        yield put({ type: 'USER_MENU_LIST', payload:menuList.data })
    }catch (e) {
        yield put({ type: 'FETCH_ERROR', e })
    }
}

export function* loginFlow() {

    while (true){
        const { payload } = yield take('LOGIN_REQUEST')
        yield call(loginAsync,payload);
    }

}

