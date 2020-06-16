// Created by szatpig at 2020/4/30.
import React, { useState, useEffect } from 'react';

import {Form, Input, Button, Modal, Table, Row, Col, Cascader, Upload, message } from 'antd';

import { getParkingDetailByBusinessId } from '@/api/common-api'
import { getAccountDetails, uploadLogo, updateIndustryLoginUserPwd } from "@/api/account-api";

import region from '@/json/region'

import site from '@/utils/config'
import { connect } from "react-redux";
import { userLoginOutAction } from "@/store/actions/user";

const options = region;
const columns = [
    {
        title: '停车场名称',
        dataIndex: 'parkingName',
        width: 120,
    },
    {
        title: '地址',
        dataIndex: 'address',
    },
    {
        title: '所属业主',
        dataIndex: 'owner',
    },
    {
        title: '经度',
        dataIndex: 'parkingLongitude',
    },
    {
        title: '纬度',
        dataIndex: 'parkingLatitude',
    },
    {
        title: '车位数',
        dataIndex: 'parkingSpacesNumber',
    },
    {
        title: '车道数',
        dataIndex: 'lanesNumber',
    },
    {
        title: 'ETC设备数',
        dataIndex: 'etcDevices',
    },
    {
        title: '起始日期',
        dataIndex: 'startDate',
    },
    {
        title: '终止日期',
        dataIndex: 'endDate',
    }
];
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
};

