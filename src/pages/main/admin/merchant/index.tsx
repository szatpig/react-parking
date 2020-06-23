// Created by szatpig at 2020/6/16.
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import {Form, Input, Button, Modal, Table, Tag, Popover, message, Cascader, Popconfirm} from 'antd';
import { whiteList, equityConfigList, grantValid, getRevocable, confirmRevokeEquity, revokeEquitySubmit, validRevokeAvailable } from '@/api/industryUser/white-api'

import region from '@/json/region'
const options = region;

const equityStatusList:any = {
    0:{
        label:'未使用',
        color:'blue',
    },
    1:{
        label:'已领取',
        color:'green',
    },
    2:{
        label:'核销完成',
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


function MerchantManage() {
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });

    const columns = [
        {
            title: '商户名称',
            dataIndex: 'couponNo',
            ellipsis:true,
            width: 160,
            fixed:true
        },
        {
            title: '商户账号名',
            dataIndex: 'plateNo',
            ellipsis:true,
            width: 120
        },
        {
            title: '商户地址',
            dataIndex: 'plateNo',
            ellipsis:true
        },
        {
            title: '联系人',
            dataIndex: 'plateNo',
            ellipsis:true
        },
        {
            title: '联系电话',
            dataIndex: 'plateNo',
            width: 120
        },
        {
            title: '状态',
            dataIndex: 'equityStatus',
            width: 140,
            render: (cell:number,row:any) => (
                    cell === 4 ?
                            <Tag color={ equityStatusList[cell].color }>{ equityStatusList[cell].label }</Tag> :
                            <Tag color={ equityStatusList[cell].color }>{ equityStatusList[cell].label }</Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            className:'tableActionCell',
            width: 325,
            render: (cell:number,row:any) => (
                    <div className="table-button">
                        <Popconfirm
                                title="确定禁用该用户账号吗"
                                onConfirm={ () => handleDisabled(row) }
                                okText="确定"
                                cancelText="取消"
                        >
                            <Button type="link">禁用</Button>
                        </Popconfirm>
                        <Button type="link" onClick={ () =>handleLink(row) }>编辑</Button>
                        <Button type="link" onClick={ () =>handleDelete(row) }>删除</Button>
                        <Button type="link" onClick={ () =>handleReset(row) }>重置密码</Button>
                        <Button type="link" onClick={ () =>handleSale(row) }>销售折扣</Button>
                    </div>
            ),
        },
    ];

    const [ form ] = Form.useForm();

    const history = useHistory();

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const handleDisabled = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        validRevokeAvailable(_data).then(data => {

        })
    }
    const handleDelete = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        validRevokeAvailable(_data).then(data => {

        })
    }
    const handleReset = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        validRevokeAvailable(_data).then(data => {

        })
    }
    const handleSale =  (row:any) => {
        history.push('merchant/sale?merchantUserId='+ row.id);
    };
    const handleLink = (id:number) => {
        history.push('merchant/detail?id='+id);
    };

    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
        setSelectedRow([]);
        form.submit();
    };
    const handleSearch = (values:any) => {
        console.log(page)
        let { couponNo,plateNo,couponStatus,equityLevel,equityGrantTime,equityStatus } = values,
                [startTime,endTime] = equityGrantTime || [];

        list({
            couponNo,
            plateNo,
            couponStatus,
            equityConfigId:equityLevel,
            equityStatus,
            current:1
        })
    }
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
    const showTotal = (total:number) => {
        return `总共 ${total} 条`
    }
    const list = (args?:object) => {
        let { current,pageSize } = page;
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

    useEffect(() => {
        list();
    },[]);

    return (
            <div className="merchant-manage-container">
                <div className="breadcrumb-container left-border line">
                    商户管理
                    <span>
                        <Button type="primary" onClick={ () => handleLink(0) }>添加商家</Button>
                    </span>
                </div>
                <div className="search-container">
                    <div className="input-cells">
                        <Form
                                layout="inline"
                                onValuesChange={ onFormLayoutChange }
                                form = { form }
                                onFinish={ handleSearch }>
                            <Form.Item label="商户名称" name="couponNo">
                                <Input placeholder="请输入商户名称" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="账号名" name="plateNo">
                                <Input placeholder="请输入账号名" maxLength={ 8 }/>
                            </Form.Item>
                            <Form.Item label="省市区" name="region">
                                <Cascader options={ options } placeholder="请选择省市区" />
                            </Form.Item>
                            <Form.Item  label="详细地址" name="address">
                                <Input placeholder="请输入详细地址" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="联系人" name="couponNo">
                                <Input placeholder="请输入联系人" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="联系电话" name="plateNo">
                                <Input placeholder="请输入联系电话" maxLength={ 8 }/>
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
                            loading={ loading }
                            dataSource={ tableData }
                            pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,...page, showTotal: showTotal }} />
                </div>
            </div>
    );
}

export default MerchantManage
