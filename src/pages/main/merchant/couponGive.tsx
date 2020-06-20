// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import moment from 'moment';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, Popover, message, Checkbox} from 'antd';
import { couponList, confirmRevokeCoupon, verifyRevokeAvailable, revokeCouponBatch } from '@/api/coupon-api'

import Dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const equityStatusList:any = {
    0:{
        label:'未领取',
        color:'blue',
    },
    1:{
        label:'已领取',
        color:'green',
    },
    2:{
        label:'已核销',
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
        title: '券码',
        dataIndex: 'couponNo',
        width: 160,
        ellipsis:true,
        fixed:true
    },
    {
        title: '停车券类型',
        dataIndex: 'couponNo'
    },
    {
        title: '折扣',
        dataIndex: 'couponAmount'
    },
    {
        title: '上限金额/元',
        dataIndex: 'couponAmount'
    },
    {
        title: '停车场',
        dataIndex: 'parkingNames',
        ellipsis:true
    },
    {
        title: '车牌号',
        dataIndex: 'plateNo'
    },
    {
        title: '车牌颜色',
        dataIndex: 'plateColor',
        width: 120,
        render:(cell:number) => (
                <span>{ colorList[cell] }</span>
        )
    },
    {
        title: '发放时间',
        dataIndex: 'couponGrantTime'
    },
    {
        title: '使用时间',
        dataIndex: 'verifyTime'
    },
    {
        title: '状态',
        dataIndex: 'couponStatus',
        render: (cell:number,row:any) => (
                cell == 4 ?
                        <Popover overlayClassName="table-popover-container" content={ row.revokeReason } title={ <div className="flex between"><span>提示</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>{ row.updateTime }</span></div> } trigger="hover">
                            <Tag color={ equityStatusList[cell].color }>{ equityStatusList[cell].label }</Tag>
                        </Popover>:
                        <Tag color={ equityStatusList[cell].color }>{ equityStatusList[cell].label }</Tag>
        )
    },
];

function CouponGive() {
    const [loading, setLoading] = useState(false);
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });

    const [ form ] = Form.useForm();

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
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
    },[]);

    return (
            <div className="coupon-give-container">
                <div className="breadcrumb-container left-border line">
                    停车券发放
                    <span></span>
                </div>
                <div className="search-container">
                    <div className="input-cells">
                        <Form
                                layout="inline"
                                onValuesChange={ onFormLayoutChange }
                                form = { form }
                                onFinish={ handleSearch }>
                            <Form.Item label="券码" name="couponNo">
                                <Input placeholder="请输入券码" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="类型" name="couponStatus">
                                <Select
                                        placeholder="请选择"
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
                            <Form.Item label="车牌号" name="plateNo">
                                <Input placeholder="请输入车牌号" maxLength={ 8 }/>
                            </Form.Item>
                            <Form.Item  label="发放时间" name="equityGrantTime">
                                <RangePicker ranges={{}} showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                            <Form.Item label="状态" name="couponStatus">
                                <Select
                                        placeholder="请选择"
                                        allowClear>
                                    <Option value="0">未领取</Option>
                                    <Option value="1">已领取</Option>
                                    <Option value="2">已核销</Option>
                                    <Option value="3">已过期</Option>
                                    <Option value="4">已撤销</Option>
                                </Select>
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
                            scroll={{ x: 1500 }}
                            pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,showSizeChanger:true,...page, showTotal: showTotal }}/>
                </div>
            </div>
    );
}

export default CouponGive
