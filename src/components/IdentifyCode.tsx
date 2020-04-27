// Created by szatpig at 2019/8/22.
import React, { Component } from 'react';
import EnhanceWithClickOutside from 'react-click-outside';
import { Icon, Button } from 'antd';

import baseConfig from './../utils/config'

class IdentifyCode extends Component<Props, State> {
    constructor(props:Props){
        super(props);
        this.state = {
            codeActive:false,
            codeUrl:'',
        };
    }

    componentDidMount() {
    }

    componentDidUpdate() {
    }

    componentWillUnmount() {
    }

    handleClickOutside = () =>{
        this.setState({
            codeActive: false
        })
    }
    handleGetCode = () =>{
        this.toggleActive();
        this.initGetImg('admin');
    }

    selectCode = () =>{
        this.toggleActive()
    }

    codeRefresh = () =>{
        this.initGetImg('admin');
    }

    toggleActive = () =>{
        this.setState({
            codeActive: !this.state.codeActive
        })
    }

    initGetImg = (userName:string) => {
        let _data = {
            userName
        };
        this.setState((state,props)=>({
            codeUrl: baseConfig.base + '/permission/getVeriCodeImg?userName=' + _data.userName +'&random='+Math.random()
        }))
    }

    render() {
        const { codeUrl,codeActive } = this.state;
        return (
            <div className='identify-code-container'>
                <Button type="primary" onClick={ this.handleGetCode }>点此进行验证</Button>
                <img
                    className = { `code-img ${codeActive && ' active' || ''}`}
                    id='codeimgid'
                    onClick={ this.selectCode }
                    src={ codeUrl } />
                { codeActive &&
                    <Icon
                    onClick={ this.codeRefresh }
                    className="code-refresh"
                    type="redo" /> }
            </div>
        );
    }

}

interface State {
    codeUrl:string,
    codeActive:boolean
}
interface Props {
}


const EnhanceIdentifyCode = EnhanceWithClickOutside(IdentifyCode);

export default EnhanceIdentifyCode
