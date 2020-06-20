// Created by szatpig at 2019/8/20.
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { Menu } from 'antd';
import { CarOutlined,TeamOutlined,ProjectOutlined,FundProjectionScreenOutlined,ShopOutlined,SettingOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;


class MenuLayout extends Component<Props, State> {

    rootSubmenuId = this.props.menuList.map((item:any)=> item.id.toString());

    state:State = {
        openKeys: [],
        defaultSelected:[],
        selectedKeys:[]
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
        console.log(item);
        this.setState({
            selectedKeys:[item.key]
        })
        this.props.history.push(item.key)
    }

    iconShow = (id:number) => {
        switch (id){
            case 1:
                return <FundProjectionScreenOutlined />;
                break;
            case 2:
                return <CarOutlined />;
                break;
            case 3:
                return <ProjectOutlined />;
                break;
            case 4:
                return <TeamOutlined />;
                break;
            case 9:
                return <ShopOutlined />
            case 5:
                return <SettingOutlined />
                break;
        }
    }

    componentDidMount() {
        const { location:{ pathname } } = this.props;
        let path:any= [];
        if(pathname.indexOf('/home/coupon') > -1 || pathname.indexOf('/home/account')> -1|| pathname.indexOf('/home/system')> -1){
            path = pathname.match(/^(\/home(\/\w+){2})(\/.*)?$/);
        }else{
            path = pathname.match(/^(\/home\/\w+)(\/.*)?$/);
        }
        // let openKey:any =  path[1].match(/^(\/home\/\w+)(\/.*)?$/);
        this.setState((state)=>({
            selectedKeys:[path[1]],
            openKeys:[path[1].match(/^(\/home\/\w+)(\/.*)?$/)[1]]
        }))
    }

    render() {
        const { menuList,collapsed } = this.props;
        const { openKeys,defaultSelected,selectedKeys } = this.state;
        return (
            <Fragment>
                <Menu theme="dark"
                    mode="inline"
                    defaultSelectedKeys={ defaultSelected }
                    openKeys={ openKeys }
                    selectedKeys={ selectedKeys }
                    onOpenChange={ this.onOpenChange }>
                    {
                        menuList.map((item:any)=>{
                            if(item.children && item.children.length){
                                return (
                                    <SubMenu title={
                                        <span>
                                          { this.iconShow(item.id) }
                                          <span>{ item.title }</span>
                                        </span>
                                    } key={ item.path }>
                                        {
                                            item.children.map((cell:any)=>{
                                                return <Menu.Item key={ cell.path } onClick={ this.menuSelect }>
                                                    { cell.title }
                                                </Menu.Item>
                                            })
                                        }
                                    </SubMenu>
                                )
                            }else{
                               return (
                                    <Menu.Item key={ item.path }  onClick={ this.menuSelect }>
                                        { this.iconShow(item.id) }
                                        <span>{ item.title }</span>
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
    defaultSelected:string[],
    selectedKeys:string[]
}

const mapStateToProps = (state:any) => ({
    menuList:state.user.menuList,
    collapsed:state.header.collapsed
})

const mapDispatchToProps = {
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(MenuLayout))