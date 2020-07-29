// Created by szatpig at 2020/4/30.
import React, {useState, useEffect} from 'react';
import moment from 'moment';

import { Form, Input, Button, DatePicker, Select, Table } from 'antd';

import { equityVerifyRecordList, equityVerifyRecordStatistics, equityVerifyRecordExport } from '@/api/industryUser/verification-api'

import Dayjs from 'dayjs';
import site from "@/utils/config";

const { RangePicker } = DatePicker;
const { Option } = Select;

const columns = [
    {
        title: '商户名称',
        dataIndex: 'commercialUserName',
        width: 160,
        ellipsis:true,
        render: (cell:any,row:any) => (
                cell === null ? '' : cell
        )
    },
    {
        title: '停车场名称',
        dataIndex: 'parkingName',
        width: 120,
        ellipsis:true
    },
    {
        title: '核销类型',
        dataIndex: 'verifyType',
    },
    {
        title: '券码',
        dataIndex: 'couponNo'
    },
    {
        title: '车牌号',
        dataIndex: 'plateNo',
        key:'plateNo',
    },
    {
        title: '入场时间',
        dataIndex: 'entranceTime'
    },
    {
        title: '出场时间',
        dataIndex: 'exportTime'
    },
    {
        title: '停车总额/元',
        dataIndex: 'parkingAmount'
    },
    {
        title: '核销金额/元',
        dataIndex: 'verifyAmount'
    },
    {
        title: '核销时间',
        dataIndex: 'verifyTime'
    }
];

function Verification() {
    const [loading, setLoading] = useState(false);
    const [summaryData,setSummaryData] = useState({
        verifyRecordCount:0,
        verifyRecordAmount:0
    });
    const [tableData,setTableData] = useState<object[]>([]);
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });

    const [ form ] = Form.useForm();
    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const handleExport = (values:object) => {
        let { parkingName, verifyType, couponNo, plateNo,time } = form.getFieldsValue(),
                [startTime,endTime] = time ||  ['',''];
        let _data ={
            parkingName,
            verifyType,
            couponNo,
            plateNo,
            startTime:startTime && Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime:endTime && Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
        }
        equityVerifyRecordExport(_data).then((data:any)=>{
            const aLink = document.createElement('a');
            document.body.appendChild(aLink);
            aLink.style.display='none';
            aLink.target = '_blank'
            aLink.href = site.exeUrl + data.data;
            aLink.click();
            document.body.removeChild(aLink);
        })
    }

    const handleSearch = (values:any) => {
        let { parkingName, verifyType, couponNo, plateNo,time } = values,
                [startTime,endTime] = time || []
        let _data ={
            parkingName,
            verifyType,
            couponNo,
            plateNo,
            startTime:startTime && Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime:endTime && Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
        }
        list(_data)
    }

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
        getStatistics(_data);
        equityVerifyRecordList(_data).then((data:any) => {
            setTableData(data.data.list);
            setPage({
                ...page,
                total:data.data.total
            })
        })
    };

    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
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

    const getStatistics = (_data:any) => {
        equityVerifyRecordStatistics(_data).then((data:any) => {
            setSummaryData(data.data)
        })
    }

    useEffect(() => {
        //do something
        list();
    },[]);

    return (
        <div className="verification-container">
            <div className="breadcrumb-container left-border line">
                核销记录
            </div>
            <div className="search-container">
                <div className="input-cells">
                    <Form
                            layout="inline"
                            onValuesChange={ onFormLayoutChange }
                            form = { form }
                            onFinish={ handleSearch }>
                        <Form.Item label="停车场名称" name="parkingName">
                            <Input placeholder="请输入停车场名称" maxLength={ 18 } />
                        </Form.Item>
                        <Form.Item  label="核销类型" name="verifyType">
                            <Select
                                    placeholder="请选择"
                                    allowClear>
                                <Option value={ 0 }>白名单</Option>
                                <Option value={ 1 }>停车券-金额券</Option>
                                <Option value={ 2 }>停车券-折扣券</Option>
                                <Option value={ 3 }>停车券-次数券</Option>
                                <Option value={ 4 }>停车券-金额券(人工核销)</Option>
                                <Option value={ 5 }>停车券-折扣券(人工核销)</Option>
                                <Option value={ 6 }>停车券-次数券(人工核销)</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="券码" name="couponNo">
                            <Input placeholder="请输入券码" maxLength={ 18 } />
                        </Form.Item>
                        <Form.Item label="车牌号" name="plateNo">
                            <Input placeholder="请输入车牌号" maxLength={ 8 }/>
                        </Form.Item>
                        <Form.Item  label="核销时间" name="time">
                            <RangePicker ranges={{}} showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="button" onClick={ handleQuery }>查询</Button>
                            <Button type="primary" htmlType="button" style={{ marginLeft:"12px" }} onClick={ handleExport }>导出</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className="summary-container flex">
                <span className="flex column">
                    <i>核销笔数</i>
                    <i>{ summaryData.verifyRecordCount }</i>
                </span>
                <span className="flex column">
                    <i>核销金额/元</i>
                    <i>{ summaryData.verifyRecordAmount }</i>
                </span>
            </div>
            <div className="table-container">
                <Table rowKey="id" bordered columns={ columns } dataSource={ tableData }
                       pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,showSizeChanger:true,...page, showTotal: showTotal  }}/>
            </div>
        </div>
    );
}

export default Verification
