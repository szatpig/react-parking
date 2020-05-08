// Created by szatpig at 2020/4/30.
import React, {useState, useEffect} from 'react';
import moment from 'moment';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, message, Checkbox} from 'antd';
import { couponList, verifyRevokeAvailable, revokeCouponBatch } from '@/api/coupon-api'
import {whiteList} from "@/api/white-api";
const { RangePicker } = DatePicker;
const { Option } = Select;

const equityStatusList:any = {
    0:{
        label:'已发放',
        color:'blue',
    },
    1:{
        label:'已领取',
        color:'green',
    },
    2:{
        label:'已核销',
        color:'default',
    },
    3:{
        label:'已过期',
        color:'default',
    },
    4:{
        label:'已撤销',
        color:'default',
    }
}

const colorList:any = ['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色']

const columns = [
    {
        title: '券码',
        dataIndex: 'couponNo',
        key:'couponNo',
        width: 120,
    },
    {
        title: '车牌号',
        dataIndex: 'plateNo',
        key:'plateNo',
    },
    {
        title: '车牌颜色',
        dataIndex: 'plateColor',
        key:'plateColor',
    },
    {
        title: '权益等级',
        dataIndex: 'equityLevel',
        key:'equityLevel',
    },
    {
        title: '权益金额/元',
        dataIndex: 'equityAmount',
        key:'equityAmount',
    },
    {
        title: '权益停车场',
        dataIndex: 'parkingNames',
        key:'parkingNames',
    },
    {
        title: '发放时间',
        dataIndex: 'equityGrantTime',
        key:'equityGrantTime',
    },
    {
        title: '截止时间',
        dataIndex: 'expirationTime',
        key:'expirationTime',
    },
    {
        title: '已使用金额/元',
        dataIndex: 'equityUsed',
        key:'equityUsed',
    },
    {
        title: '金额/元',
        dataIndex: 'equityAmount',
        key:'equityAmount',
    },
    {
        title: '最后使用时间',
        dataIndex: 'lastUsageTime',
        key:'lastUsageTime',
    },
    {
        title: '状态',
        dataIndex: 'equityStatus',
        key:'equityStatus',
    },
];

function Coupon() {
    const [selectedRow, setSelectedRow] = useState([]);
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:30,
        total:0
    });
    const [show, setShow] = useState(false);
    const [revokeEquity, setRevokeEquity] = useState({
        revokeHit:''
    });
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [ form ] = Form.useForm();
    const [ modalForm ] = Form.useForm();

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const onSelectChange = (selectedRowKeys:any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRow(selectedRowKeys);
    };

    const handleBatch = ()=>{
        let _data = {
            ids:selectedRow.map((item:any) => item.id)
        }
        verifyRevokeAvailable(_data).then((data:any) => {
            setRevokeEquity(data.data);
            setShow(true);
            modalForm.resetFields();
        })
    }

    const rowSelection = {
        onChange: onSelectChange,
    };

    const checkboxChange = (e:any) => {
        console.log(`checked = ${e.target.checked}`);
    }

    //modal
    const handleSubmit = () => {
        setConfirmLoading(true);
        modalForm.validateFields().then((values:any) => {
            let _data ={
                ids:selectedRow.map((item:any) => item.id),
                ...values
            }
            revokeCouponBatch(_data).then((data:any) => {
                message.success('批量处理成功')
            })
        }).catch(info => {
            setConfirmLoading(false);
            console.log('Validate Failed:', info);
        });
        setTimeout(() => {
            setShow(false);
            setConfirmLoading(false);
        }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setShow(false)
    };

    const handleSearch = (values:object) => {
        console.log(values)
        list(values)
    }

    const pagesChange = (current:number,pageSize:any) => {
        setPage({
            ...page,
            current,
            pageSize
        });
        form.submit();
    };

    const list = (args?:object) => {
        let { current,pageSize } = page
        let _data={
            pageNum:current,
            pageSize,
            ...args
        };
        couponList(_data).then((data:any) => {
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
    },[1]);


    return (
        <div className="coupon-container">
            <div className="breadcrumb-container left-border line">
                停车券管理
                <span>
                    <Button type="primary" href={'/home/coupon/equity/single'}>发放停车券</Button>
                    <Button type="primary" href={'/home/coupon/equity/batch'}>批量导入停车券</Button>
                </span>
            </div>
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
                    <Checkbox onChange={ checkboxChange }>全选</Checkbox> 已选中 { selectedRow.length } 条
                    <Button type="primary" onClick={ handleBatch } disabled={ selectedRow.length == 0 }>
                        撤销停车券
                    </Button>
                </div>
            </div>
            <div className="table-container">
                <Table
                        rowKey="id"
                        bordered
                        rowSelection={ rowSelection }
                        columns={ columns }
                        dataSource={ tableData }
                        pagination={{ onChange:pagesChange,...page }}/>
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
                <p className="common-dialog-tips">{ revokeEquity.revokeHit }</p>
            </Modal>
        </div>
    );
}

export default Coupon
