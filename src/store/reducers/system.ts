// Created by szatpig at 2019/12/16.
import { SYSTEM_USER_LIST } from "../actionTypes";

const initState:State ={
    tableData:[]
}

const systemReducer = (state:State = initState,action:any):any =>{
    switch (action.type){
        case SYSTEM_USER_LIST:
            return Object.assign({},state,{ tableData:action.payload });
        default:
            return state
    }
}

interface State {
    tableData:any
}

export default systemReducer

