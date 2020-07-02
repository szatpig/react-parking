// Created by szatpig at 2019/8/19.
import { LOGIN_REQUEST,LOGIN_OUT_REQUEST } from './../actionTypes'
import { ActionCreator } from './../ActionCreator'

const userLoginRequestAction = (payload:any) => ActionCreator(LOGIN_REQUEST)(payload)
const userLoginOutAction = () => ActionCreator(LOGIN_OUT_REQUEST)({})

export {
    userLoginRequestAction,
    userLoginOutAction
}
