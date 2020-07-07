// Created by szatpig at 2020/6/18.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux'

import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, Cascader, Modal, message, Row, Col } from 'antd';

import {getMerchantUser, merchantUserUpdate , merchantUserAdd} from '@/api/admin/merchant-api'

import region from '@/json/region'

const options = region;

const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
};

const layoutMore = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 }
};

const validateMessages = {
    required: '${label}不能为空',
    types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

function StoreDetail(props:Props) {
    const history = useHistory();
    const { id } = useParams();
    const [ submitForm ] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();
    const [required,setRequired] = useState(true)
    const [loginUserIds,setLoginUserId] = useState(true)

    const handleSelect = (val:number) => {
        setRequired(val === 1)
    }

    const onFinish = (values:any) => {
        let { region,username,...others } =  values,
        [province, city, area]= region || [];
        if(id > 0){
            let _data ={
                id,
                loginUserId:loginUserIds,
                ...others,
                province, city, area
            }
            merchantUserUpdate(_data).then((data:any) => {
                message.success('编辑成功');
                history.replace('/home/merchant')
            })
        }else{
            let _data ={
                ...others,
                username,
                province, city, area
            }
            merchantUserAdd(_data).then((data:any) => {
                modal.success({
                    title: '用户添加成功',
                    className:'import-dialog-container',
                    content: (
                            <div className="import-dialog-wrapper password-dialog-wrapper">
                                <div className="import-cell">
                                    <p>请使用下方账号和默认密码登录系统</p>
                                    <div className="import-content">
                                        <p><span>登录地址：</span><a target="_blank" href={ data.data.loginUserAddress + '?tab=relogin' }>{ data.data.loginUserAddress }</a></p>
                                        <p><span>用户账号：</span>{ data.data.userName }</p>
                                        <p><span>默认密码：</span>{ data.data.password }</p>
                                    </div>
                                </div>
                            </div>
                    ),
                    onOk: () => {
                        history.replace('/home/merchant')
                    }
                });
            })
        }
    };

    const getMerchantUserInfo = (id:number) => {
        console.log(id);
        if(id < 1 ) return false;
        let _data ={
            id
        }
        getMerchantUser(_data).then((data:any) => {
            let { province, city, area, loginUserId, ...others } = data.data,
                    region = [province, city, area] || [];
            submitForm.setFieldsValue({
                ...others,
                region
            })
            setLoginUserId(loginUserId)
            setRequired(data.data.merchantType === 1)
        })
    }

    useEffect(() => {
        getMerchantUserInfo(id)
    },[]);

    return (
            <div className="store-detail-container">
                <div className="breadcrumb-container line">
                    <div className="breadcrumb-cell">
                        <div onClick={ () => history.go(-1) }><LeftOutlined />返回</div>
                        <div>{ id < 1 ? '添加商家':'编辑商家' }</div>
                    </div>
                </div>
                <Form form={ submitForm }
                      className="form-container"
                      name="nest-messages"
                      onFinish={ onFinish }
                      validateMessages={validateMessages}
                      initialValues={{
                          merchantType:1,
                          legalPersonIdType:1
                      }}>
                    <p className="form-title">基本信息</p>
                    <Row className="form-grid" justify="start" gutter={[60, 0]}>
                        <Col span={ 8 }>
                            <Form.Item name="name" { ...layout } label="商家名称" rules={[
                                { required: true,whitespace: true },
                                { pattern:/^[\w\u4e00-\u9fa5()（）]{3,20}$/, message: '请输入3-20位字符'}
                             ]}>
                                <Input maxLength={ 20 } placeholder="请输入商家名称" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="商家地址" { ...layout } name="region"  rules={[
                                { required: true,  type:'array', whitespace: true,validateTrigger:'blur' }
                            ]}>
                                <Cascader options={ options } placeholder="请选择省市区" />
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item label="商家类型" { ...layout } name="merchantType" rules={[
                                { required: true,type:'number', whitespace: true }
                            ]}>
                                <Select
                                        placeholder="请选择类型"
                                        allowClear onChange = { handleSelect }>
                                    <Option value={ 1 }>企业</Option>
                                    <Option value={ 2 }>自然人</Option>
                                    <Option value={ 3 }>个体工商户</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="address"  { ...layout } wrapperCol={{ span:18,offset:6 }} rules={[
                                { required: true, whitespace: true,message:'请完善商户地址' }
                            ]}>
                                <Input placeholder="详情地址" maxLength={ 18 } />
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item label="法定代表人/负责人证件类型" { ...layoutMore } name="legalPersonIdType" rules={[
                                { required: true,type:'number', whitespace: true }
                            ]}>
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    <Option value={ 1 }>身份证</Option>
                                    <Option value={ 2 }>护照</Option>
                                    <Option value={ 3 }>军官证</Option>
                                    <Option value={ 4 }>其他证件</Option>
                                </Select>
                            </Form.Item>

                        </Col>
                        <Col span={8}>
                            <Form.Item label="法定代表人/负责人名称" { ...layoutMore } name="legalPerson" rules={[
                                { required: true,  whitespace: true }
                            ]}>
                                <Input placeholder="请输入" maxLength={ 8 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item label="法定代表人/负责人证件编号" { ...layoutMore } name="legalPersonIdNo" rules={[
                                { required: true, whitespace: true }
                            ]}>
                                <Input placeholder="请输入" maxLength={ 8 }/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="企业证件类型" { ...layoutMore } name="enterpriseIdType"
                                  dependencies={['merchantType']}
                                  rules={[
                                        { required: required, whitespace: true , type:'number', message: '请选择企业证件类型' }
                                  ]}>
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    <Option value={ 1 }>营业执照</Option>
                                    <Option value={ 2 }>组织机构代码证</Option>
                                    <Option value={ 3 }>统一社会信用代码</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item name="contact" label="联系人" { ...layout }  rules={[{ required: true,whitespace: true }]}>
                                <Input maxLength={ 20 } placeholder="请输入联系人" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="企业证件编号" { ...layoutMore } name="enterpriseIdNo"
                                dependencies={['merchantType']}
                                rules={[
                                    { required: required, whitespace: true, message: '请输入企业证件编号' }
                                ]}>
                                <Input placeholder="请输入" maxLength={ 25 }/>
                            </Form.Item>

                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item name="phone" { ...layout } label="联系电话" rules={[
                                { required: true,whitespace: true },
                                { pattern: /^(((\d{2}-)?0\d{2,3}-?\d{7,8})|((\d{2}-)?(\d{2,3}-)?([1][3-9][0-9]\d{8})))$/g,message:'请输入联系电话'}
                            ]}>
                                <Input maxLength={ 15 } placeholder="请输入联系电话" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <p className="form-title">账号信息</p>
                    <Row className="form-grid" justify="start" gutter={[60, 0]}>
                        <Col span={ 8 }>
                            <Form.Item name="username"  { ...layout }label="商家账号名" rules={[
                                { required: true,whitespace: true,pattern:/^[a-zA-Z]+[\w]{2,19}$/, message: '请输入以字母开头3-20位，可包含数字、字母、下划线' },
                            ]}>
                                <Input disabled={ id > 0 } maxLength={ 20 } placeholder="请输入以字母开头3-20位，可包含数字、字母、下划线" />
                            </Form.Item>
                        </Col>
                        <Col span={ 24 }>
                            <Form.Item wrapperCol={{  offset: 1 }}>
                                <Button type="primary" htmlType="submit">
                                    保存
                                </Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                { contextHolder }
            </div>
    );
}


interface Props  {
    userToken:string
}

const mapStateToProps = (state:any) => ({
    userToken:state.user.token
})

export default connect(mapStateToProps,{})(StoreDetail)
