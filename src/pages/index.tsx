// Created by szatpig at 2019/8/20.
import React, { Component, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const Login = lazy(() => import('./auth/login'));
const NoMatch = lazy(() => import('./error/404'));
const Home = lazy(() => import('./main'));

class Pages extends Component {
    render() {
        return (
            <Router>
                <Suspense fallback={<div>Loading...</div>}>
                    <Switch>
                        <Route exact path="/" component={ Login }/>
                        <Route exact strict path="/login" component={ Login }/>
                        <Route strict path="/home" component={ Home }/>
                        <Route component={ NoMatch } />
                    </Switch>
                </Suspense>
            </Router>
        )
    }
}

export default Pages