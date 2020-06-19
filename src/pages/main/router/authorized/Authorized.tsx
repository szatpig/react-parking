// Created by szatpig at 2020/6/16.
import React from 'react';
import { connect } from "react-redux";
import { Route,Redirect } from "react-router-dom";

function flat(args:[]) {
    var pathArr:any[] = []
    args.map((item:any)=>{
        if(item.children&&item.children.length > 0){
            pathArr = pathArr.concat(flat(item.children))
        }else{
            pathArr.push(item.path);
        }
    })
    return pathArr
}

function Authorized(props:Props) {
    const { path,authority,children,userInfo,noMatch,menuList } = props;

    let currentAuthority = userInfo.currentAuthority,
    _pathArr = flat(menuList);
    console.log(userInfo,'userInfo')
    if(Object.keys(userInfo).length === 0){
        return <Route render={() => <Redirect to={{ pathname: "/login" }} />} />
    }
    if (!authority) return children;
    if (authority.includes(currentAuthority)) {
        if(currentAuthority === 'admin'){
            if(_pathArr.includes(path)){
                return children
            }else{
                return noMatch;
            }
        }
        return children;
    }
    return noMatch;
}

interface Props{
    path:string,
    authority:string[],
    noMatch:any;
    children:any,
    userInfo:any,
    menuList:[],
}

const mapStateToProps = (state:any) => ({
    menuList:state.user.menuList,
    userInfo:state.user.info
})

const mapDispatchToProps = {

}


export default connect(mapStateToProps,mapDispatchToProps)(Authorized)
