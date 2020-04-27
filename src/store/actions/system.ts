// Created by szatpig at 2019/12/16.
import { SYSTEM_USER_LIST_REQUEST } from './../actionTypes'
import { ActionCreator } from './../ActionCreator'

const systemUserRequestAction = (payload:any) => ActionCreator(SYSTEM_USER_LIST_REQUEST)(payload)

export {
    systemUserRequestAction
}
