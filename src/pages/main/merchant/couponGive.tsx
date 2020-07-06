// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { connect } from "react-redux";
import moment from 'moment';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, Popover, message, Checkbox} from 'antd';
import { merchantUserCouponRecordList } from '@/api/merchant/coupon-api'

import Dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;


const couponTypeList:any = [
    {
        label:'固定抵扣金额券',
        value:'FIX_DEDUCT'
    },
    {
        label:'按比例折扣',
        value:'DISCOUNT_DEDUCT'
    },
    {
        label:'次数抵扣',
        value:'TIME_DEDUCT'
    }
];

const couponTypeText:any = {
    FIX_DEDUCT:'固定抵扣金额券',
    DISCOUNT_DEDUCT:'按比例折扣',
    TIME_DEDUCT:'次数抵扣',
}

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
        dataIndex: 'couponType'
    },
    {
        title: '折扣',
        dataIndex: 'discount'
    },
    {
        title: '上限金额/元',
        dataIndex: 'limitAmount'
    },
    {
        title: '停车场',
        dataIndex: 'parkingNames',
        ellipsis:true,
        render:(cell:string) => (
                <span title={ cell }>{ cell || '--' }</span>
        )
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
        dataIndex: 'couponGrantTime',
        width: 160
    },
    {
        title: '使用时间',
        dataIndex: 'verifyTime',
        width: 160,
        render: (cell:number,row:any) => (
                <span>{ cell || '--' }</span>
        )
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
    //list
    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
        form.submit();
    };
    const handleSearch = (values:any) => {
        console.log(values)
        let { couponNo,plateNo,couponStatus,couponType,parkingName,equityGrantTime } = values,
                [startTime,endTime] = equityGrantTime || [];

        list({
            couponNo,plateNo,couponStatus,couponType,parkingName,
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
        merchantUserCouponRecordList(_data).then((data:any) => {
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
                    停车券发放记录
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
                            <Form.Item label="类型" name="couponType">
                                <Select
                                        placeholder="请选择"
                                        allowClear>
                                    {
                                        couponTypeList.map((item:any) => (
                                                <Option key={ item.value } value={ item.value }>{ item.label }</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="停车场名称" name="parkingName">
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
                            pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,showSizeChanger:true,...page, showTotal: showTotal }}/>
                </div>
            </div>
    );
}

export default CouponGive
