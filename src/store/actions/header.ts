// Created by szatpig at 2019/8/19.
import { HEADER_COLLAPSED } from './../actionTypes'
import { ActionCreator } from './../ActionCreator'

const headerCollapsed = () => ActionCreator(HEADER_COLLAPSED)()


export {
    headerCollapsed
}
