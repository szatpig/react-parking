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
import VerificateDrawerfrom from "@/pages/main/common/verification";
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


    drawRef:any = React.createRef();

    routerLink = () => {
        this.props.history.push('/home/account')
    }
    loginOut = () => {
        this.props.userLoginOutAction();
        this.props.history.push('/login')
    }

    handleShow = () => {
        if(this.drawRef.current){
            this.drawRef.current.show()
        }

    }


    render() {
        const { name,token,currentAuthority } = this.props.userInfo;
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
                        <span className="user-type">
                            {
                                currentAuthority === 'admin' ? '商户' : (currentAuthority === 'user' ?  '行业用户' : '商家')
                            }
                        </span>
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
                        {
                            currentAuthority === 'admin' && <div className="item-wrap" onClick={ this.handleShow }>人工核销</div>
                        }

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
                <VerificateDrawerfrom ref={ this.drawRef } />
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