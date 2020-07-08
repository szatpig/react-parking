// Created by szatpig at 2020/4/30.
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import moment from 'moment';
import Dayjs from 'dayjs';

import {Form, Input, Button, Modal, DatePicker, Select, Table, Tag, Popover, message} from 'antd';
import { whiteList, equityConfigList, grantValid, getRevocable, confirmRevokeEquity, revokeEquitySubmit, validRevokeAvailable } from '@/api/industryUser/white-api'
import { ExclamationCircleFilled } from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { Option } = Select;

const equityStatusList:any = {
    0:{
        label:'未使用',
        color:'blue',
    },
    1:{
        label:'使用中',
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
        title: '券码',
        dataIndex: 'couponNo',
        ellipsis:true,
        width: 160,
        fixed:true
    },
    {
        title: '车牌号',
        dataIndex: 'plateNo',
        width: 120
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
        title: '权益等级',
        width: 120,
        dataIndex: 'equityLevel',
    },
    {
        title: '权益金额/元',
        dataIndex: 'equityAmount',
        ellipsis:true,
        width:120,
    },
    {
        title: '权益停车场',
        dataIndex: 'parkingNames',
        ellipsis:true,
        width:120,
    },
    {
        title: '发放时间',
        ellipsis:true,
        width:160,
        dataIndex: 'equityGrantTime',
    },
    {
        title: '截止时间',
        ellipsis:true,
        width:160,
        dataIndex: 'expirationTime',
    },
    {
        title: '已使用金额/元',
        dataIndex: 'equityUsed',
    },
    {
        title: '余额/元',
        dataIndex: 'equityBalance',
    },
    {
        title: '最后使用时间',
        ellipsis:true,
        width:160,
        dataIndex: 'lastUsageTime',
    },
    {
        title: '状态',
        dataIndex: 'equityStatus',
        render: (cell:number,row:any) => (
                cell === 4 ?
                <Popover overlayClassName="table-popover-container" placement="topRight" content={ row.revokeReason } title={ <div className="flex between"><span>原因</span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span><span>{ row.updateTime }</span></div> } trigger="hover">
                    <span>
                        <Tag color={ equityStatusList[cell].color }>{ equityStatusList[cell].label }</Tag>
                        <ExclamationCircleFilled style={{ color:'#C0C6CC' }} />
                    </span>
                </Popover>:
                <Tag color={ equityStatusList[cell].color }>{ equityStatusList[cell].label }</Tag>
        )
    },
];

function WhiteList() {
    const [revokable, setRevokable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [equityList, setEquityList] = useState([]);
    const [effectiveWhileListCount, setEffectiveWhileListCount] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [rowPages, setRowPages] = useState<object>({
        0:[]
    });
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

    const history = useHistory();

    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const onSelectChange = (selectedRowKeys:any,selectedRow:any) => {
        setRowPages({
            ...rowPages,
            [page.current]:selectedRowKeys
        })
    };

    const handleBatch = ()=>{
        let _data = {
            ids:selectedRow
        }
        validRevokeAvailable(_data).then(data => {
            confirmRevokeEquity(_data).then((data:any) => {
                setRevokeEquity(data.data);
                setShow(true);
                setSelectedRow([]);
                modalForm.resetFields();
            })
        })

    }

    const rowSelection = {
        selectedRowKeys:selectedRow,
        onChange: onSelectChange,
    };

    //modal
    const handleSubmit = () => {
        setConfirmLoading(true);
        modalForm.validateFields().then((values:any) => {
            let _data ={
                ids:selectedRow,
                ...values
            }
            revokeEquitySubmit(_data).then((data:any) => {
                message.success('批量处理成功');
                form.submit();
                setShow(false);
                setConfirmLoading(false);
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
        console.log(page)
        let { couponNo,plateNo,couponStatus,equityLevel,equityGrantTime,equityStatus } = values,
             [startTime,endTime] = equityGrantTime || [];

        list({
            couponNo,
            plateNo,
            couponStatus,
            equityConfigId:equityLevel,
            startTime:startTime && Dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime:endTime && Dayjs(endTime).format('YYYY-MM-DD HH:mm:ss'),
            equityStatus,
            current:1
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
        setSelectedRow(Object.values(rowPages).reduce((current,sum) => sum.concat(current)));
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
        let { current,pageSize } = page;
        let _data={
            pageNum:current,
            pageSize,
            ...args
        };
        setLoading(true)
        whiteList(_data).then((data:any) => {
            setTableData(data.data.customerEquityList.list);
            setPage({
                ...page,
                total:data.data.customerEquityList.total
            })
            setEffectiveWhileListCount(data.data.effectiveWhileListCount)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    };

    const getEquityList = () => {
        let _data ={}
        equityConfigList(_data).then((data:any) => {
            setEquityList(data.data.map((item:any) => ({
                value:item.id,
                label:item.equityLevel
            })))
        })
    }
    const getRevocableFun = () => {
        let _data ={ }
        getRevocable(_data).then((data:any) => {
            setRevokable(!!data.data)
        })
    }
    const getGrantValid = (path:string) => {
        let _data ={}
        grantValid(_data).then((data:any) => {
            history.push(path)
        }).catch(err => {
        })
    }

    useEffect(() => {
        getRevocableFun();
        list();
        getEquityList();
    },[]);

    useEffect(() => {
        let temp = Object.values(rowPages).reduce((current,sum) => sum.concat(current))
        setSelectedRow(temp);
    },[rowPages]);

    return (
        <div className="white-container">
            <div className="breadcrumb-container left-border line">
                白名单管理
                <span>
                    <Button type="link" href={'white/class'}>权益等级管理</Button>
                    <Button type="primary" onClick={ () => getGrantValid('/home/white/equity/single') }>发放权益金</Button>
                    <Button type="primary" onClick={ () => getGrantValid('/home/white/equity/batch') }>批量导入权益</Button>
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
                            <RangePicker ranges={{}} showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                        <Form.Item  label="权益等级" name="equityLevel">
                            <Select
                                    placeholder="请选择"
                                    allowClear>
                                {
                                    equityList.map((item:any) => {
                                      return  <Option value={item.value} key={ item.value }>{item.label}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="状态" name="equityStatus">
                            <Select
                                    placeholder="请选择"
                                    allowClear>
                                <Option value="0">未使用</Option>
                                <Option value="1">使用中</Option>
                                <Option value="2">核销完成</Option>
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
                    当前有效白名单：{ effectiveWhileListCount }&nbsp;&nbsp;个
                    {
                        !revokable &&
                        <Button type="primary" onClick={ handleBatch } disabled={ selectedRow.length === 0 }>
                            撤销权益金
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
                        pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,showSizeChanger:true,...page, showTotal: showTotal }} />
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
                    form={ modalForm }>
                    <Form.Item name="revokeReason" label="撤销原因" rules={ [
                        { required: true,whitespace: true, message: '请输入内容' }
                    ] }>
                        <Input.TextArea rows={4} maxLength={ 200 } />
                    </Form.Item>
                </Form>
                <p className="common-dialog-tips">当前选择{ revokeEquity.selectLine }笔，余额共计{ revokeEquity.totalBalance }元，撤销后会将未使用金额返回行业用户余额，撤销后不可恢复!</p>
            </Modal>
        </div>
    );
}

export default WhiteList