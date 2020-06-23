// Created by szatpig at 2020/6/18.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux'

import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button,Radio, DatePicker, Table, Checkbox, Cascader, Upload, Modal, message, Row, Col } from 'antd';

import site from '@/utils/config'
import { getParkingDetailByBusinessId } from '@/api/common-api'
import {equityConfigList, grantConfirmData , grantEquity, parseWhitelist, importEquity} from '@/api/industryUser/white-api'

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
    const params:any = useParams();
    const [ submitForm ] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();
    const [equityList, setEquityList] = useState([]);
    const [fileList, setFileList] = useState<any[]>([]);

    const{ userToken } = props

    const onFinish = (values:any) => {
        let { plateNo,plateColor,equityConfigId,whitelistUri,expirationTime,parkIdList } =  values,
                parkIdListSearch = !Array.isArray(parkIdList)? parkIdList:{};

        parkIdList = Array.isArray(parkIdList)?parkIdList.join(','):''
        if(params.id === 0){
            let _data ={
                plateNo,
                equityConfigId
            }
            grantConfirmData(_data).then((data:any) => {
                const { industryUserName, equityBalance, currentAvailableCount, equityUserCount, grandCount, newCount, totalAmount } = data.data
                modal.confirm({
                    icon:<ExclamationCircleOutlined />,
                    title: '发放确认',
                    className:'import-dialog-container',
                    okText:'确认发放',
                    cancelText:'取消',
                    content: (
                            <div className="import-dialog-wrapper">
                                <div className="import-cell">
                                    <p>行业信息</p>
                                    <div className="import-content">
                                        <p><span>行业用户名称：</span>{ industryUserName }</p>
                                        <p><span>权益余额：</span>{ equityBalance }元</p>
                                        <p><span>当前有效白名单：</span>{ currentAvailableCount } 个</p>
                                        <p><span>白名单上限：</span>{ equityUserCount } 个</p>
                                    </div>
                                </div>
                                <div className="import-cell">
                                    <p>发放信息</p>
                                    <div className="import-content">
                                        <p><span>共计：</span>{ grandCount } 笔</p>
                                        <p><span>其中新增白名单：</span>{ newCount }个</p>
                                        <p><span>权益金额总计：</span>{ totalAmount }元</p>
                                    </div>
                                </div>
                            </div>
                    ),
                    onOk: () => {
                        handleDialogSingleConfirm({
                            plateNo,
                            plateColor,
                            equityConfigId,
                            parkIdList,
                            parkIdListSearch
                        })//确认按钮的回调方法，在下面
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            })
        }else{
            let _data ={
                whitelistUri,
                equityConfigId
            }
            parseWhitelist(_data).then((data:any) => {
                const { industryUserName, equityBalance, currentAvailableCount, equityUserCount, importCount, newCount, totalAmount } = data.data
                modal.confirm({
                    icon:<ExclamationCircleOutlined />,
                    title: '导入确认',
                    className:'import-dialog-container',
                    okText:'确认导入',
                    cancelText:'取消',
                    content: (
                            <div className="import-dialog-wrapper">
                                <div className="import-cell">
                                    <p>行业信息</p>
                                    <div className="import-content">
                                        <p><span>行业用户名称：</span>{ industryUserName }</p>
                                        <p><span>权益余额：</span>{ equityBalance }元</p>
                                        <p><span>当前有效白名单：</span>{ currentAvailableCount }个</p>
                                        <p><span>白名单上限：</span>{ equityUserCount }个</p>
                                    </div>
                                </div>
                                <div className="import-cell">
                                    <p>导入信息</p>
                                    <div className="import-content">
                                        <p><span>共计：</span>{ importCount } 笔</p>
                                        <p><span>其中新增白名单：</span>{ newCount }个</p>
                                        <p><span>权益余额总计：</span>{ totalAmount }元</p>
                                    </div>
                                </div>
                            </div>
                    ),
                    onOk: () => {
                        handleDialogConfirm({
                            equityConfigId,
                            whitelistUri,
                            parkIdList,
                            parkIdListSearch
                        })//确认按钮的回调方法，在下面
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            })
        }
    };

    const handleDialogSingleConfirm = (_data:any) => {
        grantEquity(_data).then((data:any) => {
            message.success('发放成功');
            history.replace('/home/white')
        })
    }

    const handleDialogConfirm = (_data:any) => {
        importEquity(_data).then((data:any) => {
            message.success('导入成功');
            history.replace('/home/white')
        })
    }

    const getEquityList = () => {
        let _data ={}
        equityConfigList(_data).then((data:any) => {
            setEquityList(data.data.map((item:any) => ({
                value:item.id,
                label:item.equityLevel
            })))
        })
    }

    useEffect(() => {
        getEquityList()
    },[]);

    return (
            <div className="store-detail-container">
                <div className="breadcrumb-container line">
                    <div className="breadcrumb-cell">
                        <div onClick={ () => history.go(-1) }><LeftOutlined />返回</div>
                        <div>{ params.id === 0 ? '添加商家':'编辑商家' }</div>
                    </div>
                </div>
                <Form form={ submitForm }  className="form-container" name="nest-messages" onFinish={ onFinish } validateMessages={validateMessages}>
                    <p className="form-title">基本信息</p>
                    <Row className="form-grid" justify="start" gutter={[60, 0]}>
                        <Col span={ 8 }>
                            <Form.Item name="plateNo" { ...layout } label="商户名称" rules={[
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
                            <Form.Item label="商户类型" { ...layout } name="couponStatus">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    <Option value="0">未领取</Option>
                                    <Option value="1">已领取</Option>
                                    <Option value="2">已核销</Option>
                                    <Option value="3">已过期</Option>
                                    <Option value="4">已撤销</Option>
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
                            <Form.Item label="法定代表人/负责人证件编号" { ...layoutMore } name="plateNo">
                                <Input placeholder="请输入" maxLength={ 8 }/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="法定代表人/负责人名称" { ...layoutMore } name="plateNo">
                                <Input placeholder="请输入" maxLength={ 8 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item label="法定代表人/负责人名称" { ...layoutMore } name="plateNo">
                                <Input placeholder="请输入" maxLength={ 8 }/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="法定代表人/负责人证件类型" { ...layoutMore } name="couponStatus">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    <Option value="0">未领取</Option>
                                    <Option value="1">已领取</Option>
                                    <Option value="2">已核销</Option>
                                    <Option value="3">已过期</Option>
                                    <Option value="4">已撤销</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item name="plateNo" label="联系人" { ...layout }  rules={[{ required: true,whitespace: true }]}>
                                <Input maxLength={ 20 } placeholder="请输入联系人" />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="企业证件类型" { ...layoutMore } name="couponStatus">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    <Option value="0">未领取</Option>
                                    <Option value="1">已领取</Option>
                                    <Option value="2">已核销</Option>
                                    <Option value="3">已过期</Option>
                                    <Option value="4">已撤销</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={ 8 } />
                        <Col span={8}>
                            <Form.Item name="plateNo" { ...layout } label="联系电话" rules={[
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
                            <Form.Item name="storeAccount"  { ...layout }label="商家账号名" rules={[
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
