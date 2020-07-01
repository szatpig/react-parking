// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

import moment from 'moment';

import {Form, Input, Button, DatePicker, Select, Table} from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import site from "@/utils/config";
import { saleRecordList, saleRecordExport } from '@/api/admin/record-api'

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

const colorList:any = ['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色']

const columns = [
    {
        title: '商家名称',
        dataIndex: 'merchantUserName',
        width: 200,
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
        title: '销售数/张',
        dataIndex: 'buyNumber'
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
        render:(cell:string) => (
                <span title={ cell }>{ cell || '--' }</span>
        )
    },
    {
        title: '销售折扣',
        dataIndex: 'buyDiscount',
        width: 120
    },
    {
        title: '销售时间',
        dataIndex: 'sellTime',
        width: 160
    },
    {
        title: '截止时间',
        dataIndex: 'expirationTime',
        width: 160
    }
];
function SaleRecord() {
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

    const handleLink = (id:number)=>{
        history.push('sale/detail?id='+id)
    }

    const handleExport = (values:object) => {
        let { merchantUserName,couponType,parkingName,equityGrantTime } = form.getFieldsValue(),
                [startTime,endTime] = equityGrantTime ||  ['',''];
        let _data ={
            merchantUserName,couponType,parkingName,
            startTime:startTime && Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime:endTime && Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
        }
        saleRecordExport(_data).then((data:any)=>{
            const aLink = document.createElement('a');
            document.body.appendChild(aLink);
            aLink.style.display='none';
            aLink.target = '_blank'
            aLink.href = site.exeUrl + data.data.exportSellLogPath;
            aLink.click();
            document.body.removeChild(aLink);
        })
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
        let { merchantUserName,couponType,parkingName,equityGrantTime } = values,
                [startTime,endTime] = equityGrantTime || [];

        list({
            merchantUserName,couponType,parkingName,
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
        saleRecordList(_data).then((data:any) => {
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
                            <Form.Item label="商户家称" name="merchantUserName">
                                <Input placeholder="请输入商家名称" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item label="停车券类型" name="couponType">
                            <Select
                                    placeholder="请选择类型"
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
                            <Form.Item  label="销售时间" name="equityGrantTime">
                                <RangePicker ranges={{

                                }} showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="button" onClick={ handleQuery }>查询</Button>
                                <Button type="primary" htmlType="button" style={{ marginLeft:"12px" }} onClick={ handleExport }>导出</Button>
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
            </div>
    );
}

export default SaleRecord
