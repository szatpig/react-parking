// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';

import { Form, Input, Button, Modal, Select, Table, Tag, Radio, message, Popconfirm } from 'antd';
import {
    userList,
    userDelete,
    userAdd,
    userUpdate,
    userOff,
    userReset,
    userGetRoleList
} from '@/api/admin/system-api'

import { ExclamationCircleFilled } from '@ant-design/icons';

const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 17 },
};

const { Option } = Select;

const statusList:any = {
    0:{
        label:'正常',
        color:'green',
    },
    1:{
        label:'禁用',
        color:'warning',
    },
    2:{
        label:'锁定',
        color:'default',
    }
}
function UserManage() {
    const [loading, setLoading] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
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
            width: 120,
            render: (cell:number,row:any) => ( //(0：男；1：女)
                    <span> { cell === 1 ? '女' : '男'  } </span>
            )
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
                    <Tag color={ statusList[cell].color }>{ statusList[cell].label }</Tag>
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
                                title={`确定${ row.status == 0 ? '禁用': row.status == 1 ? '启用' : '解锁' }该用户账号吗`}
                                onConfirm={ () => handleOff(row) }
                                okText="确定"
                                cancelText="取消"
                        >
                            <Button type="link">{ row.status == 0 ? '禁用': row.status == 1 ? '启用' : '解锁' }</Button>
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

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const handleOff = (row:any)=>{
        let _data = {
            id:row.id,
            status:row.status == 0 ? '1': row.status == 1 ? '0' : '2'
        }
        userOff(_data).then((data:any) => {
            message.success(`${ row.status == 0 ? '禁用': row.status == 1 ? '启用' : '解锁' }成功`);
            handleQuery();
        })
    }
    const handleDelete = (row:any)=>{
        let _data = {
            id:row.id
        }
        modal.confirm({
            title: '删除确认',
            content: `确认要删除用户【${ row.userName }】吗`,
            onOk: () => {
                userDelete(_data).then((data:any) => {
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
            id:row.id
        }
        modal.confirm({
            title: '重置密码确认',
            content: `确认要重置用户【${ row.userName }】密码吗`,
            onOk: () => {
                userReset(_data).then((data:any) => {
                    message.success('重置成功');
                    modal.success({
                        title: '用户密码已重置',
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



    //modal
    const handleShow =  (row:any) => {
        setShow(true)
        modalForm.resetFields();
        if(!!row){
            modalForm.setFieldsValue({
                ...row
            })
            setId(row.id.toString());
        }else{
            setId('');
        }
    };
    const handleSubmit = () => {
        setConfirmLoading(true);
        modalForm.validateFields().then((values:any) => {
            let _data ={
                ...values
            }
            if(!!!id){
                userAdd(_data).then((data:any) => {
                    setShow(false);
                    setConfirmLoading(false);
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

                        },
                        onCancel() {
                            console.log('Cancel');
                        },
                    });
                    handleQuery();
                }).catch(() => {
                    setConfirmLoading(false);
                });
            }else{
                userUpdate({
                    id,
                    ..._data
                }).then((data:any) => {
                    message.success('编辑成功');
                    setShow(false);
                    setConfirmLoading(false);
                    setId('');
                    handleQuery();
                }).catch(() => {
                    setConfirmLoading(false);
                });
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
        form.submit();
    };
    const handleSearch = (values:any) => {
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
    const getRoleList = (args?:object) => {
        let _data ={

        }
        userGetRoleList(_data).then((data:any) => {
            setRoleList(data.data)
        })
    };
    useEffect(() => {
        //do something
        list();
        getRoleList();
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
                        <Form.Item name="userName" label="账号"  rules={[
                            { required: true,whitespace: true , pattern:/^[a-zA-Z]+[\w]{2,19}$/, message: '请输入以字母开头3-20位，可包含数字、字母、下划线' }
                        ]}>
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
                            { pattern: /^(((\d{2}-)?0\d{2,3}-?\d{7,8})|((\d{2}-)?(\d{2,3}-)?([1][3-9][0-9]\d{8})))$/g,message:'请输入合法联系方式'}
                        ]}>
                            <Input maxLength={ 15 } placeholder="请输入联系方式" />
                        </Form.Item>
                        <Form.Item label="角色" name="roleId" rules={[
                            { required: true,whitespace: true, type:'number',message:"请选择角色" }
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
                { contextHolder }
            </div>
    );
}

export default UserManage
