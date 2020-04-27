// Created by szatpig at 2019/8/29.
import { all } from 'redux-saga/effects'
import { loginFlow } from './login-saga'
import { systemFlow } from "./system-saga";


export default function* rootSagas() {
    yield all([
        loginFlow(),
        systemFlow()
    ])
}
