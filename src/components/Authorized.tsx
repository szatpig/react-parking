// Created by szatpig at 2020/6/16.
import React from 'react';
import { connect } from "react-redux";

function Authorized(props:Props) {
    const { path,authority,children,userInfo,noMatch } = props;
    const currentAuthority =  'user';

    console.log('authority',userInfo,authority)

    if (!authority) return children;
    if (authority.includes(currentAuthority)) return children;
    return noMatch;
}

interface Props{
    path:string,
    authority:string[],
    noMatch:any;
    children:any,
    userInfo:any
}

const mapStateToProps = (state:any) => ({
    menuList:state.user.menuList,
    userInfo:state.user.info
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps,mapDispatchToProps)(Authorized)
