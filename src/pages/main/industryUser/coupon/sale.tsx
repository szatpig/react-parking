// Created by szatpig at 2020/6/15.
import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

import moment from 'moment';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, Popover, message, Checkbox} from 'antd';
import { commercialUserCouponList } from '@/api/industryUser/coupon-api'

import { ExclamationCircleFilled } from '@ant-design/icons';
import Dayjs from 'dayjs';


const { RangePicker } = DatePicker;
const { Option } = Select;

const couponTypeList:any = [
    {
        label:'固定抵扣金额券',
        value:'FIX_DEDUCT',
    },
    {
        label:'按比例折扣',
        value:'DISCOUNT_DEDUCT',
    },
    {
        label:'次数抵扣',
        value:'TIME_DEDUCT',
    }
]
const couponTypeText:any = {
    FIX_DEDUCT:'固定抵扣金额券',
    DISCOUNT_DEDUCT:'按比例折扣',
    TIME_DEDUCT:'次数抵扣',
}

const columns = [
    {
        title: '商户名称',
        dataIndex: 'commercialUserName',
        width: 200,
        ellipsis:true,
        fixed:true
    },
    {
        title: '优惠券类型',
        dataIndex: 'couponType',
        render: (cell:number,row:any) => (
                <span>
                    { couponTypeText[cell] }
                </span>
        )
    },
    {
        title: '折扣',
        dataIndex: 'discount'
    },
    {
        title: '上限金额/元',
        dataIndex: 'amount'
    },
    {
        title: '销售数/张',
        dataIndex: 'number'
    },
    {
        title: '总金额/元',
        dataIndex: 'totalAmount'
    },
    {
        title: '停车场',
        dataIndex: 'parkingNames',
        width: 200,
        ellipsis:true,
        fixed:true
    },
    {
        title: '发放时间',
        dataIndex: 'createTime'
    },
    {
        title: '截止时间',
        dataIndex: 'deadlineTime'
    }
];


function CouponSale() {
    const [loading, setLoading] = useState(false);
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });
    const [ form ] = Form.useForm();

    const history = useHistory()

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const handleLink = ()=>{
        history.push('sale/detail')
    }

    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
        form.submit();
    };
    const handleSearch = (values:any) => {
        console.log(values)
        let { commercialUserName,parkingName,couponType,equityGrantTime } = values,
                [startTime,endTime] = equityGrantTime || [];

        list({
            commercialUserName,parkingName,couponType,
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
        commercialUserCouponList(_data).then((data:any) => {
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
            <div className="coupon-sale-container">
                <div className="breadcrumb-container left-border line">
                    停车券管理
                    <span>
                    <Button type="primary" onClick={ handleLink }>销售停车券</Button>
                </span>
                </div>
                <div className="search-container">
                    <div className="input-cells">
                        <Form
                                layout="inline"
                                onValuesChange={ onFormLayoutChange }
                                form = { form }
                                onFinish={ handleSearch }>
                            <Form.Item label="商户名称" name="commercialUserName">
                                <Input placeholder="请输入商户名称" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="停车场名称" name="parkingName">
                                <Input placeholder="请输入停车场名称" maxLength={ 8 }/>
                            </Form.Item>
                            <Form.Item  label="发放时间" name="equityGrantTime">
                                <RangePicker ranges={{}} showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                            <Form.Item label="停车券类型" name="couponType">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    {
                                        couponTypeList.map((item:any) => (<Option value={ item.value }>{ item.label }</Option>))
                                    }
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

export default CouponSale
