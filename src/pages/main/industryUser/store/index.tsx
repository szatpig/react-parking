// Created by szatpig at 2020/6/17.
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import { Form, Input, Button,  Table, Tag, Cascader, Popconfirm } from 'antd';
import { commercialUserList, commercialUserOff, commercialUserDelete, commercialUserReset } from '@/api/industryUser/store-api'

import region from '@/json/region'
const options = region;

const equityStatusList:any = {
    0:{
        label:'正常',
        color:'blue',
    },
    1:{
        label:'禁用',
        color:'gold',
    },
    2:{
        label:'锁定',
        color:'default',
    }
}


function Store() {
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
            dataIndex: 'name',
            ellipsis:true,
            width: 160,
            fixed:true
        },
        {
            title: '商户账号名',
            dataIndex: 'username',
            ellipsis:true,
            width: 120
        },
        {
            title: '商户地址',
            dataIndex: 'address',
            ellipsis:true
        },
        {
            title: '联系人',
            dataIndex: 'contact',
            ellipsis:true
        },
        {
            title: '开具发票',
            dataIndex: 'invoiced',
            ellipsis:true,
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
            width: 245,
            render: (cell:number,row:any) => (
                    <div className="table-button">
                        <Popconfirm
                                title="确定禁用该用户账号吗"
                                onConfirm={ () => handleOff(row) }
                                okText="确定"
                                cancelText="取消"
                        >
                            <Button type="link">禁用</Button>
                        </Popconfirm>
                        <Button type="link" onClick={ () =>handleLink(row) }>编辑</Button>
                        <Button type="link" onClick={ () =>handleDelete(row) }>删除</Button>
                        <Button type="link" onClick={ () =>handleReset(row) }>重置密码</Button>
                    </div>
            ),
        },
    ];

    const [ form ] = Form.useForm();

    const history = useHistory();

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };


    const handleOff = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        commercialUserOff(_data).then((data:any) => {

        })
    }

    const handleDelete = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        commercialUserDelete(_data).then((data:any) => {

        })
    }

    const handleReset = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        commercialUserReset(_data).then((data:any) => {

        })
    }

    const handleLink = (id:number) => {
        history.push('/home/store/detail?id='+id);
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
    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
        setSelectedRow([]);
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
        commercialUserList(_data).then((data:any) => {
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
            <div className="store-container">
                <div className="breadcrumb-container left-border line">
                商户管理
                    <span>
                        <Button type="primary" onClick={ () => handleLink(0) }>添加商户</Button>
                    </span>
                </div>
                <div className="search-container">
                    <div className="input-cells">
                        <Form
                                layout="inline"
                                onValuesChange={ onFormLayoutChange }
                                form = { form }
                                onFinish={ handleSearch }>
                            <Form.Item label="商户名称" name="name">
                                <Input placeholder="请输入商户名称" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="账号名" name="username">
                                <Input placeholder="请输入账号名" maxLength={ 8 }/>
                            </Form.Item>
                            <Form.Item label="省市区" name="region">
                                <Cascader options={ options } placeholder="请选择省市区" />
                            </Form.Item>
                            <Form.Item  label="详细地址" name="address">
                                <Input placeholder="请输入详细地址" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="联系人" name="contact">
                                <Input placeholder="请输入联系人" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="联系电话" name="phone">
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

export default Store
