// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

import {Form, Input, Button, Modal, Select, Table, Tag, Radio, message, Popconfirm} from 'antd';
import { userList, userDelete, userAdd, userUpdate, userOff, userReset, userGetRoleList } from '@/api/admin/system-api'

import { ExclamationCircleFilled } from '@ant-design/icons';
import Dayjs from 'dayjs';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

const { Option } = Select;

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
function UserManage() {
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });
    const [show, setShow] = useState(false);
    const [id,setId] = useState('');
    const [roleList,setRoleList] = useState([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
        {
            title: '账号',
            dataIndex: 'userName',
            width: 200,
            ellipsis:true,
            fixed:true
        },
        {
            title: '姓名',
            dataIndex: 'name'
        },
        {
            title: '性别',
            dataIndex: 'sax',
            width: 120
        },
        {
            title: '联系电话',
            dataIndex: 'phone'
        },
        {
            title: '角色',
            dataIndex: 'roleName'
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 140,
            render: (cell:number,row:any) => ( //状态(0：正常；1：禁用；2：锁定；)
                    cell === 4 ?
                        <Tag color={ equityStatusList[cell].color }>{ equityStatusList[cell].label }</Tag> :
                        <Tag color={ equityStatusList[cell].color }>{ equityStatusList[cell].label }</Tag>
            )
        },
        {
            title: '操作',
            key: 'action',
            className:'tableActionCell',
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
                        <Button type="link" onClick={ () =>handleShow(row) }>编辑</Button>
                        <Button type="link" onClick={ () =>handleDelete(row) }>删除</Button>
                        <Button type="link" onClick={ () =>handleReset(row) }>重置密码</Button>
                    </div>
            ),
        },

    ];

    const [ form ] = Form.useForm();
    const [ modalForm ] = Form.useForm();

    const history = useHistory()

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const handleOff = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        userOff(_data).then((data:any) => {

        })
    }
    const handleDelete = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        userDelete(_data).then((data:any) => {

        })
    }
    const handleReset = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        userReset(_data).then((data:any) => {

        })
    }



    //modal
    const handleShow =  (id:number) => {
        setShow(true)
        if(id){
            setId(id.toString());
        }else{
            setId('');
        }
        form.resetFields()
    };
    const handleSubmit = () => {
        setConfirmLoading(true);
        modalForm.validateFields().then((values:any) => {
            let _data ={
                ...values
            }
            if(!!!id){
                userAdd(_data).then((data:any) => {
                    message.success('保存成功');
                    setShow(false);
                    setConfirmLoading(false);
                    form.submit();
                })
            }else{
                userUpdate({
                    id,
                    _data
                }).then((data:any) => {
                    message.success('编辑成功');
                    setShow(false);
                    setConfirmLoading(false);
                    form.submit();
                })
            }

        }).catch(info => {
            setConfirmLoading(false);
            console.log('Validate Failed:', info);
        });
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setShow(false)
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
        console.log(values)
        let { couponNo,plateNo,couponStatus,equityGrantTime } = values,
                [startTime,endTime] = equityGrantTime || [];

        list({
            couponNo,plateNo,couponStatus,
            startTime:startTime && Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime:endTime && Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
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
        let { current,pageSize } = page
        let _data={
            pageNum:current,
            pageSize,
            ...args
        };
        setLoading(true)
        userList(_data).then((data:any) => {
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
    const getRolelist = (args?:object) => {
        let _data ={

        }
        userList(_data).then((data:any) => {
            setRoleList(data.data.list)
        })
    };
    useEffect(() => {
        //do something
        list();
    },[]);


    return (
            <div className="user-manage-container">
                <div className="breadcrumb-container left-border line">
                    用户管理
                    <span>
                        <Button type="primary" onClick={ () => handleShow(0) }>添加用户</Button>
                    </span>
                </div>
                <div className="search-container">
                    <div className="input-cells">
                        <Form
                                layout="inline"
                                onValuesChange={ onFormLayoutChange }
                                form = { form }
                                onFinish={ handleSearch }>
                            <Form.Item label="账号/姓名" name="name">
                                <Input placeholder="请输入账号/姓名" maxLength={ 18 } />
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
                            pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,showSizeChanger:true,...page, showTotal: showTotal }}/>
                </div>
                <Modal
                        title={ id ? '编辑用户':'添加用户'}
                        visible={ show }
                        className="common-dialog"
                        onOk={ handleSubmit }
                        maskClosable={ false }
                        confirmLoading={ confirmLoading }
                        onCancel={ handleCancel }>
                    <Form {...layout} form={ modalForm } initialValues={{
                        sax:0
                    }}>
                        <Form.Item name="userName" label="账号"  rules={[{ required: true,whitespace: true }]}>
                            <Input maxLength={ 20 } disabled={ !!id } placeholder="请输入账号" />
                        </Form.Item>
                        <Form.Item name="name" label="姓名"  rules={[{ required: true,whitespace: true }]}>
                            <Input maxLength={ 20 } placeholder="请输入姓名" />
                        </Form.Item>
                        <Form.Item name="sax" required label="性别">
                            <Radio.Group>
                                <Radio value={ 0 }>男</Radio>
                                <Radio value={ 1 }>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="phone" label="联系方式" rules={[
                            { required: true,whitespace: true },
                            { pattern: /^(((\d{2}-)?0\d{2,3}-?\d{7,8})|((\d{2}-)?(\d{2,3}-)?([1][3-9][0-9]\d{8})))$/g}
                        ]}>
                            <Input maxLength={ 15 } placeholder="请输入联系方式" />
                        </Form.Item>
                        <Form.Item label="角色" name="roleId" rules={[
                            { required: true,whitespace: true,message:"请选择角色" }
                        ]}>
                            <Select
                                    placeholder="请选择角色"
                                    allowClear>
                                {
                                    roleList.map((item:any) => (
                                            <Option key={ item.id } value={ item.id }>{ item.roleName }</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
    );
}

export default UserManage
