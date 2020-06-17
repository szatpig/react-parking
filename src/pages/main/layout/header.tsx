// Created by szatpig at 2019/8/20.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom';

// import { useHistory } from 'react-router-dom';

import { Layout, Breadcrumb, Popover } from 'antd';

import { ReloadOutlined } from '@ant-design/icons';

import { headerCollapsed } from "@/store/actions/header";
import { userLoginOutAction } from "@/store/actions/user";
import logo from '@/images/image-logo.png'

import site from '@/utils/config'

const { Header } = Layout;

class HeaderLayout extends Component<Props, State> {
    static defaultProps = {}

    state = {
        count:5
    };

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    getBreadcrumbName = (pathname:string,routes:any) =>{
        const routeItem = routes.find((item:any)=> item.path && (item.path === pathname.replace(/\/home/g,'')));
        if(!routeItem) return <Breadcrumb.Item > 404 </Breadcrumb.Item>;
        const pathUrl = routeItem.path.slice(1).split('/');
        return Object.values(routeItem.meta.title).map((item:any, index, arr)=>{
            if(arr.length - index > 1 && (!routeItem.meta.collapsed || routeItem.meta.collapsed && index !== 0)){
                return <Breadcrumb.Item key={ index }><Link to={ '/home/' + pathUrl.slice(0,-(pathUrl.length - index -1)).join('/') }>{ item }</Link></Breadcrumb.Item>
            }else {
                return <Breadcrumb.Item key={ index }>{ item }</Breadcrumb.Item>
            }
        })
    }

    routerLink = () => {
        this.props.history.push('/home/account')
    }
    loginOut = () => {
        this.props.userLoginOutAction();
        this.props.history.push('/etc-verification/login')
    }

    render() {
        const { name,token } = this.props.userInfo;
        const content = (
                <div>
                    {/*<p onClick={ this.routerLink }>个人信息</p>*/}
                    <p style={ {cursor:'pointer'} } onClick={ this.loginOut  }>退出登录</p>
                </div>
        );
        return (
            <Header  className="header-container">
                <div className="head-content">
                    <div className="left-wrap">
                         <img src={ logo } alt="停车场logo" />
                    </div>
                    <div className="right-wrap">
                        {/*<div className="item-wrap">*/}
                            {/*<ReloadOutlined type="qrcode" />扫码录音*/}
                        {/*</div>*/}
                        {/*<div className="item-wrap"><ReloadOutlined type="aliwangwang" />坐席</div>*/}
                        {/*<div className="item-wrap"><ReloadOutlined type="bulb" />帮助中心</div>*/}
                        {/*<div className="item-wrap">*/}
                            {/*<Badge count={ this.state.count } offset={[4,0]}>*/}
                                {/*<ReloadOutlined type="bell" />消息*/}
                            {/*</Badge>*/}
                        {/*</div>*/}
                        <div className="item-wrap">
                            <Popover placement="bottom" overlayClassName="header-popover-container" content={content} trigger="hover">
                                <div>
                                    <img src={ `${ site.base }/businessAccount/getCompanyLogo?token=${ token }&random=${ Math.random() }` } alt="用户头像"/>
                                    <span className="item-name">{ name }</span>
                                </div>
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
    userLoginOutAction:any,
    userInfo:any,
    path:string
}


interface State {
    count:number
}

const mapStateToProps = (state:any) => ({
    collapsed:state.header.collapsed,
    userInfo:state.user.info
})

const mapDispatchToProps = {
    headerCollapsed,userLoginOutAction
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(HeaderLayout))