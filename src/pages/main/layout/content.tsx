// Created by szatpig at 2019/8/20.
import React, { Component } from 'react'
import { Route, Switch } from "react-router-dom";

import routes from '../router'

import { Layout } from 'antd';
const { Content } = Layout;

class ContentLayout extends Component<Props, State> {
    static defaultProps = {}

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
    }

    render() {
        const  { url } =this.props;
        return (
            <Content className="content-container">
                <Switch>
                    {
                        routes.map((item:any,i) =>
                            item.path ?
                                <Route key={ i } path={ url + item.path } render={ (routeProps:any)=>( <item.component meta={ item.meta } { ...routeProps } /> ) } exact strict /> :
                                <Route key={ i } component={ item.component } />
                        )
                    }
                </Switch>
            </Content>
        )
    }
}

interface Props {
    url:string
}

interface State {
}

export default ContentLayout