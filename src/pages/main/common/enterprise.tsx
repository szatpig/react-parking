// Created by szatpig at 2020/6/16.
import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";

import {Form, Input, Button, Modal, Row, Col, message } from 'antd';

import site from '@/utils/config'
import { userLoginOutAction } from "@/store/actions/user";
import { updateIndustryLoginUserPwd,getCommercialUser,getMerchantUser } from "@/api/common-api";

const layout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};

const merchantTypeArr:string[] = ['--','企业','自然人','个体工商户'];
const legalPersonIdTypeArr:string[] = ['--','身份证','护照','军官证','其他证件'];
const enterpriseIdTypeArr:string[] = ['--','营业执照','组织机构代码证','统一社会信用代码'];

function EnterpriseAccount(props:Props) {
    const [userInfo, setUserInfo] = useState({
        username:'--',
        name:'--',
        completeAddress:'--',

        contact:'--',
        phone:'--',
        pictures:[],
        certificateList:[],
        permitList:[],
        invoiced:'',

        //
        merchantType:0,
        legalPerson:'',
        legalPersonIdType:0,
        legalPersonIdNo:'',
        enterpriseIdType:0,
        enterpriseIdNo:''

    });
    const [Img, setImg] = useState({
        logo:'',
        code:''
    });
    const [modal, contextHolder] = Modal.useModal();
    const{ userToken, userLoginOutAction,history,currentAuthority } = props
    const [ passwordForm ] = Form.useForm();
    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };
    const spanStyle = {
        flex: currentAuthority ==='admin' ? '100px' : '220px'
    }
    const handleSubmit = () => {
        passwordForm.validateFields().then(values => {
            let _data = {
                ...values
            }
            updateIndustryLoginUserPwd(_data).then((data:any) => {

                passwordForm.resetFields();
                message.success('密码修改成功,请重新登录')
                loginOut();
            }).catch(err =>{

            })
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    const loginOut = () => {
        userLoginOutAction();
        history.push('/etc-verification/login')
    }

    const getUserInfo = () => {
        let _data ={}
        if(currentAuthority==='admin'){
            getCommercialUser(_data).then((data:any) => {
                setUserInfo(data.data)
            })
        }else{
            getMerchantUser(_data).then((data:any) => {
                setUserInfo(data.data)
            })
        }

    }

    const handleView = (src:any) => {
        modal.info({
            title: '查看二维码',
            className:'view-dialog-container',
            content: (
                    <div className="import-dialog-wrapper">
                        <img src ={ src } />
                    </div>
            ),
            onOk: () => {}
        });
    }

    const getImg = ()=>{
        setImg({
            logo:site.base + '/businessAccount/getCompanyLogo?token='+ userToken + '&random='+ Math.random(),
            code:site.base + '/businessAccount/getQrCodeImage?token='+ userToken + '&random='+ Math.random()
        })
    }

    useEffect(() => {
        //do something
        getUserInfo();
        getImg();
    },[1]);


    return (
            <div className="enterprise-account-container account-container">
                <div className="breadcrumb-container left-border line">企业账户</div>
                <div className="account-wrapper">
                    <div className="wrapper-cell">
                        <p className="cell-title">基本信息</p>
                        <div className="cell-content">
                            <Row>
                                <Col { ...spanStyle }>账号名</Col>
                                <Col flex="auto">{ userInfo.username }</Col>
                            </Row>
                            <Row>
                                <Col { ...spanStyle }>商户名称</Col>
                                <Col flex="auto">{ userInfo.name }</Col>
                            </Row>
                            <Row>
                                <Col { ...spanStyle }>商户地址</Col>
                                <Col flex="auto">{ userInfo.completeAddress }</Col>
                            </Row>
                            { currentAuthority==='admin'?
                                    <>
                                        <Row>
                                            <Col { ...spanStyle }>联系人</Col>
                                            <Col flex="auto">{ userInfo.contact }</Col>
                                        </Row>
                                        <Row>
                                            <Col { ...spanStyle }>联系电话</Col>
                                            <Col flex="auto">{ userInfo.phone }</Col>
                                        </Row>
                                        <Row className="upload-container">
                                            <Col { ...spanStyle }>商户图片</Col>
                                            <Col flex="auto">
                                                <p>
                                                    {
                                                        userInfo.pictures.map((item:any) => (
                                                                <img onClick={ () => handleView(item) } src={ Img.code } alt="商户图片"/>
                                                        ))
                                                    }
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row className="upload-container">
                                            <Col { ...spanStyle }>营业执照</Col>
                                            <Col flex="auto">
                                                <p>
                                                    {
                                                        userInfo.certificateList.map((item:any) => (
                                                                <img onClick={ () => handleView(item) } src={ Img.code } alt="营业执照"/>
                                                        ))
                                                    }
                                                </p>
                                            </Col>
                                        </Row>
                                        <Row className="upload-container">
                                            <Col { ...spanStyle }>开户许可证</Col>
                                            <Col flex="auto">
                                                <p>
                                                    {
                                                        userInfo.permitList.map((item:any) => (
                                                                <img onClick={ () => handleView(item) } src={ Img.code } alt="开户许可证"/>
                                                        ))
                                                    }
                                                </p>
                                            </Col>
                                        </Row>
                                    </> :
                                    <>
                                        <Row>
                                            <Col { ...spanStyle }>商家类型</Col>
                                            <Col flex="auto">{ merchantTypeArr[userInfo.merchantType] }</Col>
                                        </Row>
                                        <Row>
                                            <Col { ...spanStyle }>法定代表人/负责人证件类型</Col>
                                            <Col flex="auto">{ legalPersonIdTypeArr[userInfo.legalPersonIdType] }</Col>
                                        </Row>
                                        <Row>
                                            <Col { ...spanStyle }>法定代表人/负责人证件编号</Col>
                                            <Col flex="auto">{ userInfo.legalPersonIdNo }</Col>
                                        </Row>
                                        <Row>
                                            <Col { ...spanStyle }>企业证件类型</Col>
                                            <Col flex="auto">{ enterpriseIdTypeArr[userInfo.enterpriseIdType] }</Col>
                                        </Row>
                                        <Row>
                                            <Col { ...spanStyle }>企业证件编号</Col>
                                            <Col flex="auto">{ userInfo.enterpriseIdNo }</Col>
                                        </Row>
                                    </>
                            }

                        </div>
                        <p className="cell-title">修改密码</p>
                        <div className="">
                            <Row>
                                <Col flex="400px">
                                    <Form {...layout} form={ passwordForm } onFinish={ handleSubmit }>
                                        <Form.Item name="oldPassword" label="原密码" rules={ [
                                            { required: true, message: '请输入原密码' },
                                            { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '6-16位，至少包含字母和数字' }
                                        ] }>
                                            <Input.Password maxLength={ 20 } placeholder="请输入至少6位英文 + 数字密码" />
                                        </Form.Item>
                                        <Form.Item name="newPassword" label="新密码" rules={ [
                                            { required: true, message: '请输入原密码' },
                                            { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '6-16位，至少包含字母和数字' }
                                        ] }>
                                            <Input.Password maxLength={ 20 } placeholder="请输入至少6位英文 + 数字密码" />
                                        </Form.Item>
                                        <Form.Item name="confirmNewPassword" label="确认新密码" rules={ [
                                            { required: true, message: '请输入确认新密码' },
                                            { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/, message: '6-16位，至少包含字母和数字' }
                                        ] }>
                                            <Input.Password maxLength={ 20 } placeholder="请输入至少6位英文 + 数字密码" />
                                        </Form.Item>
                                        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 7 }}>
                                            <Button type="primary" htmlType="submit">
                                                保存
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
                { contextHolder }
            </div>
    );
}

interface Props  {
    userToken:string,
    userLoginOutAction:any,
    history:any,
    currentAuthority:string
}

const mapStateToProps = (state:any) => ({
    userToken:state.user.token,
    currentAuthority:state.user.info.currentAuthority
})
const mapDispatchToProps = {
    userLoginOutAction
}

export default connect(mapStateToProps,mapDispatchToProps)(EnterpriseAccount)
