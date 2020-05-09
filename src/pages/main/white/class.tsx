// Created by szatpig at 2020/5/6.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { LeftOutlined, UploadOutlined } from '@ant-design/icons';


import { Form, Input, Button, Modal, InputNumber, Table, Popconfirm, message  } from 'antd';
import { equityConfigList, equityConfigAdd, equityConfigUpdate, equityConfigDelete } from "@/api/white-api";


const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
};

function EquityClass() {

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [tableData,setTableData] = useState<object[]>([]);
    const [page,setPage] = useState<object>({
        pageNum:1,
        pageSize:30,
        total:1
    });
    const [show, setShow] = useState(false);
    const [id,setId] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const columns = [
        {
            title: '权益等级名称',
            dataIndex: 'equityLevel',
            width: 180,
        },
        {
            title: '权益金额/元',
            dataIndex: 'equityAmount'
        },
        {
            title: '描述',
            dataIndex: 'remark'
        },
        {
            title: '操作',
            className:'tableActionCell',
            dataIndex: 'operation',
            render: (val:string, row:object) =>
                    tableData.length >= 1 ? (
                            <span>
                                <a onClick={ ()=> handleEdit(row) }>编辑</a>
                                <Popconfirm title="确定要删除吗？" onConfirm={ () => handleDelete(row) }>
                                    <a>删除</a>
                                </Popconfirm>
                            </span>
                    ) : null,
        },
    ];

    const handleSearch = () => {
        let _data:any[] = [{id:1,couponNo:'201030545877',equityAmount:1000,linkman:'ssss'}]
        setTableData(_data)
    }

    const handleAdd = ()=>{
        setShow(true)
        setId('');
        form.resetFields()
    }

    const handleEdit = (data:any) => {
        setShow(true)
        setId(data.id);
        form.setFieldsValue({
            ...data
        })
        console.log(data)
    }

    const handleDelete = (row:any) => {
        let _data ={
            id:row.id
        }
        equityConfigDelete(_data).then(data =>{
            list();
            message.success('删除成功')
        })

    }


    //modal
    const handleSubmit = () => {
        setConfirmLoading(true);
        form.validateFields().then(values => {
            let _data = {
                    ...values
            }
            if(id){
                equityConfigUpdate({id,..._data}).then((data:any) => {
                    setConfirmLoading(false);
                    setShow(false);
                    form.resetFields();
                    message.success('编辑成功')
                    list();
                }).catch(err =>{
                    setConfirmLoading(false);
                })
            }else{
                equityConfigAdd(_data).then((data:any) => {
                    setConfirmLoading(false);
                    setShow(false);
                    form.resetFields();
                    message.success('添加成功')
                    list();
                }).catch(err =>{
                    setConfirmLoading(false);
                })
            }



                    console.log(values)
                }).catch(info => {
                    setConfirmLoading(false);
                    console.log('Validate Failed:', info);
                });
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setShow(false)
    };


    const pagesChange = (page:number,pageSize:number| undefined) => {
        setPage({
            pageNum:page,
            pageSize
        })
        form.submit();
    };

    const list = (args?:object) => {
        let _data={
            ...page,
            ...args
        };
        equityConfigList(_data).then((data:any) => {
            setTableData(data.data)
            setPage({
                pageNum:1,
                pageSize:30,
                total:1
            })
        })
    }

    useEffect(() => {
        //do something
        list()
    },[1]);

    return (
            <div className="equity-class-container">
                <div className="breadcrumb-container line sticky">
                    <div className="breadcrumb-cell">
                        <div onClick={ () => history.go(-1) }><LeftOutlined />返回</div>
                        <div>权益金管理</div>
                    </div>
                    <div className="breadcrumb-cell">
                        <Button type="primary" onClick={ handleAdd }>添加</Button>
                    </div>
                </div>
                <div className="table-container">
                    <Table rowKey="id" bordered columns={ columns } dataSource={ tableData } pagination={{ onChange:pagesChange,...page }} />
                </div>
                <Modal
                        title={ id ? '编辑权益等级':'添加权益等级'}
                        forceRender
                        visible={ show }
                        className="common-dialog"
                        onOk={ handleSubmit }
                        okText={"保存"}
                        maskClosable={ false }
                        confirmLoading={ confirmLoading }
                        onCancel={ handleCancel }>
                    <Form {...layout} form={ form }>
                        <Form.Item name="equityLevel" label="权益等级名称" rules={ [
                            { required: true, message: '请输入权益等级名称' }
                        ] }>
                            <Input maxLength={ 20 } placeholder="请输入如：白急、1级等" />
                        </Form.Item>
                        <Form.Item name="equityAmount" label="权益等级金额" wrapperCol={{ span:8 }} rules={ [
                            { required: true, type: 'number', min: 0, max: 99999999, message: '请输入权益等级金额' }
                        ] }>
                            <InputNumber  maxLength={ 8 } placeholder="请输入" />
                        </Form.Item>
                        <Form.Item name="remark" label="描述" rules={ [
                            { message: '请输入内容' }
                        ] }>
                            <Input.TextArea rows={4} />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
    );
}

export default EquityClass
