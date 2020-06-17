// Created by szatpig at 2020/6/17.
import React from 'react';
import { Route,Redirect } from "react-router-dom";

import Authorized from '@/components/Authorized'

interface routes {
    path:string;
    component:React.ComponentType<any>;
    authority:string[],
    meta:{
        collapsed:boolean;
        title:any;
        [propName: string]: any;
    },
    [propName: string]: any;
}

function AuthorizedRoute({
     path,
     component: Component,
     authority,
     ...rest
}:routes){
    return (
            <Authorized authority={ authority } path ={ path } noMatch={ <Route
                    render={() => <Redirect to={{ pathname: "/404" }} />}
            /> }>
                <Route path={ path } render={ (routeProps:any)=>( <Component { ...routeProps } /> ) } { ...rest } />
            </Authorized>
    );
}

export default AuthorizedRoute
