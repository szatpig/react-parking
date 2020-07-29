// Created by szatpig at 2020/6/17.
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";

import {Form, Input, Button, Table, Tag, Cascader, Popconfirm, message, Modal} from 'antd';
import { ExclamationCircleFilled,ExclamationCircleOutlined } from '@ant-design/icons';
import { commercialUserList, commercialUserOff, commercialUserDelete, commercialUserReset } from '@/api/industryUser/store-api'

import region from '@/json/region'
const options = region;

const statusList:any = {
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
    const [modal, contextHolder] = Modal.useModal();
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
            dataIndex: 'completeAddress',
            ellipsis:true
        },
        {
            title: '联系人',
            dataIndex: 'contact',
            ellipsis:true
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            ellipsis:true
        },
        {
            title: '开具发票',
            dataIndex: 'invoiced',
            ellipsis:true,
            render: (cell:number,row:any) => (
                    cell === 1 ? '是' : '否'
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 140,
            render: (cell:number,row:any) => {
                let _index = cell == null ? 0 : cell
                return <Tag color={ statusList[_index].color }>{ statusList[_index].label }</Tag>
            }
        },
        {
            title: '操作',
            key: 'action',
            className:'tableActionCell',
            width: 245,
            render: (cell:number,row:any) => (
                    <div className="table-button">
                        <Popconfirm
                                title={`确定${ row.status == 0 ? '禁用': row.status == 1 ? '启用' : '解锁' }该用户账号吗`}
                                onConfirm={ () => handleOff(row) }
                                okText="确定"
                                cancelText="取消"
                        >
                            <Button type="link">{ row.status == 0 ? '禁用': row.status == 1 ? '启用' : '解锁' }</Button>
                        </Popconfirm>
                        <Button type="link" onClick={ () =>handleLink(row.id) }>编辑</Button>
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
            id:row.loginUserId,
            status:row.status == 0 ? 1: row.status == 1 ? 0 : 2
        }
        commercialUserOff(_data).then((data:any) => {
            message.success(`${ row.status == 0 ? '禁用': row.status == 1 ? '启用' : '解锁' }成功`);
            handleQuery();
        })
    }

    const handleDelete = (row:any)=>{
        let _data = {
            id:row.id
        }
        modal.confirm({
            icon:<ExclamationCircleOutlined />,
            title: '删除确认',
            content: `确认要删除商户【${ row.name }】吗`,
            onOk: () => {
                commercialUserDelete(_data).then((data:any) => {
                    message.success('删除成功');
                    handleQuery();
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const handleReset = (row:any)=>{
        let _data = {
            id:row.loginUserId
        }
        modal.confirm({
            title: '重置密码确认',
            content: `确认要重置商户【${ row.name }】密码吗`,
            onOk: () => {
                commercialUserReset(_data).then((data:any) => {
                    message.success('重置成功');
                    modal.success({
                        title: '用户密码已重置',
                        className:'import-dialog-container',
                        content: (
                                <div className="import-dialog-wrapper password-dialog-wrapper">
                                    <div className="import-cell">
                                        <p>请使用下方账号和默认密码登录系统</p>
                                        <div className="import-content">
                                            <p><span>登录地址：</span> <a target="_blank" href={ data.data.loginUserAddress + '?tab=relogin' }>{ data.data.loginUserAddress }</a></p>
                                            <p><span>用户账号：</span>{ data.data.userName }</p>
                                            <p><span>默认密码：</span>{ data.data.password }</p>
                                        </div>
                                    </div>
                                </div>
                        ),
                        onOk: () => {

                        },
                        onCancel() {
                            console.log('Cancel');
                        },
                    });
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    const handleLink = (id:number) => {
        history.push('/home/store/detail/'+id);
    };

    const handleSearch = (values:any) => {
        console.log(page)
        let { region, ...others } = values,
             [province, city, area]= region || [];

        list({
            province, city, area,
            ...others
        })
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
            setTableData(data.data.list);
            setPage({
                ...page,
                total:data.data.total
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
                                <Input placeholder="请输入联系电话" maxLength={ 15 }/>
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
                            pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,showSizeChanger:true,...page, showTotal: showTotal }} />
                </div>
                { contextHolder }
            </div>
    );
}

export default Store
