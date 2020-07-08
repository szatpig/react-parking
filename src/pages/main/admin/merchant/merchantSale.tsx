// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { LeftOutlined } from '@ant-design/icons';

import moment from 'moment';

import { Form, Input, Button, Modal, InputNumber, Table, Popconfirm, message, Row, Col, DatePicker  } from 'antd';
import { merchantDiscountList, merchantDiscountDelete, merchantDiscountAdd, merchantDiscountUpdate, merchantDiscountGet } from "@/api/admin/merchant-api";

import { PlusSquareOutlined, MinusSquareOutlined } from '@ant-design/icons';
import Dayjs from 'dayjs';

const formItemLayoutWithOutLabel = {
    wrapperCol: {
        offset: 4
    },
};

function MerchantSale() {
    const history = useHistory();
    const { merchantUserId,merchantName } = useParams();
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
            dataIndex: 'description'
        },
        {
            title: '生效时间',
            dataIndex: 'startTime'
        },
        {
            title: '终止时间',
            dataIndex: 'deadlineTime'
        },
        {
            title: '操作',
            className:'tableActionCell',
            dataIndex: 'operation',
            render: (val:string, row:object) =>(
                <span>
                    <Button type="link" onClick={ ()=> handleEdit(row) }>编辑</Button>
                    <Popconfirm title="确定要删除吗？" onConfirm={ () => handleDelete(row) }>
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </span>
            )
        },
    ];

    const handleAdd = ()=>{
        setShow(true);
        setId('');
        form.resetFields()
    }
    const handleEdit = (row:any) => {
        setShow(true);
        form.resetFields();
        setId(row.id);
        merchantDiscountGet({
            id:row.id
        }).then((data:any) =>{
            const { startTime, deadlineTime, ...others } = data.data
            form.setFieldsValue({
                startTime:Dayjs(startTime),
                deadlineTime:Dayjs(deadlineTime),
                ...others
            })
        })

        console.log(row)
    }
    const handleDelete = (row:any) => {
        let _data ={
            id:row.id
        }
        merchantDiscountDelete(_data).then(data =>{
            list();
            message.success('删除成功')
        })

    }
    const handleView = (row:any) => {
        let _data ={
            id:row.id
        }
        merchantDiscountGet(_data).then(data =>{

        })
    }


    //modal
    const handleSubmit = () => {
        setConfirmLoading(true);
        form.validateFields().then(values => {
            const  { description, startTime, deadlineTime, discountList} = values
            let _data = {
                description,
                discountList,
                startTime:startTime && Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
                deadlineTime:deadlineTime && Dayjs(deadlineTime).format('YYYY-MM-DD HH:mm:ss'),
                merchantUserId
            }
            if(id){
                merchantDiscountUpdate({id,..._data}).then((data:any) => {
                    setConfirmLoading(false);
                    setShow(false);
                    form.resetFields();
                    message.success('编辑成功')
                    list();
                }).catch(err =>{
                    setConfirmLoading(false);
                })
            }else{
                merchantDiscountAdd(_data).then((data:any) => {
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
    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
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
            merchantUserId
        };
        setLoading(true)
        merchantDiscountList(_data).then((data:any) => {
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
        list()
    },[]);

    return (
            <div className="merchant-sale-container">
                <div className="breadcrumb-container line sticky">
                    <div className="breadcrumb-cell">
                        <div onClick={ () => history.go(-1) }><LeftOutlined />返回</div>
                        <div>{ merchantName } -- 销售折扣设置</div>
                    </div>
                    <div className="breadcrumb-cell">
                        <Button type="primary" onClick={ handleAdd }>添加折扣</Button>
                    </div>
                </div>
                <div className="table-container">
                    <Table
                            rowKey="id"
                            bordered
                            columns={ columns }
                            dataSource={ tableData }
                            pagination={ false } />
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
                        discountList:[{ sales: 0, discount: 0.99 }]
                    }}>
                        <Row className="form-grid" justify="start" gutter={[20, 0]}>
                            <Col span={ 24 }>
                                <Form.Item name="description" label="折扣说明" rules={ [
                                    { whitespace: true, required: true, message: '请输入内容' }
                                ] }>
                                    <Input.TextArea rows={ 3 } maxLength={ 100 } />
                                </Form.Item>
                            </Col>
                            <Col span={ 12 }>
                                <Form.Item name="startTime" label="生效时间" rules={ [
                                    { required: true, message: '请选择生效时间' },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (value && getFieldValue('deadlineTime') && getFieldValue('deadlineTime') <= value) {
                                                return Promise.reject('生效时间不能晚于终止时间');
                                            }
                                            return Promise.resolve();

                                        },
                                    })
                                ] } dependencies={['deadlineTime']}>
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={ (current:any)=>{
                                        return current && current < moment().endOf('day');
                                    } }  />
                                </Form.Item>

                            </Col>
                            <Col span={ 12 }>
                                <Form.Item name="deadlineTime" label="终止时间" dependencies={['startTime']} rules={ [
                                    { required: true, message: '请选择终止时间' },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (value && getFieldValue('startTime') && getFieldValue('startTime') > value) {
                                                return Promise.reject('终止时间不能早于生效时间');
                                            }
                                            return Promise.resolve();

                                        },
                                    })
                                ] }>
                                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" disabledDate={ (current:any)=>{
                                        return current && current < moment().endOf('day');
                                    }}  />
                                </Form.Item>
                            </Col>

                            <Col span={ 24 } className="form-List-container">
                                <Form.List name="discountList">
                                    {(fields, { add, remove }) => {
                                        return (
                                            <div>
                                                {fields.map((field, index) => (
                                                    <Form.Item
                                                        label={ index === 0 ? '折扣区间' : '' }
                                                        required
                                                        key={ field.key + index }
                                                        className="field-list-cell">
                                                        <div className="flex">
                                                            <Form.Item
                                                                    {...field}
                                                                    label="销售金额/元≤"
                                                                    name={[field.name, 'sales']}
                                                                    fieldKey={[field.fieldKey, 'sales']}
                                                                    rules={[
                                                                        {required: true, type: 'number', min: 0, max: 99999999, message: '请输入0-99999999值' },
                                                                        ({ getFieldValue }) => ({
                                                                            validator(rule, value) {
                                                                                if (value) {
                                                                                    if(index > 0 && getFieldValue('discountList')[index-1].sales >= value){
                                                                                        return Promise.reject('金额需大于上一个值');
                                                                                    }
                                                                                    return Promise.resolve();
                                                                                }
                                                                                return Promise.reject('');
                                                                            },
                                                                        })
                                                                    ]}
                                                            >
                                                                <InputNumber min={0} max={99999999} step={ 5 } parser={(value:any) => parseInt(value) || 0 } maxLength={8} placeholder="请输入"/>
                                                            </Form.Item>
                                                            <Form.Item
                                                                    {...field}
                                                                    label="折扣"
                                                                    name={[field.name, 'discount']}
                                                                    fieldKey={[field.fieldKey, 'discount']}
                                                                    rules={[{required: true, type: 'number', min: 0, max: 0.99, message: '请输入0-0.99值' }]}
                                                            >
                                                                <InputNumber maxLength={ 4 }
                                                                             min={0} max={ 0.99 } step={0.01 } placeholder="请输入"/>
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
