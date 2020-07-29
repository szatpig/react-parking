// Created by szatpig at 2020/4/27.
import {
    FETCH_ERROR
} from './../actionTypes'

const initState:State ={
    error: ''
}

interface State{
    error:Object
}

let errorReducer = (state = initState, action:any) => {
    console.log(state,action)
    switch (action.type){
        case FETCH_ERROR:
            return Object.assign({},state,{ error:action.payload });
        default:
            return state
    }
}

export default errorReducer