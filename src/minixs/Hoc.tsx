// Created by szatpig at 2020/4/30.
import React from 'react'

const EnhancedComponent = <P extends object>(WrappedComponent: React.ComponentType<P>) =>
    class extends React.Component<P> {
        render() {
            console.log(WrappedComponent)
            return <WrappedComponent {...this.props as P} />;
        }
    };

export default EnhancedComponent