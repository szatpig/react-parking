// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

import moment from 'moment';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, Popover, message, Checkbox} from 'antd';
import { couponList, confirmRevokeCoupon, verifyRevokeAvailable, revokeCouponBatch } from '@/api/coupon-api'

import { ExclamationCircleFilled } from '@ant-design/icons';
import Dayjs from 'dayjs';

import region from '@/json/region'
const options = region;


const { RangePicker } = DatePicker;
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

const colorList:any = ['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色']

const columns = [
    {
        title: '商户名称',
        dataIndex: 'couponNo',
        width: 200,
        ellipsis:true,
        fixed:true
    },
    {
        title: '停车券类型',
        dataIndex: 'plateNo'
    },
    {
        title: '折扣',
        dataIndex: 'plateColor',
        width: 120
    },
    {
        title: '上限金额/元',
        dataIndex: 'couponAmount'
    },
    {
        title: '销售数/张',
        dataIndex: 'parkingNames'
    },
    {
        title: '总金额/元',
        dataIndex: 'couponGrantTime'
    },
    {
        title: '停车场',
        dataIndex: 'expirationTime',
        width: 200,
        ellipsis:true,
        fixed:true
    },
    {
        title: '销售折扣',
        dataIndex: 'plateColor',
        width: 120
    },
    {
        title: '销售时间',
        dataIndex: 'verifyTime'
    },
    {
        title: '截止时间',
        dataIndex: 'verifyTime'
    }
];
function SaleRecord() {
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });
    const [show, setShow] = useState(false);
    const [revokeEquity, setRevokeEquity] = useState({
        selectLine:0,
        totalBalance:0
    });
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [ form ] = Form.useForm();
    const [ modalForm ] = Form.useForm();

    const history = useHistory()

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const onSelectChange = (selectedRowKeys:any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRow(selectedRowKeys);
    };

    const handleLink = (id:number)=>{
        history.push('sale/detail?id='+id)
    }


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
            <div className="sale-record-container">
                <div className="breadcrumb-container left-border line">
                    销售记录
                    <span></span>
                </div>
                <div className="search-container">
                    <div className="input-cells">
                        <Form
                                layout="inline"
                                onValuesChange={ onFormLayoutChange }
                                form = { form }
                                onFinish={ handleSearch }>
                            <Form.Item label="商户名称" name="couponNo">
                                <Input placeholder="请输入商户名称" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="停车券类型" name="couponStatus">
                            <Select
                                    placeholder="请选择类型"
                                    allowClear>
                                <Option value="0">未领取</Option>
                                <Option value="1">已领取</Option>
                                <Option value="2">已核销</Option>
                                <Option value="3">已过期</Option>
                                <Option value="4">已撤销</Option>
                            </Select>
                        </Form.Item>
                            <Form.Item label="停车场名称" name="plateNo">
                                <Input placeholder="请输入停车场名称" maxLength={ 8 }/>
                            </Form.Item>
                            <Form.Item  label="销售时间" name="equityGrantTime">
                                <RangePicker ranges={{

                                }} showTime format="YYYY-MM-DD HH:mm:ss" />
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
                        title="撤销原因"
                        visible={ show }
                        className="common-dialog"
                        onOk={ handleSubmit }
                        okText={"保存"}
                        confirmLoading={ confirmLoading }
                        onCancel={ handleCancel }>
                    <Form
                            form = { modalForm }
                            onFinish={ handleSubmit }>
                        <Form.Item name="revokeReason" label="撤销原因" rules={ [
                            { required: true, whitespace: true, message: '请输入内容' }
                        ] }>
                            <Input.TextArea rows={4} maxLength={ 200 } />
                        </Form.Item>
                    </Form>
                    <p className="common-dialog-tips">当前选择{ revokeEquity.selectLine || 0 }笔，余额共计{ revokeEquity.totalBalance || 0 }元，撤销后会将未使用金额返回行业用户余额，撤销后不可恢复!</p>
                </Modal>
            </div>
    );
}

export default SaleRecord
