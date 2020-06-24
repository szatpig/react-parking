// Created by szatpig at 2020/6/18.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux'

import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button,Radio, DatePicker, Table, Checkbox, Cascader, Upload, Modal, message, Row, Col } from 'antd';

import site from '@/utils/config'
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
    const [equityList, setEquityList] = useState([]);
    const [fileList, setFileList] = useState<any[]>([]);

    const{ userToken } = props

    const onFinish = (values:any) => {
        let { plateNo,plateColor,equityConfigId,whitelistUri,expirationTime,parkIdList } =  values
        if(id === 0){
            let _data ={
                plateNo,
                equityConfigId
            }
            merchantUserUpdate(_data).then((data:any) => {
                message.success('编辑成功');
                history.replace('/home/merchant')
            })
        }else{
            let _data ={
                whitelistUri,
                equityConfigId
            }
            merchantUserAdd(_data).then((data:any) => {
                message.success('添加成功');
                history.replace('/home/merchant')
            })
        }
    };

    const getMerchantUserInfo = (id:number) => {
        if(!id) return false;
        let _data ={
            id
        }
        getMerchantUser(_data).then((data:any) => {
            setEquityList(data.data.map((item:any) => ({
                value:item.id,
                label:item.equityLevel
            })))
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
                        <div>{ !!!id ? '添加商家':'编辑商家' }</div>
                    </div>
                </div>
                <Form form={ submitForm }
                      className="form-container"
                      name="nest-messages"
                      onFinish={ onFinish }
                      validateMessages={validateMessages}
                      initialValues={{
                          merchantType:'1',
                          legalPersonIdType:'1',
                      }}>
                    <p className="form-title">基本信息</p>
                    <Row className="form-grid" justify="start" gutter={[60, 0]}>
                        <Col span={ 8 }>
                            <Form.Item name="name" { ...layout } label="商户名称" rules={[
                                { required: true,whitespace: true },
                                { pattern:/^[\w\u4e00-\u9fa5()（）]{3,20}$/, message: '请输入3-20位字符'}
                             ]}>
                                <Input maxLength={ 20 } placeholder="请输入商户名称" />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="商户地址" { ...layout } name="region"  required rules={[
                                { required: true,  type:'array', whitespace: true,validateTrigger:'blur' }
                            ]}>
                                <Cascader options={ options } placeholder="请选择省市区" />
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item label="商户类型" { ...layout } name="merchantType">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    <Option value="1">企业</Option>
                                    <Option value="2">自然人</Option>
                                    <Option value="3">个体工商户</Option>
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
                            <Form.Item label="法定代表人/负责人证件编号" { ...layoutMore } name="legalPersonIdNo" rules={[
                                { required: true, whitespace: true }
                            ]}>
                                <Input placeholder="请输入" maxLength={ 8 }/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="法定代表人/负责人名称" { ...layoutMore } name="legalPerson" rules={[
                                { required: true, whitespace: true }
                            ]}>
                                <Input placeholder="请输入" maxLength={ 8 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item label="企业证件编号" { ...layoutMore } name="enterpriseIdNo">
                                <Input placeholder="请输入" maxLength={ 8 }/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="法定代表人/负责人证件类型" { ...layoutMore } name="legalPersonIdType">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    <Option value="1">身份证</Option>
                                    <Option value="2">护照</Option>
                                    <Option value="3">军官证</Option>
                                    <Option value="4">其他证件</Option>
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
                            <Form.Item label="企业证件类型" { ...layoutMore } name="enterpriseIdType">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    <Option value="1">营业执照</Option>
                                    <Option value="2">组织机构代码证</Option>
                                    <Option value="3">统一社会信用代码</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item name="phone" { ...layout } label="联系电话" rules={[
                                { required: true,whitespace: true },
                                { pattern: /^(((\d{2}-)?0\d{2,3}-?\d{7,8})|((\d{2}-)?(\d{2,3}-)?([1][3-9][0-9]\d{8})))$/g}
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
                                <Input maxLength={ 20 } placeholder="请输入以字母开头3-20位，可包含数字、字母、下划线" />
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
