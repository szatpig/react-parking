// Created by szatpig at 2019/8/15.
import React, {Component} from 'react'

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

    static getDerivedStateFromError() {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // 你可以自定义降级后的 UI 并渲染
            return <h1>Something went wrong.</h1>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary 