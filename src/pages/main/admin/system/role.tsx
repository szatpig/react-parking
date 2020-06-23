// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

import moment from 'moment';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, Radio, message, Tree, InputNumber, Popconfirm} from 'antd';
import { couponList, confirmRevokeCoupon, verifyRevokeAvailable, revokeCouponBatch } from '@/api/industryUser/coupon-api'

import { ExclamationCircleFilled } from '@ant-design/icons';

import {validRevokeAvailable} from "@/api/industryUser/white-api";


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
};


function RoleManage() {
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
    const [confirmLoading, setConfirmLoading] = useState(false);
    //tree
    const [treeData ,setTreeData ] = useState([
        {
            key:1,
            title:'销售管理'
        },{
            key:2,
            title:'销售记录'
        },
        {
            key:3,
            title:'商家管理'
        },
        {
            key:4,
            title:'人工核销'
        },
        {
            key:5,
            title:'系统管理',
            children:[
                {
                    key:6,
                    title:'用户管理'
                },
                {
                    key:7,
                    title:'角色管理'
                },
                {
                    key:8,
                    title:'企业账户'
                },
            ]
        }
    ]);


    const [checkedKeys, setCheckedKeys] = useState<number[]>([]);

    const columns = [
        {
            title: '角色名称',
            dataIndex: 'couponNo',
            width: 200,
            ellipsis:true,
            fixed:true
        },
        {
            title: '备注',
            dataIndex: 'plateNo'
        },
        {
            title: '权限',
            dataIndex: 'plateColor',
            ellipsis:true,
        },
        {
            title: '操作',
            key: 'action',
            className:'tableActionCell',
            width: 245,
            render: (cell:number,row:any) => (
                    <div className="table-button">
                        <Button type="link" onClick={ () =>handleLink(row) }>编辑</Button>
                        <Button type="link" onClick={ () =>handleDelete(row) }>删除</Button>
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

    const handleLink = (id:number)=>{
        history.push('sale/detail?id='+id)
    }
    const handleDelete = (row:any)=>{
        let _data = {
            ids:selectedRow
        }
        validRevokeAvailable(_data).then(data => {

        })
    }
    const handleShow =  (id:number) => {
        setShow(true)
        if(id){
            setId(id.toString());
        }else{
            setId('');
        }
        modalForm.setFieldsValue({
            authority:[7]
        })

        form.resetFields()
    };


    //modal
    //tree

    const onCheck = (checkedKeys:any) => {
        console.log('onCheck', checkedKeys);
        setCheckedKeys(checkedKeys);
    };


    const handleSubmit = () => {
        setConfirmLoading(true);
        modalForm.validateFields().then((values:any) => {
            let _data ={
                ids:selectedRow,
                ...values
            }
            revokeCouponBatch(_data).then((data:any) => {
                message.success('批量处理成功');
                setShow(false);
                setConfirmLoading(false);
                form.submit();
            })
        }).catch(info => {
            setConfirmLoading(false);
            console.log('Validate Failed:', info);
        });
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setShow(false)
    };

    const handleSearch = (values:any) => {
        console.log(values)
        let { couponNo,plateNo,couponStatus,equityGrantTime } = values,
                [startTime,endTime] = equityGrantTime || [];

        list({
            couponNo,plateNo,couponStatus
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
        let { current,pageSize } = page
        let _data={
            pageNum:current,
            pageSize,
            ...args
        };
        setLoading(true)
        couponList(_data).then((data:any) => {
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
        //do something
        list();
    },[1]);

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
                            <Form.Item label="角色名称" name="couponNo">
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
                            onRow={ (row:any) => {
                                return {
                                    onClick: event => {
                                        handleLink(row.id)
                                    }, // 点击行
                                };
                            }}
                            rowKey="id"
                            bordered
                            columns={ columns }
                            loading={ loading }
                            dataSource={ tableData }
                            pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,showSizeChanger:true,...page, showTotal: showTotal }}/>
                </div>
                <Modal
                        title={ id ? '编辑折扣':'添加折扣'}
                        visible={ show }
                        className="common-dialog"
                        onOk={ handleSubmit }
                        okText={"确定"}
                        maskClosable={ false }
                        confirmLoading={ confirmLoading }
                        onCancel={ handleCancel }>
                    <Form {...layout} form={ modalForm }>
                        <Form.Item name="plateNo" label="角色名称"  rules={[{ required: true,whitespace: true,pattern:/^[a-zA-Z]+[\w]{2,19}$/, message: '请输入以字母开头3-20位，可包含数字、字母、下划线' },]}>
                            <Input maxLength={ 20 } disabled={ !!id } placeholder="请输入以字母开头3-20位，可包含数字、字母、下划线" />
                        </Form.Item>
                        <Form.Item name="remark" label="备注" rules={ [
                            { required: true, message: '请输入非空内容' }
                        ] }>
                            <Input.TextArea rows={ 3 } maxLength={ 100 } />
                        </Form.Item>
                        <Form.Item name="authority" required label="权限" valuePropName="checkedKeys">
                            <Tree
                                    checkable
                                    checkStrictly={true}
                                    defaultExpandAll={ true }
                                    onCheck={ onCheck }
                                    checkedKeys={ checkedKeys }
                                    treeData={treeData}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
    );
}

export default RoleManage
