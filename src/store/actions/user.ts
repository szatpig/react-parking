// Created by szatpig at 2019/8/19.
import { USER_TOKEN, LOGIN_REQUEST } from './../actionTypes'
import { ActionCreator } from './../ActionCreator'

const userLoginRequestAction = (payload:any) => ActionCreator(LOGIN_REQUEST)(payload)


export {
    userLoginRequestAction
}
