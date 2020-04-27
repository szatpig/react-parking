// Created by szatpig at 2019/10/12.
import {
    HEADER_COLLAPSED
} from './../actionTypes'

const initState:State ={
    collapsed: false
}

interface State{
    collapsed:boolean
}

let headerReducer = (state = initState, action:any) => {
    switch (action.type){
        case HEADER_COLLAPSED:
            return Object.assign({},state,{ collapsed:!state.collapsed });
        default:
            return state
    }
}

export default headerReducer