// Created by szatpig at 2019/12/16.
import { take, call, put  } from 'redux-saga/effects';
import { userInfoList } from '@/api/industryUser/system-api'

function* systemUserAsync(payload:any) {
    try{
        let { data } = yield call(userInfoList,payload)
        yield put ({ type:'SYSTEM_USER_LIST',payload:data })
    }catch (e) {
        yield put({ type: 'FETCH_ERROR', e })
    }
}

export function* systemFlow() {
    while (true){
        const { payload } = yield take('SYSTEM_USER_LIST_REQUEST')
        yield call(systemUserAsync,payload)
    }
}