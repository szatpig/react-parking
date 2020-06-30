// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";

import moment from 'moment';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, Popover, message, Checkbox, InputNumber} from 'antd';
import { merchantUserCouponList,  provideCustomerCoupon } from '@/api/merchant/coupon-api'

import { ExclamationCircleFilled } from '@ant-design/icons';
import Dayjs from 'dayjs';

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
    const [merchantInfo, setMerchantInfo] = useState<any>([]);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
        {
            title: '停车券类型',
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
            dataIndex: 'limitAmount',
            width: 120
        },
        {
            title: '库存数/张',
            dataIndex: 'inventory'
        },
        {
            title: '总金额/元',
            dataIndex: 'totalAmount'
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
            title: '发放时间',
            dataIndex: 'couponGrantTime',
            width: 160
        },
        {
            title: '截止时间',
            dataIndex: 'expirationTime',
            width: 160
        },
        {
            title: '操作',
            key: 'action',
            className:'tableActionCell',
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
            const { id:commercialUserCouponId } = merchantInfo;
            let _data ={
                commercialUserCouponId,
                ...values
            }
            provideCustomerCoupon(_data).then((data:any) => {
                message.success('发放成功');
                setShow(false);
                setConfirmLoading(false);
                form.submit();
            }).catch(err =>{
                setConfirmLoading(false);
            })
        }).catch(info => {
            setConfirmLoading(false);
            console.log('Validate Failed:', info);
        });
    };
    const handleShow = (row:any) => {
        setMerchantInfo(row)
        modalForm.resetFields();
        setShow(true)
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setShow(false)
    };

    //list
    const handleQuery = () => {
        setPage({
            ...page,
            current:1
        });
        setSelectedRow([]);
        form.submit();
    };
    const handleSearch = (values:any) => {
        console.log(values)
        let { couponType,limitAmount,parkingName,equityGrantTime } = values,
                [startTime,endTime] = equityGrantTime || [];

        list({
            couponType,limitAmount,parkingName,
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
        merchantUserCouponList(_data).then((data:any) => {
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
                            <Form.Item label="停车券类型" name="couponType">
                                <Select
                                        placeholder="请选择类型"
                                        allowClear>
                                    {
                                        couponTypeList.map((item:any) => {
                                            return  <Option key={ item.value } value={ item.value }>{ item.label }</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="上限金额" name="limitAmount">
                                <Input placeholder="请输入上限金额" maxLength={ 18 } />
                            </Form.Item>
                            <Form.Item  label="发放时间" name="equityGrantTime">
                                <RangePicker ranges={{}} showTime format="YYYY-MM-DD HH:mm:ss" />
                            </Form.Item>
                            <Form.Item label="停车场名称" name="parkingName">
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
                        <Form.Item label="车牌颜色" name="plateColor" rules={ [
                            { required: true, message: '请选择车牌颜色' }
                        ] }>
                            <Select
                                    placeholder="请选择车牌颜色"
                                    allowClear>
                                {
                                    colorList.map((item:any,index:number) => {
                                        return  <Option value={ index } key={ index }>{ item }</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="车牌号" name="plateNo" rules={[{ required: true,whitespace: true }]}>
                            <Input placeholder="请输入车牌号" maxLength={ 8 }/>
                        </Form.Item>

                        <Form.Item label="发放数量" required>
                            <Form.Item name="provideCount" noStyle wrapperCol={{ span:8 }} rules={ [
                                { required: true, message: `请输入数量0-${ merchantInfo.inventory }` },
                                { type: 'number', min: 0, max: merchantInfo.inventory, message: `库存不足` }
                            ] }>
                                <InputNumber min={1} max={ merchantInfo.inventory } step={ 1 } parser={(value:any) => parseInt(value) || 0 } maxLength={ 9 } placeholder={`请输入数量`} />
                            </Form.Item>
                            &nbsp;&nbsp;张
                        </Form.Item>
                        <div className="ticket-wrap">
                            <p className="ticket-title">{ couponTypeText[merchantInfo.couponType] } <i>（库存量：{ merchantInfo.inventory } 张）</i></p>
                            {
                                merchantInfo.couponType === 'TIME_DEDUCT' ?
                                        <>
                                            <p className="flex between">
                                                <span>上限金额：{ merchantInfo.limitAmount }元</span>
                                                <span>折扣：{ merchantInfo.discount }</span>
                                            </p>
                                            <p>截止时间：{ merchantInfo.expirationTime }</p>
                                        </>:
                                        <p className="flex between">
                                            <span>上限金额：{ merchantInfo.limitAmount }元</span>
                                            <span>截止时间：{ merchantInfo.expirationTime }</span>
                                        </p>
                            }
                            <p className="flex ticket-parking">
                                <span>可用停车场：</span>
                                <span>{ merchantInfo.parkingNames || '--' }</span>
                            </p>
                        </div>
                    </Form>
                </Modal>
            </div>
    );
}

export default CouponList
