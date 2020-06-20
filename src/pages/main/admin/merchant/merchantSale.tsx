// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { LeftOutlined } from '@ant-design/icons';

import moment from 'moment';

import { Form, Input, Button, Modal, InputNumber, Table, Popconfirm, message, Row, Col, DatePicker  } from 'antd';
import { equityConfigList, equityConfigAdd, equityConfigUpdate, equityConfigDelete } from "@/api/white-api";

import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        offset: 4
    },
};

function MerchantSale() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [tableData,setTableData] = useState<object[]>([]);
    const [page,setPage] = useState({
        current:1,
        pageSize:30,
        total:1
    });
    const [show, setShow] = useState(false);
    const [id,setId] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [form] = Form.useForm();

    const columns = [
        {
            title: '折扣说明',
            ellipsis:true,
            dataIndex: 'equityLevel',
            width: 180,
        },
        {
            title: '生效时间',
            dataIndex: 'equityAmount'
        },
        {
            title: '终止时间',
            dataIndex: 'remark'
        },
        {
            title: '操作',
            className:'tableActionCell',
            dataIndex: 'operation',
            render: (val:string, row:object) =>
                    tableData.length >= 1 ? (
                            <span>
                                <Button type="link" onClick={ ()=> handleVie(row) }>详情</Button>
                                <Button type="link" onClick={ ()=> handleEdit(row) }>编辑</Button>
                                <Popconfirm title="确定要删除吗？" onConfirm={ () => handleDelete(row) }>
                                    <Button type="link">删除</Button>
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
    const handleVie = (row:any) => {
        let _data ={
            id:row.id
        }
        equityConfigDelete(_data).then(data =>{

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
        equityConfigList(_data).then((data:any) => {
            setTableData(data.data)
            setPage({
                current:1,
                pageSize:30,
                total:1
            })
        })
    }

    useEffect(() => {
        //do something
        list()
    },[]);

    return (
            <div className="merchant-sale-container">
                <div className="breadcrumb-container line sticky">
                    <div className="breadcrumb-cell">
                        <div onClick={ () => history.go(-1) }><LeftOutlined />返回</div>
                        <div>销售折扣设置</div>
                    </div>
                    <div className="breadcrumb-cell">
                        <Button type="primary" onClick={ handleAdd }>添加</Button>
                    </div>
                </div>
                <div className="table-container">
                    <Table rowKey="id" bordered columns={ columns } dataSource={ tableData } pagination={ false } />
                </div>
                <Modal
                        title={ id ? '编辑折扣':'添加折扣'}
                        visible={ show }
                        width="720px"
                        className="common-dialog"
                        onOk={ handleSubmit }
                        okText={"保存"}
                        maskClosable={ false }
                        confirmLoading={ confirmLoading }
                        onCancel={ handleCancel }>
                    <Form form={ form } initialValues={{
                        saleOff:[
                            {
                                amount:'',
                                sale:''
                            }
                        ]
                    }}>
                        <Row className="form-grid" justify="start" gutter={[20, 0]}>
                            <Col span={ 24 }>
                                <Form.Item name="remark" label="折扣说明" rules={ [
                                    { whitespace: true, required: true, message: '请输入内容' }
                                ] }>
                                    <Input.TextArea rows={ 3 } maxLength={ 100 } />
                                </Form.Item>
                            </Col>
                            <Col span={ 12 }>
                                <Form.Item name="startTime" label="生效时间" rules={ [
                                    { required: true, message: '请选择生效时间' }
                                ] }
                                shouldUpdate={(prevValues, currentValues) => prevValues.startTime !== currentValues.startTime}>
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={ (current:any)=>{
                                        return current && current < moment().endOf('day');
                                    } }  />
                                </Form.Item>

                            </Col>
                            <Col span={ 12 }>
                                <Form.Item name="endTime" label="终止时间" rules={ [
                                    { required: true, message: '请选择终止时间' }
                                ] }>
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={ (current:any)=>{
                                        return current && current < moment().endOf('day');
                                    }}  />
                                </Form.Item>
                            </Col>

                            <Col span={ 24 } className="form-List-container">
                                <Form.List name="saleOff" >
                                    {(fields, { add, remove }) => {
                                        return (
                                                <div>
                                                    {fields.map((field, index) => (
                                                            <Form.Item
                                                                    label={index === 0 ? '折扣区间' : ''}
                                                                    required
                                                                    key={ field.key }
                                                                    className="field-list-cell"
                                                            >
                                                                <div className="flex">
                                                                    <Form.Item
                                                                            {...field}
                                                                            label="销售金额/元≤"
                                                                            name={[field.name, 'amount']}
                                                                            fieldKey={[field.fieldKey, 'amount']}
                                                                            rules={[{required: true, type: 'number', min: 0, max: 99999999, message: '请输入0-99999999值' }]}
                                                                    >
                                                                        <InputNumber min={0} max={99999999} step={ 5 } parser={(value:any) => parseInt(value) } maxLength={8} placeholder="请输入"/>
                                                                    </Form.Item>
                                                                    <Form.Item
                                                                            {...field}
                                                                            label="折扣"
                                                                            name={[field.name, 'sale']}
                                                                            fieldKey={[field.fieldKey, 'sale']}
                                                                            rules={[{required: true, type: 'number', min: 0, max: 1, message: '请输入0-1值' }]}
                                                                    >
                                                                        <InputNumber maxLength={8}
                                                                                     min={0} max={1} step={0.01 } placeholder="请输入"/>
                                                                    </Form.Item>
                                                                    {fields.length-1 === index ? (
                                                                            <PlusSquareOutlined
                                                                                    className="dynamic-delete-button"
                                                                                    style={{ fontSize: '22px', margin: '0  0px 0 16px', color: '#ccc' }}
                                                                                    onClick={() => {
                                                                                        add();
                                                                                    }}
                                                                            />
                                                                    ) : null}
                                                                {fields.length > 1 ? (
                                                                        <MinusSquareOutlined
                                                                                className="dynamic-delete-button"
                                                                                style={{ fontSize: '22px', margin: '0 0px 0 16px', color: '#ccc' }}
                                                                                onClick={() => {
                                                                                    remove(field.name);
                                                                                }}
                                                                        />
                                                                ) : null}
                                                                </div>
                                                            </Form.Item>
                                                    ))}
                                                </div>
                                        );
                                    }}
                                </Form.List>
                            </Col>

                        </Row>
                    </Form>
                </Modal>
            </div>
    );
}

export default MerchantSale
