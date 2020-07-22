// Created by szatpig at 2020/6/16.
import React, {useState, useEffect} from 'react';

import {Form, Input, Button, Modal, DatePicker, Select, Table, message, InputNumber} from 'antd';
import { saleList, getMerchantUserNameList, addMerchantUserCoupon } from '@/api/admin/sale-api'

import { ExclamationCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import Dayjs from 'dayjs';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 17 },
};

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

function SaleManage() {
    const [loading, setLoading] = useState(false);
    const [tableData,setTableData] = useState<object[]>([])
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });
    const [show, setShow] = useState(false);
    const [modal, contextHolder] = Modal.useModal();
    const [merchantInfo, setMerchantInfo] = useState<any>([]);
    const [merchantList, setMerchantList] = useState([]);
    const [discountArr, setDiscountArr] = useState([]);
    const [saleArr, setSaleArr] = useState([]);
    const [amount, setAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
        {
            title: '停车券类型',
            dataIndex: 'couponType',
            width: 200,
            ellipsis:true,
            fixed:true,
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
            dataIndex: 'amount',
            width: 120
        },
        {
            title: '库存数/张',
            dataIndex: 'stockNumber'
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
            ellipsis:true,
            render:(cell:string) => (
                    <span title={ cell }>{ cell || '--' }</span>
            )
        },
        {
            title: '发放时间',
            dataIndex: 'createTime',
            width: 160
        },
        {
            title: '截止时间',
            dataIndex: 'deadlineTime',
            width: 160
        },
        {
            title: '操作',
            className:'tableActionCell',
            key: 'action',
            render: (cell:number,row:any) => (
                    <div className="table-button">
                        <Button type="link" onClick={ () =>handleShow(row) }>销售</Button>
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
            modal.confirm({
                icon:<ExclamationCircleOutlined />,
                title: '销售确认',
                className:'import-dialog-container',
                okText:'确定',
                cancelText:'取消',
                content:'销售后无法撤回，确认吗？',
                onOk: () => {
                    const { id:commercialUserCouponId } = merchantInfo
                    let _data ={
                        commercialUserCouponId,
                        ...values
                    }
                    addMerchantUserCoupon(_data).then((data:any) => {
                        message.success('销售成功');
                        setShow(false);
                        setConfirmLoading(false);
                        form.submit();
                    }).catch(() => {
                        setConfirmLoading(false);
                    })
                },
                onCancel() {
                    setConfirmLoading(false);
                },
            });
        }).catch(() => {
            setConfirmLoading(false);
        })
    };

    const handleShow = (row:any) => {
        setMerchantInfo(row)
        modalForm.resetFields();
        setAmount(0)
        setShow(true);
        setDiscount(0)
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setShow(false)
    };
    const handleInput= (value:any) => {
        setAmount( Number(value)*merchantInfo.amount )
    };
    const handleSelect= (value:any,options:any) => {
        setDiscountArr(options.title.map((item:any) => item.discount))
        setSaleArr(options.title.map((item:any) => item.maxSales))
    };

    const findIndex = (val:number, arr:number[]):number => (arr.findIndex((el) => el - val >= 0))

    const getMerchantList = () => {
        let _data ={

        }
        getMerchantUserNameList(_data).then((data:any) => {
            setMerchantList(data.data)
        })
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
        let { couponType,amount,parkingName,equityGrantTime } = values,
                [startTime,endTime] = equityGrantTime || [];

        list({
            couponType,amount,parkingName,
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
        saleList(_data).then((data:any) => {
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
        if(discountArr.length > 0){
            let _index= findIndex(amount,saleArr);
            if(_index > -1){
                setDiscount(discountArr[_index])
            }else{
                setDiscount(1)
            }
        }else{
            setDiscount(1)
        }
    },[saleArr,amount]);

    useEffect(() => {
        //do something
        list();
        getMerchantList();
    },[]);

    return (
            <div className="sale-manage-container">
                <div className="breadcrumb-container left-border line">
                    销售管理
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
                                        allowClear >
                                    {
                                        couponTypeList.map((item:any) => (
                                             <Option key={ item.value } value={ item.value }>{ item.label }</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label="上限金额" name="amount">
                                <InputNumber style={{ width:174 }}  formatter={ (value:any) => value.toString().replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3') } placeholder="请输入上限金额" maxLength={ 9 } />
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
                            rowKey="commercialUserName"
                            bordered
                            columns={ columns }
                            loading={ loading }
                            dataSource={ tableData }
                            pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,showSizeChanger:true,...page, showTotal: showTotal }}/>
                </div>
                <Modal
                        title="销售停车券"
                        visible={ show }
                        forceRender = { true }
                        className="common-dialog"
                        onOk={ handleSubmit }
                        okText={"保存"}
                        maskClosable={ false }
                        confirmLoading={ confirmLoading }
                        destroyOnClose = { true }
                        onCancel={ handleCancel }>
                    <Form {...layout} form={ modalForm } initialValues={{
                        merchantInventory:1
                    }}>
                        <Form.Item label="商家名称" name="merchantUserId" rules={ [
                            { required: true, message: '请选择商家' }
                        ] }>
                            <Select
                                    placeholder="请选择商家"
                                    allowClear onChange={ handleSelect }>
                                {
                                    merchantList.map((item:any) => (
                                            <Option key={ item.id } title={ item.discountRangeListVO } value={ item.id }>{ item.merchantUsername }</Option>
                                    ))
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="销售数量" required>
                            <Form.Item name="inventory" noStyle wrapperCol={{ span:8 }} rules={ [
                                { required: true, message: `请输入金额0-${ merchantInfo.stockNumber }` },
                                { type: 'number', min: 0, max: merchantInfo.stockNumber, message: `库存不足` }
                            ] }>
                                <InputNumber min={1} step={ 1 } onChange={ handleInput } parser={(value:any) => parseInt(value) || 0 } maxLength={ 9 } placeholder="请输入" />
                            </Form.Item>
                            &nbsp;&nbsp;张
                        </Form.Item>
                        <Form.Item label="总金额">
                            { amount ||  0  } 元
                        </Form.Item>
                        <Form.Item label="销售折扣">
                            { discount || 1 }
                        </Form.Item>
                        <div className="ticket-wrap">
                            <p className="ticket-title">折扣券 <i>（库存量：{ merchantInfo.stockNumber } 张）</i></p>
                            {
                                merchantInfo.couponType === 'DISCOUNT_DEDUCT' ?
                                        <>
                                            <p className="flex between">
                                                <span>上限金额：{ merchantInfo.amount }元</span>
                                                <span>折扣：{ merchantInfo.discount }</span>
                                            </p>
                                            <p>截止时间：{ merchantInfo.deadlineTime }</p>
                                        </>:
                                        <p className="flex between">
                                            <span>上限金额：{ merchantInfo.amount }元</span>
                                            <span>截止时间：{ merchantInfo.deadlineTime }</span>
                                        </p>
                            }
                            <p className="flex ticket-parking">
                                <span>可用停车场：</span>
                                <span>{ merchantInfo.parkingNames }</span>
                            </p>
                        </div>
                    </Form>
                </Modal>
                {contextHolder}
            </div>
    );
}

export default SaleManage
