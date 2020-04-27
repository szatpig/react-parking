// Created by szatpig at 2019/9/3.
function makeActionCreator(type:string, ...argNames:[]) {
    return function(...args:[]) {
        let payload = {}
        const action = { type,payload }
        argNames.forEach((arg, index) => {
            action.payload[arg] = args[index]
        })
        return action
    }
}

function ActionCreator(type:string) {
    return function(payload?:any) {
        return { type,payload }
    }
}

export {
    ActionCreator,
    makeActionCreator
}

