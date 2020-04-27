// Created by szatpig at 2019/8/20.
import React, { Component } from 'react'
import { withRouter, Redirect } from 'react-router';
import { connect } from 'react-redux'
import { FormComponentProps } from 'antd/es/form';
import { Link } from 'react-router-dom'
import { Form, Icon, Input, Button } from 'antd';
import { EncryptStr } from '@/utils/utils'

import { userLoginRequestAction } from '@/store/actions/user'
import EnhanceIdentifyCode from '@/components/IdentifyCode'
import logo from '@/images/logo-text.png'

import { getPublicKey, userLogin, getRoleMenu  } from '@/api/login-api'

class Login extends Component<UserFormProps, State> {
    static defaultProps = {}

    state = {
        codePanel:false,
        publicKey:'',
    }

    componentDidMount() {
        sessionStorage.clear();
        console.log(this.props)
        let _data ={

        }
        getPublicKey(_data).then((data:any) => {
            this.setState({
                publicKey: data.data
            })
        })
    }

    componentWillUnmount() {
    }

    handleSubmit = (e:any) => {
        const { userLoginRequestAction } = this.props;
        const { publicKey } = this.state
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                let _data =Object.assign({},{
                    ...values,
                    password: EncryptStr(values.password,publicKey),
                    publicKey
                })
                userLoginRequestAction(_data)
            }
        });
    };
    handleTogglePanel = (val:boolean) =>{
        this.setState((state,props)=> ({
            codePanel:val
        }))
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        console.log('token:',this.props.userToken)
        if(this.props.userToken){
            return <Redirect to='/home/sceneManager/sceneList'/>
        }
        return (
            <div className="login-container flex-container">
                <div className="logo-wrapper">
                    <a target="_blank" href="http://www.ynt.ai">
                        <img src={ logo } alt="意能通logo" />
                    </a>
                </div>
                <div className="form-wrapper">
                    <p className="form-text">外呼后台管理系统</p>
                    <Form onSubmit={ this.handleSubmit } className="login-form">
                        <Form.Item>
                            { getFieldDecorator('userName', {
                                rules: [
                                    { required: true, message: '请输入邮箱地址' },
                                    { pattern:/^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/, message: '请输入合法的邮箱地址' }
                                ],
                             })(
                                <Input
                                    size="large"
                                    prefix={<Icon type="user" style={{ color: '#9396A5',fontSize:'15px' }} />}
                                    placeholder="请输入邮箱账号"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [
                                   { required: true, message: '请输入密码' },
                                   { pattern: /^[\S]{6,16}$/, message: '6-16位，至少包含字母和数字' },
                                ],
                            })(
                                    <Input
                                            size="large"
                                            prefix={<Icon type="lock" style={{ color: '#9396A5',fontSize:'15px' }} />}
                                            type="password"
                                            placeholder="6-16位，至少包含字母和数字"
                                    />,
                            )}
                        </Form.Item>
                        {
                            this.state.codePanel &&
                            <Form.Item>
                                <EnhanceIdentifyCode />
                            </Form.Item>
                        }
                        <Form.Item>
                            <Button type="primary" size="large" htmlType="submit" className="login-button">
                                立即登录
                            </Button>
                        </Form.Item>
                    </Form>
                    <Link className="form-find" to="/forgot">忘记密码</Link>
                </div>
            </div>
        )
    }
}

const EnhancedLogin = Form.create({ name: 'login' })(Login);


interface UserFormProps extends FormComponentProps {
    username: number;
    password: string;
    userToken:string;
    userLoginRequestAction?: any;
}

interface State {
}

const mapStateToProps = (state:any) => ({
    userToken:state.user.token
})

const mapDispatchToProps = {
    userLoginRequestAction
}

export default connect(mapStateToProps,mapDispatchToProps)(EnhancedLogin)