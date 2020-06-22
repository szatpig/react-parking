// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';

import moment from 'moment';

import {Form, Input, Button, DatePicker, Select, Table} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { industryUserAccountLog } from '@/api/industryUser/account-api'

import Dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

const columns = [
    {
        title: '交易类型',
        dataIndex: 'changeType',
        width: 200,
        ellipsis:true,
        fixed:true
    },
    {
        title: '张数/笔数',
        dataIndex: 'number'
    },
    {
        title: '商户名称',
        dataIndex: 'commercialUserName',
        width: 200,
        ellipsis:true,
        fixed:true
    },
    {
        title: '券码',
        dataIndex: 'couponNo',
        ellipsis:true,
    },
    {
        title: '券面总金额/元',
        dataIndex: 'totalAmount'
    },
    {
        title: '交易金额/元',
        dataIndex: 'changeAmount'
    },
    {
        title: '账户余额/元',
        dataIndex: 'availableAmount'
    },
    {
        title: '冻结余额/元',
        dataIndex: 'freezeAmount'
    },
    {
        title: '交易时间',
        dataIndex: 'operatorTime'
    }
];

function AccountBill() {
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

    //list 操作
    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
        form.submit();
    };
    const handleSearch = (values:any) => {
        console.log(values)
        let { changeType,commercialUserName,couponNo,equityGrantTime } = values,
                [startTime,endTime] = equityGrantTime || [];

        list({
            couponNo,commercialUserName,changeType,
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
        industryUserAccountLog(_data).then((data:any) => {
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
            <div className="account-bill-container">
                <div className="breadcrumb-container left-border line">
                    账单
                    <span></span>
                </div>
                <div className="search-container">
                    <div className="input-cells">
                        <Form
                                layout="inline"
                                onValuesChange={ onFormLayoutChange }
                                form = { form }
                                onFinish={ handleSearch }>
                            {/*充值:0, 发放停车券:3, 发放权益金:2, 核销停车券:7, 核销权益金:6, 停车券过期:5, 权益金过期:4, 撤销停车券:9, 撤销权益金:8, 后台修改余额:1*/}
                            <Form.Item label="交易类型" name="changeType">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    <Option value="0">充值</Option>
                                    <Option value="3">发放停车券</Option>
                                    <Option value="2">发放权益金</Option>
                                    <Option value="7">核销停车券</Option>
                                    <Option value="6">核销权益金</Option>
                                    <Option value="5">停车券过期</Option>
                                    <Option value="4">权益金过期</Option>
                                    <Option value="9">撤销停车券</Option>
                                    <Option value="8">撤销权益金</Option>
                                    <Option value="1">后台修改余额</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item label="商户名称" name="commercialUserName">
                                <Input placeholder="请输入商户名称" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="券码" name="couponNo">
                                <Input placeholder="请输入券码" maxLength={ 8 }/>
                            </Form.Item>
                            <Form.Item  label="交易时间" name="equityGrantTime">
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
export default AccountBill
