// Created by szatpig at 2019/8/20.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import { Link } from 'react-router-dom';

import { Layout, Icon, Breadcrumb, Badge, Popover } from 'antd';

import routes from '../router'
import { headerCollapsed } from "../../../store/actions/header";
import defaultHeadImg from './../../../images/default.png'


const { Header } = Layout;

interface Props {
}

interface State {
}


class HeaderLayout extends Component<Props, State> {
    static defaultProps = {}

    state = {
        count:5
    };

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
    }

    getBreadcrumbName = (pathname:string,routes:any) =>{
        const routeItem = routes.find((item:any)=> item.path && (item.path === pathname.replace(/\/home/g,'')));
        if(!routeItem) return <Breadcrumb.Item > 404 </Breadcrumb.Item>;
        const pathUrl = routeItem.path.slice(1).split('/');
        return Object.values(routeItem.meta.title).map((item:any, index, arr)=>{
            if(arr.length - index > 1 && (!routeItem.meta.collapsed || routeItem.meta.collapsed && index != 0)){
                return <Breadcrumb.Item key={ index }><Link to={ '/home/' + pathUrl.slice(0,-(pathUrl.length - index -1)).join('/') }>{ item }</Link></Breadcrumb.Item>
            }else {
                return <Breadcrumb.Item key={ index }>{ item }</Breadcrumb.Item>
            }
        })
    }

    render() {
        const { username, path ,location:{ pathname } } = this.props;
        const text = <span>Title</span>;
        const content = (
                <div>
                    <p>Content</p>
                    <p>Content</p>
                </div>
        );
        return (
            <Header  className="header-container">
                <div className="head-content">
                    <div className="left-wrap">
                        <Icon
                            className="trigger"
                            type={ this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={ this.props.headerCollapsed }
                        />
                        <Breadcrumb>
                            { this.getBreadcrumbName(pathname,routes) }
                        </Breadcrumb>
                    </div>
                    <div className="right-wrap">
                        <div className="item-wrap">
                            <Icon type="qrcode" />扫码录音
                        </div>
                        <div className="item-wrap"><Icon type="aliwangwang" />坐席</div>
                        <div className="item-wrap"><Icon type="bulb" />帮助中心</div>
                        <div className="item-wrap">
                            <Badge count={ this.state.count } offset={[4,0]}>
                                <Icon type="bell" />消息
                            </Badge>
                        </div>
                        <div className="item-wrap">
                            <Popover placement="bottom" title={ text } content={ content } trigger="hover">
                                <img src={ defaultHeadImg } alt="用户头像"/>
                                <span className="item-name">{ username }</span>
                            </Popover>
                        </div>
                    </div>
                </div>

            </Header>
        )
    }
}

interface Props extends RouteComponentProps  {
    collapsed:boolean,
    headerCollapsed:any,
    username:string,
    path:string
}


interface State {
    count:number
}

const mapStateToProps = (state:any) => ({
    collapsed:state.header.collapsed,
    username:state.user.realName
})

const mapDispatchToProps = {
    headerCollapsed
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(HeaderLayout))