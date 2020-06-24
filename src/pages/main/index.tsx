// Created by szatpig at 2019/8/20.
import React, {Component, lazy } from 'react'
import { connect } from 'react-redux'

import { Layout } from 'antd';

const { Sider } = Layout;

const ContentLayout  = lazy(() => import('./layout/content'));
const HeaderLayout  = lazy(() => import('./layout/header'));
const MenuLayout  = lazy(() => import('./layout/menu'));

const ErrorBoundary  = lazy(() => import('@/components/ErrorBoundary'));

class Home extends Component<Props, State>{

    render() {
        return (
            <Layout className="main-container">
                <HeaderLayout { ...this.props.match } />
                <Layout className="wrapper-container">
                    <Sider
                            trigger={ null }
                            collapsible
                            collapsed={ this.props.collapsed }
                            className="menu-container"
                            width={ 180 }>
                        <MenuLayout />
                    </Sider>
                    <ErrorBoundary>
                        <ContentLayout { ...this.props.match } />
                    </ErrorBoundary>
                </Layout>
            </Layout>
        )
    }
}

interface Props {
    // url:string
    match:any,
    history:any,
    userToken:string,
    collapsed:boolean
}

interface State {
}

const mapStateToProps = (state:any) => ({
    userToken:state.user.token,
    collapsed:state.header.collapsed
})

export default connect(mapStateToProps,{})(Home)