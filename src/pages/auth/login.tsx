// Created by szatpig at 2019/8/20.
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import md5 from "md5"

import { userLoginRequestAction, userLoginOutAction } from '@/store/actions/user'
import EnhanceIdentifyCode from '@/components/IdentifyCode'

import { getPublicKey } from '@/api/login-api'

class Login extends Component<UserFormProps, State> {


    static defaultProps = {}

    state = {
        publicKey:'',
        code:[]
    }

    formRef = React.createRef<FormInstance>();

    componentDidMount() {
        sessionStorage.clear();
        userLoginOutAction();
        let _data ={

        }
        getPublicKey(_data).then((data:any) => {
            this.setState({
                publicKey: data.data
            })
        })
    }


    handleSubmit = (values :any) => {
        const { userLoginRequestAction } = this.props;
        const { publicKey,code } = this.state

        let _data =Object.assign({},{
            ...values,
            password: md5(values.password), //核销行业用户登录使用md5加密
            publicKey,
            code
        })
        userLoginRequestAction(_data)

    };
    handleEmitCode = (val:string[]) =>{
        this.setState({
            code:val
        })
    }

    onFinishFailed = (errorInfo:any) => {
        console.log('Failed:', errorInfo);
    };

    render() {
        if(this.props.userToken && this.props.userInfo.currentAuthority){
            this.props.history.push('/home/white')
        }
        return (
            <div className="login-container">
                <div className="login-logo"></div>
                    <div className="login-wrap flex">
                        <div className="left-wrap flex-cell">
                            <img src={ require('../../images/login-logo.png') } />
                        </div>
                        <div className="right-wrap flex-cell">
                            <p>ETC停车券核销系统</p>
                            <Form ref={this.formRef} onFinish={ this.handleSubmit } onFinishFailed={ this.onFinishFailed } className="login-form" initialValues={{ }}>
                                <Form.Item name="account" rules={[{ required: true, message: '请输入账号' }]}>
                                            <Input
                                                    size="large"
                                                    prefix={<UserOutlined  type="user" style={{ color: '#9396A5',fontSize:'15px' }} />}
                                                    placeholder="请输入账号"
                                            />
                                </Form.Item>
                                <Form.Item name="password"  rules={[
                                    { required: true, message: '请输入密码' },
                                    { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '6-16位，至少包含字母和数字' },
                                ]}>
                                    <Input
                                        size="large"
                                        prefix={<LockOutlined  type="lock" style={{ color: '#9396A5',fontSize:'15px' }} />}
                                        type="password"
                                        placeholder="6-16位，至少包含字母和数字"
                                    />
                                </Form.Item>
                                {
                                    (this.props.error === 5010 || this.props.error === 5013) &&
                                    <Form.Item
                                        className="identify-wrap"
                                        shouldUpdate={(prevValues, currentValues) => prevValues.account !== currentValues.account}>
                                        {
                                            ({ getFieldValue }) => {
                                                return <EnhanceIdentifyCode { ...{ error:this.props.error || 1,username:getFieldValue('account'),handleEmitCode:this.handleEmitCode } } />
                                            }
                                        }
                                    </Form.Item>
                                }
                                <Form.Item>
                                    <Button type="primary" size="large" htmlType="submit" className="login-button">
                                        立即登录
                                    </Button>
                                </Form.Item>
                            </Form>
                    </div>
                </div>
            </div>
        )
    }
}

interface UserFormProps{
    username: string;
    password: string;
    userToken:string;
    userInfo:any,
    userLoginRequestAction?: any;
    userLoginOutAction:()=>void
    history:any,
    error?:number
}

interface State {
    code:string[],
    publicKey:string
}

const mapStateToProps = (state:any) => ({
    userToken:state.user.token,
    userInfo:state.user.info,
    error:state.common.error.status ||　''
})

const mapDispatchToProps = {
    userLoginRequestAction,
    userLoginOutAction
}

export default connect(mapStateToProps,mapDispatchToProps)(Login)