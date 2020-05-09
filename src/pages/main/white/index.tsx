// Created by szatpig at 2020/4/30.
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, message} from 'antd';
import { whiteList, equityConfigList, grantValid, confirmRevokeEquity, revokeEquitySubmit } from '@/api/white-api'
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
        ellipsis:true,
        width: 160,
        fixed:true
    },
    {
        title: '车牌号',
        dataIndex: 'plateNo',
        width: 100
    },
    {
        title: '车牌颜色',
        dataIndex: 'plateColor',
        width: 120,
        render:(cell:number) => (
             <span>{ colorList[cell] }</span>
        )
    },
    {
        title: '权益等级',
        width: 120,
        dataIndex: 'equityLevel',
    },
    {
        title: '权益金额/元',
        dataIndex: 'equityAmount',
        ellipsis:true,
        width:120,
    },
    {
        title: '权益停车场',
        dataIndex: 'parkingNames',
        ellipsis:true,
        width:120,
    },
    {
        title: '发放时间',
        ellipsis:true,
        width:160,
        dataIndex: 'equityGrantTime',
    },
    {
        title: '截止时间',
        ellipsis:true,
        width:160,
        dataIndex: 'expirationTime',
    },
    {
        title: '已使用金额/元',
        dataIndex: 'equityUsed',
    },
    {
        title: '余额/元',
        dataIndex: 'equityAmount',
    },
    {
        title: '最后使用时间',
        ellipsis:true,
        width:160,
        dataIndex: 'lastUsageTime',
    },
    {
        title: '状态',
        dataIndex: 'equityStatus',
        render: (cell:number) => (
            <Tag color={ equityStatusList[cell].color }>{ equityStatusList[cell].label }</Tag>
        )
    },
];

function White() {
    const [loading, setLoading] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [equityList, setEquityList] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });
    const [show, setShow] = useState(false);
    const [revokeEquity, setRevokeEquity] = useState({
        selectLine:0,
        totalBalance:0
    });
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [ form ] = Form.useForm();
    const [ modalForm ] = Form.useForm();

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const onSelectChange = (selectedRowKeys:any,selectedRow:any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys,selectedRow);
        console.log('selectedRowKeys changed: ', selectedRowKeys,selectedRow);
        setSelectedRow(selectedRow);
    };

    const handleBatch = ()=>{
        let _data = {
            ids:selectedRow.map((item:any) => item.id)
        }
        confirmRevokeEquity(_data).then((data:any) => {
            setRevokeEquity(data.data);
            setShow(true);
            modalForm.resetFields();
        })
    }

    const rowSelection = {
        onChange: onSelectChange,
    };

    //modal
    const handleSubmit = () => {
        setConfirmLoading(true);
        modalForm.validateFields().then((values:any) => {
            let _data ={
                ids:selectedRow.map((item:any) => item.id),
                ...values
            }
            revokeEquitySubmit(_data).then((data:any) => {
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
        setLoading(true)
        whiteList(_data).then((data:any) => {
            setTableData(data.data.customerEquityList.list);
            setPage({
                ...page,
                total:data.data.customerEquityList.total
            })
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    };

    const getEquityList = () => {
        let _data ={}
        equityConfigList(_data).then((data:any) => {
            setEquityList(data.data.map((item:any) => ({
                value:item.id,
                label:item.equityLevel
            })))
        })
    }

    const getGrantValid = () => {
        let _data ={}
        grantValid(_data).then((data:any) => {
            setButtonDisabled(data.data);
        }).catch(err => {
            setButtonDisabled(false);
        })
    }

    useEffect(() => {
        list();
        getEquityList();
        getGrantValid();
    },[]);

    return (
        <div className="white-container">
            <div className="breadcrumb-container left-border line">
                白名单管理
                <span>
                    <Button type="link" href={'/home/white/class'}>权益等级管理</Button>
                    <Button disabled={ !!!buttonDisabled } type="primary" href={'/home/white/equity/single'}>发放权益金</Button>
                    <Button type="primary" href={'/home/white/equity/batch'}>批量导入权益</Button>
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
                        <Form.Item  label="权益等级" name="equityLevel">
                            <Select
                                    placeholder="请选择"
                                    allowClear>
                                {
                                    equityList.map((item:any) => {
                                      return  <Option value={item.value} key={ item.value }>{item.label}</Option>
                                    })
                                }
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
                    当前有效白名单：{ selectedRow.length }&nbsp;&nbsp;个
                    <Button type="primary" onClick={ handleBatch } disabled={ selectedRow.length === 0 }>
                        撤销权益金
                    </Button>
                </div>
            </div>
            <div className="table-container">
                <Table
                        rowKey="id"
                        bordered
                        rowSelection={ rowSelection }
                        columns={ columns }
                        loading={ loading }
                        dataSource={ tableData }
                        scroll={{ x: 1500 }}
                        pagination={{ onChange:pagesChange,...page }} />
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
                    form={ modalForm }>
                    <Form.Item name="revokeReason" label="撤销原因" rules={ [
                        { required: true, message: '请输入内容' }
                    ] }>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
                <p className="common-dialog-tips">当前选择{ revokeEquity.selectLine }笔，余额共计{ revokeEquity.totalBalance }元，撤销后会将未使用金额返回行业用户余额，撤销后不可恢复!</p>
            </Modal>
        </div>
    );
}

export default White
