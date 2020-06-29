// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';

import {Form, Input, Button, Modal, Table,  message, Tree} from 'antd';
import {
    roleList,
    roleAdd,
    roleUpdate,
    roleDelete,
    roleGet,
    getRoleMenu,
    userAdd,
    userUpdate, userDelete, userOff, userReset
} from '@/api/admin/system-api'

import { ExclamationCircleFilled,ExclamationCircleOutlined } from '@ant-design/icons';


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
};


function RoleManage() {
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
    const [confirmLoading, setConfirmLoading] = useState(false);
    //tree
    const [treeData ,setTreeData ] = useState<any[]>([]);


    const [checkedKeys, setCheckedKeys] = useState<number[]>([]);

    const columns = [
        {
            title: '角色名称',
            dataIndex: 'roleName',
            width: 200,
            ellipsis:true,
            fixed:true
        },
        {
            title: '备注',
            dataIndex: 'roleDesc'
        },
        {
            title: '权限',
            dataIndex: 'permission',
            ellipsis:true,
        },
        {
            title: '操作',
            key: 'action',
            className:'tableActionCell',
            width: 245,
            render: (cell:number,row:any) => (
                    <div className="table-button">
                        <Button type="link" onClick={ () =>handleShow(row.id) }>编辑</Button>
                        <Button type="link" onClick={ () =>handleDelete(row) }>删除</Button>
                    </div>
            ),
        },
    ];

    const [ form ] = Form.useForm();
    const [ modalForm ] = Form.useForm();

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const handleDelete = (row:any)=>{
        let _data = {
            id:row.id
        }
        modal.confirm({
            icon:<ExclamationCircleOutlined />,
            title: '删除确认',
            content: `确认要删除角色【${ row.roleName }】吗`,
            onOk: () => {
                roleDelete(_data).then((data:any) => {
                    message.success('删除成功');
                    handleQuery();
                })
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }
    const handleShow =  (id:number) => {
        setShow(true)
        setCheckedKeys([])
        modalForm.resetFields();
        if(id){
            console.log(id)
            roleGet({
                id:id
            }).then((data:any) =>{
                modalForm.setFieldsValue({
                    ...data.data
                })
                setCheckedKeys(data.data.permissionIds)
                setId(id.toString());
            });
        }else{
            setId('');
        }
    };

    //modal
    //----tree
    const onCheck = (checkedKeys:any,e:any) => {
        console.log('onCheck', checkedKeys,e);
        setCheckedKeys(checkedKeys);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setShow(false)
    };
    const handleSubmit = () => {
        setConfirmLoading(true);
        modalForm.validateFields().then((values:any) => {
            let _data ={
                ...values,
                permissionIds:checkedKeys
            }
            if(!!!id){
                roleAdd(_data).then((data:any) => {
                    message.success('保存成功');
                    setShow(false);
                    setConfirmLoading(false);
                    setId('');
                    handleQuery();
                }).catch(() => {
                    setConfirmLoading(false);
                });
            }else{
                roleUpdate({
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


    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
        form.submit();
    };
    const handleSearch = (values:any) => {
        console.log(values)
        list({
            ...values
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
        roleList(_data).then((data:any) => {
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

    const getRoleMenuList = (args?:object) => {
        let _data={
        };
        getRoleMenu(_data).then((data:any) => {
            setTreeData(flat(data.data));
        })
    };

    function flat(args:[]) {
        var pathArr:any[] = []
        args.map((item:any)=>{
            if(item.children&&item.children.length > 0){
                pathArr.push({
                    key:item.id,
                    title:item.title,
                    children:flat(item.children)
                })
            }else{
                pathArr.push({
                    key:item.id,
                    title:item.title
                });
            }
        })
        return pathArr
    }

    useEffect(() => {
        //do something
        list();
        getRoleMenuList();
    },[]);

    return (
            <div className="role-manage-container">
                <div className="breadcrumb-container left-border line">
                    角色管理
                    <span>
                        <Button type="primary" onClick={ () => handleShow(0) }>添加角色</Button>
                    </span>
                </div>
                <div className="search-container">
                    <div className="input-cells">
                        <Form
                                layout="inline"
                                onValuesChange={ onFormLayoutChange }
                                form = { form }
                                onFinish={ handleSearch }>
                            <Form.Item label="角色名称" name="roleName">
                                <Input placeholder="请输入角色名称" maxLength={ 18 } />
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
                        title={ id ? '编辑角色':'添加角色'}
                        visible={ show }
                        className="common-dialog"
                        onOk={ handleSubmit }
                        okText={"确定"}
                        maskClosable={ false }
                        confirmLoading={ confirmLoading }
                        onCancel={ handleCancel }>
                    <Form {...layout} form={ modalForm }>
                        <Form.Item name="roleName" label="角色名称"  rules={[{ required: true,whitespace: true,pattern:/^[a-zA-Z]+[\w]{2,19}$/, message: '请输入以字母开头3-20位，可包含数字、字母、下划线' },]}>
                            <Input maxLength={ 20 } placeholder="请输入以字母开头3-20位，可包含数字、字母、下划线" />
                        </Form.Item>
                        <Form.Item name="roleDesc" label="备注" rules={ [
                            { required: true, whitespace: true, message: '请输入非空内容' }
                        ] }>
                            <Input.TextArea rows={ 3 } maxLength={ 100 } />
                        </Form.Item>
                        <Form.Item name="permissionIds" required label="权限">
                            <Tree
                                    checkable
                                    showLine={ true }
                                    defaultExpandAll={ true }
                                    onCheck={ onCheck }
                                    checkedKeys={ checkedKeys }
                                    treeData={treeData}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                { contextHolder }
            </div>
    );
}

export default RoleManage
