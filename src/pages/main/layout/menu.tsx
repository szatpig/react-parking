// Created by szatpig at 2019/8/20.
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link } from 'react-router-dom';

import logo from '@/images/logo-menu.png'
import logo_mini from '@/images/logo-min.png'


import { Menu, Icon } from 'antd';
const { SubMenu } = Menu;


class MenuLayout extends Component<Props, State> {

    rootSubmenuId = this.props.menuList.map((item:any)=> item.id.toString());

    state:State = {
        openKeys: [],
        defaultSelected:[]
    };

    onOpenChange = (openKeys:any) => {
        const latestOpenKey = openKeys.find((key:any) => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuId.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };

    menuSelect = (item:any)=>{
        this.setState({
            defaultSelected:[item.key.toString()]
        })
    }

    menuFilter = (menuList:[],pathname:string) =>{
        let _arr:any = []
        menuList.forEach((item:any) =>{
            if(item.children.length){
                _arr = _arr.concat(item.children)
                delete item.children
                _arr.push(item)
            }else{
                _arr.push(item)
            }
        });
        const _filterObject = _arr.find((item:any) => pathname.indexOf(item.name) > -1) || _arr[0];
        if(_filterObject){
            this.setState({
                defaultSelected:[_filterObject.id.toString()],
                openKeys:[(_filterObject.parentId || _filterObject.id).toString()]
            })
        }
    }


    componentDidMount() {
        const { location:{ pathname },menuList } = this.props;
        this.menuFilter(JSON.parse(JSON.stringify(menuList)),pathname);
    }

    render() {
        const { menuList,collapsed } = this.props;
        const { openKeys,defaultSelected } = this.state;
        return (
            <Fragment>
                <div className="menu-logo-wrapper">
                    <img src={ collapsed ? logo_mini :logo } alt="意能通logo" />
                </div>
                <Menu theme="dark"
                    mode="inline"
                    defaultSelectedKeys={ defaultSelected }
                    openKeys={ openKeys }
                    onOpenChange={ this.onOpenChange }>
                    {
                        menuList.map((item:any)=>{
                            if(item.children.length){
                                return (
                                    <SubMenu title={
                                        <span>
                                          <Icon type="user" />
                                          <span>{ item.title }</span>
                                        </span>
                                    } key={ item.id }>
                                        {
                                            item.children.map((cell:any)=>{
                                                return <Menu.Item key={ cell.id } onClick={ this.menuSelect }>
                                                    <Link to={ "/home/"+ item.path + '/' + cell.path }>{ cell.title }</Link>
                                                </Menu.Item>
                                            })
                                        }
                                    </SubMenu>
                                )
                            }else{
                               return (
                                    <Menu.Item key={ item.id } onClick={ this.menuSelect }>
                                        <Icon type="user" />
                                        <span><Link to={ "/home/"+ item.path }>{ item.title }</Link></span>
                                    </Menu.Item>
                               )
                            }
                        })
                    }
                </Menu>
            </Fragment>
        )
    }
}

interface Props extends RouteComponentProps {
    menuList:[]
    collapsed:boolean
}

interface State {
    openKeys:string[],
    defaultSelected:string[]
}

const mapStateToProps = (state:any) => ({
    menuList:state.user.menuList,
    collapsed:state.header.collapsed
})

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MenuLayout))