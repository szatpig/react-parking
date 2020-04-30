// Created by szatpig at 2020/4/30.
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { Form, Input, Button, Modal, DatePicker, Select, Table } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;

const columns = [
    {
        title: '券码',
        dataIndex: 'couponNo',
        width: 120,
    },
    {
        title: '车牌号',
        dataIndex: 'plateNo',
    },
    {
        title: '车牌颜色',
        dataIndex: 'plateColor',
    },
    {
        title: '权益等级',
        dataIndex: 'equityLevel',
    },
    {
        title: '权益金额/元',
        dataIndex: 'equityAmount',
    },
    {
        title: '权益停车场',
        dataIndex: 'parkingNames',
    },
    {
        title: '发放时间',
        dataIndex: 'parkingCount',
    },
    {
        title: '截止时间',
        dataIndex: 'parkingCount',
    },
    {
        title: '已使用金额/元',
        dataIndex: 'parkingCount',
    },
    {
        title: '金额/元',
        dataIndex: 'parkingCount',
    },
    {
        title: '最后使用时间',
        dataIndex: 'parkingCount',
    },
    {
        title: '状态',
        dataIndex: 'parkingCount',
    },
];

function White() {
    const [selectedRow, setSelectedRow] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableData,setTableData] = useState<object[]>([])
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [ form ] = Form.useForm();
    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };
    const onFinish = (values:object) => {
        console.log('Received values of form: ', values);
    };


    const onSelectChange = (selectedRowKeys:any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRow(selectedRowKeys);
    };

    const handleBatch = ()=>{
        setShow(true)
    }

    const rowSelection = {
        onChange: onSelectChange,
    };

    const handleSearch = () => {
        let _data:any[] = [{id:1,couponNo:'201030545877'}]
        setTableData(_data)
    }




    useEffect(() => {
        //do something
        handleSearch()
        console.log(form)
    },[1]);

    //modal

    const handleSubmit = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setShow(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setShow(false)
    };


    return (
        <div className="white-container">
            <div className="breadcrumb-container line"> 白名单管理 </div>
            <div className="search-container">
                <div className="input-cells">
                    <Form
                        layout="inline"
                        onValuesChange={ onFormLayoutChange }
                        form = { form }
                        onFinish={ handleSearch }>
                        <Form.Item label="券码" name="couponNo">
                            <Input placeholder="请输入券码" maxLength={ 18 } />
                        </Form.Item>
                        <Form.Item label="车牌号" name="plateNo">
                            <Input placeholder="请输入车牌号" maxLength={ 8 }/>
                        </Form.Item>
                        <Form.Item  label="发放时间" name="equityGrantTime">
                            <RangePicker ranges={{
                                "今天": [moment(), moment()],
                                '近一个月': [moment().startOf('month'), moment().endOf('month')],
                            }} showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                        <Form.Item  label="权益等级" name="equityLevel">
                            <Select
                                    placeholder="请选择"
                                    allowClear>
                                <Option value="male">male</Option>
                                <Option value="female">female</Option>
                                <Option value="other">other</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="状态" name="equityStatus">
                            <Select
                                    placeholder="请选择"
                                    allowClear>
                                <Option value="0">未使用</Option>
                                <Option value="1">使用中</Option>
                                <Option value="2">核销完成</Option>
                                <Option value="3">已过期</Option>
                                <Option value="4">已撤销</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className="search-container export">
                <div className="input-cells">
                    当前有效白名单：{ 100 }个
                    <Button type="primary" onClick={ handleBatch } disabled={ selectedRow.length == 0 } loading={ loading }>
                        撤销权益金
                    </Button>
                </div>
            </div>
            <div className="table-container">
                <Table bordered rowSelection={ rowSelection } columns={ columns } dataSource={ tableData } />
            </div>
            <Modal
                title="撤销原因"
                visible={ show }
                className="common-dialog"
                onOk={ handleSubmit }
                okText={"保存"}
                confirmLoading={ confirmLoading }
                onCancel={ handleCancel }>
                <Form
                    onFinish={ handleSubmit }>
                    <Form.Item name="revokeReason" label="撤销原因" rules={ [
                        { required: true, message: '请输入内容' }
                    ] }>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
                <p className="common-dialog-tips">当前选择{ 5 }笔，余额共计{ 400 }元，撤销后会将未使用金额返回行业用户余额，撤销后不可恢复!</p>
            </Modal>
        </div>
    );
}

export default White
