// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { RouteComponentProps } from "react-router-dom";
import {connect} from "react-redux";

function Authorized(props:Props) {
    const { path,redirect,authority,component:Component } = props

    useEffect(() => {
        //do something
    });

    return (
            <div className="Authorized-container"></div>
    );
}

interface Props extends RouteComponentProps {
    key:string,
    path:string,
    redirect:string,
    authority:string[],
    component:React.ComponentType<any>
}

const mapStateToProps = (state:any) => ({
    menuList:state.user.menuList,
    userInfo:state.user.info
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps,mapDispatchToProps)(Authorized)
