// Created by szatpig at 2019/8/19.
import { USER_TOKEN, LOGIN_REQUEST,USER_LOGIN_OUT } from './../actionTypes'
import { ActionCreator } from './../ActionCreator'

const userLoginRequestAction = (payload:any) => ActionCreator(LOGIN_REQUEST)(payload)
const userLoginOutAction = (payload:any) => ActionCreator(USER_LOGIN_OUT)(payload)

export {
    userLoginRequestAction,
    userLoginOutAction
}
