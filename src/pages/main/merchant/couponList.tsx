// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

import moment from 'moment';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, Popover, message, Checkbox, InputNumber} from 'antd';
import { couponList, confirmRevokeCoupon, verifyRevokeAvailable, revokeCouponBatch } from '@/api/coupon-api'

import { ExclamationCircleFilled } from '@ant-design/icons';
import Dayjs from 'dayjs';

const colorList:any = ['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色']
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
};

const { RangePicker } = DatePicker;
const { Option } = Select;

function CouponList() {
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });
    const [show, setShow] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
        {
            title: '停车券类型',
            dataIndex: 'couponNo',
            width: 200,
            ellipsis:true,
            fixed:true
        },
        {
            title: '折扣',
            dataIndex: 'plateNo'
        },
        {
            title: '上限金额/元',
            dataIndex: 'plateColor',
            width: 120
        },
        {
            title: '库存数/张',
            dataIndex: 'couponAmount'
        },
        {
            title: '总金额/元',
            dataIndex: 'couponGrantTime'
        },
        {
            title: '停车场',
            dataIndex: 'expirationTime',
            width: 200,
            ellipsis:true
        },
        {
            title: '发放时间',
            dataIndex: 'verifyTime'
        },
        {
            title: '截止时间',
            dataIndex: 'verifyTime'
        },
        {
            title: '操作',
            key: 'action',
            width: 245,
            render: (cell:number,row:any) => (
                    <div className="table-button">
                        <Button type="link" onClick={ () =>handleShow(row) }>发放</Button>
                    </div>
            ),
        },
    ];

    const [ form ] = Form.useForm();
    const [ modalForm ] = Form.useForm();

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    //modal

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

    const handleShow = (row:any) => {
        console.log('Clicked cancel button');
        setShow(false)
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
            couponNo,plateNo,couponStatus,
            startTime:startTime && Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime:endTime && Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
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
            <div className="coupon-list-container">
                <div className="breadcrumb-container left-border line">
                    停车券管理
                    <span></span>
                </div>
                <div className="search-container">
                    <div className="input-cells">
                        <Form
                                layout="inline"
                                onValuesChange={ onFormLayoutChange }
                                form = { form }
                                onFinish={ handleSearch }>
                            <Form.Item label="停车券类型" name="couponStatus">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    {
                                        colorList.map((item:any,index:number) => {
                                            return  <Option value={ index } key={ index }>{ item }</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="上限金额" name="couponNo">
                                <Input placeholder="请输入上限金额" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item  label="发放时间" name="equityGrantTime">
                                <RangePicker ranges={{}} showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                            <Form.Item label="停车场名称" name="plateNo">
                                <Input placeholder="请输入停车场名称" maxLength={ 8 }/>
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
                        title="发放停车券"
                        visible={ show }
                        className="common-dialog"
                        onOk={ handleSubmit }
                        maskClosable={ false }
                        confirmLoading={ confirmLoading }
                        onCancel={ handleCancel }>
                    <Form {...layout} form={ modalForm }>
                        <Form.Item label="车牌颜色" name="storeName">
                            <Select
                                    placeholder="请选择车牌颜色"
                                    allowClear>
                                <Option value="0">未领取</Option>
                                <Option value="1">已领取</Option>
                                <Option value="2">已核销</Option>
                                <Option value="3">已过期</Option>
                                <Option value="4">已撤销</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="车牌号" name="plateNo">
                            <Input placeholder="请输入车牌号" maxLength={ 8 }/>
                        </Form.Item>
                        <Form.Item name="equityAmount" label="发放数量/张" wrapperCol={{ span:8 }} rules={ [
                            { required: true, type: 'number', min: 0, max: 999999999, message: '请输入金额0-999999999' }
                        ] }>
                            <InputNumber min={1} max={ 999999999 } step={ 1 } parser={(value:any) => parseInt(value) } maxLength={ 9 } placeholder="请输入" />
                        </Form.Item>
                        <div className="ticket-wrap">
                            <p className="ticket-title">折扣券 <i>（库存量：{ 12 } 张）</i></p>
                            <p className="flex between">
                                <span>折扣：{ 0.8 }</span>
                                <span>上限金额：{ 10 } 元</span>
                            </p>
                            <p>截止时间：{ '2020–02–21 19:22:09' }</p>
                            <p className="flex ticket-parking"><span>可用停车场：</span><span>可用停车场：苏州纳米大学停车场，苏州高新区停车场，苏州纳米大学停车场，苏州高新区停车场</span>
                            </p>
                        </div>
                    </Form>
                </Modal>
            </div>
    );
}

export default CouponList
