// Created by szatpig at 2019/8/15.
import React, { Component } from 'react'

interface Props {
}

interface State {
    hasError:boolean
}

class ErrorBoundary extends Component<Props, State> {
    static defaultProps = {}

    state:State = {
        hasError:false
    }

    static getDerivedStateFromError(e:any) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        console.log('getDerivedStateFromError:',e)
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // 你可以自定义降级后的 UI 并渲染
            return <h1>系统更新，请刷新重试</h1>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary 