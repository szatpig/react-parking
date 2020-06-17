// Created by szatpig at 2020/4/30.
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
        title: '金额/元',
        dataIndex: 'couponAmount'
    },
    {
        title: '停车场',
        dataIndex: 'parkingNames',
        ellipsis:true
    },
    {
        title: '发放时间',
        dataIndex: 'couponGrantTime'
    },
    {
        title: '截止时间',
        dataIndex: 'expirationTime'
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

function Coupon(props:Props) {
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

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const onSelectChange = (selectedRowKeys:any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        setSelectedRow(selectedRowKeys);
    };

    const handleBatch = ()=>{
        let _data = {
            ids:selectedRow
        }
        verifyRevokeAvailable(_data).then(data => {
            confirmRevokeCoupon(_data).then((data:any) => {
                setRevokeEquity(data.data);
                setShow(true);
                modalForm.resetFields();
            })
        })
    }

    const rowSelection = {
        selectedRowKeys:selectedRow,
        onChange: onSelectChange,
    };

    const checkboxChange = (e:any) => {
        console.log(`checked = ${e.target.checked}`);
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
        <div className="coupon-container">
            <div className="breadcrumb-container left-border line">
                停车券管理
                <span>
                    <Button type="primary" href={'coupon/equity/single'}>发放停车券</Button>
                    <Button type="primary" href={'coupon/equity/batch'}>批量导入停车券</Button>
                </span>
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
                        <Form.Item label="车牌号" name="plateNo">
                            <Input placeholder="请输入车牌号" maxLength={ 8 }/>
                        </Form.Item>
                        <Form.Item  label="发放时间" name="equityGrantTime">
                            <RangePicker ranges={{
                                "今天": [moment(), moment()],
                                '近一个月': [moment(new Date()).subtract(1,'months'), moment(new Date())],
                            }} showTime format="YYYY-MM-DD HH:mm:ss" />
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
            <div className="search-container export">
                <div className="input-cells">
                    {/*<Checkbox onChange={ checkboxChange }>全选</Checkbox> */}
                    已选中 { selectedRow.length } 条
                    {
                        !!!props.revokable &&
                        <Button type="primary" onClick={ handleBatch } disabled={ selectedRow.length == 0 }>
                            撤销停车券
                        </Button>
                    }
                </div>
            </div>
            <div className="table-container">
                <Table
                        rowKey="id"
                        bordered
                        rowSelection={ rowSelection }
                        columns={ columns }
                        loading={ loading }
                        dataSource={ tableData }
                        scroll={{ x: 1500 }}
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
interface Props  {
    revokable:number
}

const mapStateToProps = (state:any) => ({
    revokable:state.user.info.revokable
})

export default connect(mapStateToProps,{})(Coupon)
