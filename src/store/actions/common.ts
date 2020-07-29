// Created by szatpig at 2019/9/5.

import { FETCH_ERROR } from './../actionTypes'
import { ActionCreator } from './../ActionCreator'

const fetchErrorAction = () => ActionCreator(FETCH_ERROR)({
    status:''
})

export {
    fetchErrorAction
}