function Account(props:Props) {
    const [userInfo, setUserInfo] = useState({
        name:'--',
        certTypeName:'--',
        certNo:'--',
        certValidity:'--',
        contractTerm:'--',
        equityTotalAmount:0,
        availableEquityAmount:0,
        usedEquityAmount:0,
        freezeEquityAmount:0
    });
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:10,
        total:0
    });
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [Img, setImg] = useState({
        logo:'',
        code:''
    });
    const [modal, contextHolder] = Modal.useModal();

    console.log(props)
    const{ userToken, userLoginOutAction,history } = props

    const [ form ] = Form.useForm();
    const [ passwordForm ] = Form.useForm();
    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const handleShow = ()=>{
        setShow(true)
        passwordForm.resetFields();
    }


    //modal

    const handleSubmit = () => {
        setConfirmLoading(true);
        passwordForm.validateFields().then(values => {
            let _data = {
                ...values
            }
            updateIndustryLoginUserPwd(_data).then((data:any) => {
                setConfirmLoading(false);
                setShow(false);
                passwordForm.resetFields();
                message.success('密码修改成功,请重新登录')
                loginOut();
            }).catch(err =>{
                setConfirmLoading(false);
            })
        }).catch(info => {
            setConfirmLoading(false);
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setShow(false)
    };

    const onFileChange= ({ file,fileList,event }:any) => {
        // setFileList(fileList);
        console.log(file);
        if(file.status === 'done'){
            getImg()
        }
    };

    const handleBeforeUpload =(file:any,_fileList:any)=>{
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            message.error( '超过1M限制，不允许上传');
            return Promise.reject(false);
        }
        const fileType = '.jpeg, .jpg, .png, gif, .bmp';
        if(fileType.indexOf(file.name.split(/\./)[1]) === -1){
            message.error( '仅支持上传.jpeg, .jpg, .png, gif, .bmp格式');
            return Promise.reject(false);
        }
        return true ;
    };

    const loginOut = () => {
        userLoginOutAction();
        history.push('/login')
    }

    const getUserInfo = () => {
        let _data ={}
        getAccountDetails(_data).then((data:any) => {
            setUserInfo(data.data)
        })
    }

    const handleSearch = (values:object) => {
        console.log(values)
        list(values)
    }

    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
        form.submit();
    };

    const pagesChange = (current:number,pageSize:any) => {
        setPage({
            ...page,
            current,
            pageSize
        });
        form.submit();
    };

    const pageSizeChange= (current:number,pageSize:any) => {
        setPage({
            ...page,
            current:1,
            pageSize
        });
        form.submit();
    };

    const handleView = (src:any) => {
        modal.info({
            title: '查看二维码',
            className:'view-dialog-container',
            content: (
                    <div className="import-dialog-wrapper">
                        <img src ={ src } />
                    </div>
            ),
            onOk: () => {
            }
        });
    }

    const getImg = ()=>{
        setImg({
            logo:site.base + '/businessAccount/getCompanyLogo?token='+ userToken + '&random='+ Math.random(),
            code:site.base + '/businessAccount/getQrCodeImage?token='+ userToken + '&random='+ Math.random()
        })
    }

    const list = (args?:object) => {
        let { current,pageSize } = page
        let _data={
            pageNum:current,
            pageSize,
            ...args
        };
        getParkingDetailByBusinessId(_data).then((data:any) => {
            setTableData(data.data.list);
            setPage({
                ...page,
                total:data.data.total
            })
        })
    };

    useEffect(() => {
        //do something
        list();
        getUserInfo();
        getImg();
    },[1]);

    return (
        <div className="account-container">
            <div className="breadcrumb-container left-border line">企业账户</div>
            <div className="account-wrapper">
                <div className="wrapper-cell">
                    <p className="cell-title">基本信息</p>
                    <div className="cell-content">
                        <Row>
                            <Col flex="100px">名称</Col>
                            <Col flex="auto">{ userInfo.name } <Button type="link" onClick={ handleShow }>修改密码</Button></Col>
                        </Row>
                        <Row>
                            <Col flex="100px">证件类型</Col>
                            <Col flex="auto">{ userInfo.certTypeName }</Col>
                        </Row>
                        <Row>
                            <Col flex="100px">证件编号</Col>
                            <Col flex="auto">{ userInfo.certNo }</Col>
                        </Row>
                        <Row>
                            <Col flex="100px">证件有效期</Col>
                            <Col flex="auto">{ userInfo.certValidity }</Col>
                        </Row>
                        <Row>
                            <Col flex="100px">合同截止期</Col>
                            <Col flex="auto">{ userInfo.contractTerm }</Col>
                        </Row>
                        <Row className="upload-container">
                            <Col flex="100px">公司logo</Col>
                            <Col flex="auto">
                                <Upload name="logo"
                                    className="upload-wrapper"
                                    accept=".jpeg, .jpg, .png, gif, .bmp"
                                    action={ site.upload + "/businessAccount/uploadLogo"}
                                    headers = {{ token:userToken }}
                                    showUploadList={ false }
                                    beforeUpload = { handleBeforeUpload }
                                    onChange={ onFileChange }>
                                    <Button>选择文件</Button>
                                </Upload>
                                <p className="upload-txt">上传后将同步更新行业用户二维码</p>
                                <p><img src={ Img.logo } alt=""/></p>
                            </Col>
                        </Row>
                        <Row className="upload-container">
                            <Col flex="100px">二维码</Col>
                            <Col flex="auto">
                                <p><img onClick={ () => handleView(Img.code) } src={ Img.code } alt=""/></p>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="wrapper-cell">
                    <p className="cell-title">账户权益金</p>
                    <div className="cell-content summary-container flex">
                        <span className="flex column">
                            <i>权益总金额/元</i>
                            <i>{ userInfo.equityTotalAmount }</i>
                        </span>
                        <span className="flex column">
                            <i>权益余额/元</i>
                            <i>{ userInfo.availableEquityAmount }</i>
                        </span>
                        <span className="flex column">
                            <i>冻结金额/元</i>
                            <i>{ userInfo.freezeEquityAmount }</i>
                        </span>
                        <span className="flex column">
                            <i>已用金额/元</i>
                            <i>{ userInfo.usedEquityAmount }</i>
                        </span>
                    </div>
                </div>
                <div className="wrapper-cell">
                    <p className="cell-title">权益停车场</p>
                    <div className="cell-content">
                        <div className="search-container">
                            <div className="input-cells">
                                <Form
                                        layout="inline"
                                        onValuesChange={ onFormLayoutChange }
                                        form = { form }
                                        onFinish={ handleSearch }>
                                    <Form.Item label="停车场名称" name="parkingName">
                                        <Input placeholder="停车场名称" maxLength={ 18 } />
                                    </Form.Item>
                                    <Form.Item label="省市区" name="region">
                                        <Cascader options={ options } placeholder="请选择省市区" />
                                    </Form.Item>
                                    <Form.Item  label="详细地址" name="address">
                                        <Input placeholder="停车场名称" maxLength={ 18 } />
                                    </Form.Item>
                                    <Form.Item label="所属业主" name="owner">
                                        <Input placeholder="请输入" maxLength={ 10 } />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="button" onClick={ handleQuery }>查询</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                        <div className="table-container">
                            <Table
                                    rowKey="id"
                                    bordered
                                    columns={ columns }
                                    dataSource={ tableData }
                                    pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,...page }} />
                        </div>
                    </div>
                </div>
            </div>
            { contextHolder }
            <Modal
                    title="修改密码"
                    forceRender
                    visible={ show }
                    className="common-dialog"
                    onOk={ handleSubmit }
                    okText={"保存"}
                    maskClosable={ false }
                    confirmLoading={ confirmLoading }
                    onCancel={ handleCancel }>
                <Form {...layout} form={ passwordForm }>
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
                </Form>
            </Modal>
        </div>
    );
}

interface Props  {
    userToken:string,
    userLoginOutAction:any,
    history:any
}

const mapStateToProps = (state:any) => ({
    userToken:state.user.token
})
const mapDispatchToProps = {
    userLoginOutAction
}

export default connect(mapStateToProps,mapDispatchToProps)(Account)
