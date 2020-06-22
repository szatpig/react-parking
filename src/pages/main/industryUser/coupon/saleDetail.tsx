// Created by szatpig at 2020/5/6.
import React, {useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';

import moment from 'moment';

import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    Table,
    Checkbox,
    Cascader,
    InputNumber,
    Modal,
    message,
    Radio
} from 'antd';

import Dayjs from 'dayjs';

import { Debounce } from '@/utils/utils'

import { getParkingDetailByBusinessId } from '@/api/common-api'
import {selectByIndustryUser,commercialUserCouponSave } from '@/api/industryUser/coupon-api'
import region from '@/json/region'

const { Option } = Select;
const options = region;
const colorList:any = ['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色']
const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 6 },
};
const validateMessages = {
    required: '${label}不能为空',
    types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    },
};

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

const columns = [
    {
        title: '停车场名称',
        dataIndex: 'parkingName',
        width: 120,
        ellipsis:true
    },
    {
        title: '地址',
        dataIndex: 'address',
        ellipsis:true
    },
    {
        title: '所属业主',
        dataIndex: 'owner',
    },
    {
        title: '经度',
        dataIndex: 'parkingLongitude',
    },
    {
        title: '纬度',
        dataIndex: 'parkingLatitude',
    },
    {
        title: '车位数',
        dataIndex: 'parkingSpacesNumber',
    },
    {
        title: '车道数',
        dataIndex: 'lanesNumber',
    },
    {
        title: 'ETC设备数',
        dataIndex: 'etcDevices',
    },
    {
        title: '起始日期',
        dataIndex: 'startDate',
    },
    {
        title: '终止日期',
        dataIndex: 'endDate',
    }
];

interface TableProps {
    value?: any[];
    onChange?: (value: any[]) => void;
}

const FormTable:React.FC<TableProps> = ({ value = {}, onChange })=>{
    const [selectedRow, setSelectedRow] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableData,setTableData] = useState<object[]>([]);
    const [tableSelect, setTableSelect] = useState(false);
    const [page,setPage] = useState({
        current:1,
        pageSize:20,
        total:0
    });
    const [ form ] = Form.useForm();
    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const triggerChange = (value:any) => {
        if (onChange) {
            onChange(value);
        }
    };

    const onSelectChange = (selectedRowKeys:any,selectedRows:any) => {
        console.log(selectedRowKeys);
        setSelectedRow(selectedRowKeys);
        triggerChange(selectedRowKeys)
    };

    const checkboxChange = (e:any) => {
        setTableSelect(e.target.checked);
        if(e.target.checked){
            let { parkingName,region,address,owner } = form.getFieldsValue(),
                    [province, city, county]= region || [],
                    _data ={
                        parkingName,
                        address,
                        owner,
                        province,
                        city,
                        county
                    }
            triggerChange(_data)
        }else{
            triggerChange(selectedRow)
        }
    }
    const onSelectAll = (row:any) => ({
        disabled: tableSelect, // Column configuration not to be checked
    });
    const rowSelection = {
        selectedRowKeys:selectedRow,
        onChange: onSelectChange,
        getCheckboxProps:onSelectAll
    };

    const handleSearch = (values:{ parkingName?:string,region?:any[],address?:string,owner?:string }) => {
        let { parkingName,region,address,owner } = values,
                [province, city, county]= region || [],
                _data ={
                    parkingName,
                    address,
                    owner,
                    province,
                    city,
                    county,
                    beforeEndDate:true
                }
        list(_data)
        if(tableSelect){
            triggerChange(_data)
        }
    };

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
        let { current,pageSize } = page;
        let _data={
            pageNum:current,
            pageSize,
            ...args
        };
        setLoading(true)
        getParkingDetailByBusinessId(_data).then((data:any) => {
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
        handleSearch({})
    },[0]);

    return(
        <>
            <div className="search-container">
                <div className="input-cells">
                    <Form
                            layout="inline"
                            onValuesChange={ onFormLayoutChange }
                            form = { form }
                            onFinish={ handleSearch }>
                        <Form.Item label="停车场名称" name="parkingName">
                            <Input placeholder="停车场名称" maxLength={ 18 } />
                        </Form.Item>
                        <Form.Item label="省市区" name="region">
                            <Cascader options={ options } placeholder="请选择省市区" />
                        </Form.Item>
                        <Form.Item  label="详细地址" name="address">
                            <Input placeholder="请输入详细地址" maxLength={ 18 } />
                        </Form.Item>
                        <Form.Item label="所属业主" name="owner">
                            <Input placeholder="请输入" maxLength={ 10 } />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="button" onClick={ handleQuery }>查询</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className="search-container export">
                <div className="input-cells">
                    <Checkbox onChange={ checkboxChange }>全选</Checkbox>
                    {
                        `已选中 ${ tableSelect ? page.total :  selectedRow.length } 条`
                    }
                </div>
            </div>
            <div className="table-container">
                <Table  rowKey="id"
                        bordered
                        rowSelection={ rowSelection }
                        columns={ columns }
                        loading={ loading }
                        dataSource={ tableData }
                        scroll={{ x: 1270,y:250 }}
                        pagination={{ onChange:pagesChange,onShowSizeChange:pageSizeChange,showSizeChanger:true,...page, showTotal: showTotal }} />
            </div>
        </>
    )
}

function SaleDetail() {
    const [merchantList, setMerchantList] = useState([]);
    const history = useHistory();
    const [ submitForm ] = Form.useForm();

    const disabledDate = (current:any) => {
        return current && current < moment().endOf('day');
    }

    const _merchantFetch = (name:any) => {
        let _data ={
            name
        }
        console.log(_data)
        selectByIndustryUser(_data).then((data:any) => {
            setMerchantList(data.data)
        })
    }

    const handleSelectFetch = (name:string) => {

        Debounce(_merchantFetch(name),800)
    }

    const onFinish = (values:any) => {
        console.log(values);
        let { commercialUserId,couponType,amount,number,discount,deadlineTime,parkingIds } =  values,
                parkingSelectOptions = !Array.isArray(parkingIds)? parkingIds:'';
                parkingIds = Array.isArray(parkingIds)?parkingIds.join(','):''
        let _data ={
            commercialUserId,couponType,amount,number,discount,deadlineTime,parkingIds,parkingSelectOptions,
            expirationTime:Dayjs(deadlineTime).format('YYYY-MM-DD 23:59:59')
        }
        commercialUserCouponSave(_data).then((data:any) => {
            message.success('添加成功');
            history.replace('/home/coupon/sale')
        })
    };

    return (
         <div className="equity-container">
             <div className="breadcrumb-container line">
                 <div className="breadcrumb-cell">
                     <div onClick={ () => history.go(-1) }><LeftOutlined />返回</div>
                     <div>销售停车券</div>
                 </div>
             </div>
             <Form form={ submitForm }
                   {...layout}
                   className="form-container"
                   name="nest-messages"
                   onFinish={ onFinish }
                   validateMessages={validateMessages}
                   initialValues={{
                       couponType:'FIX_DEDUCT',
                       amount:0,
                       number:0
                   }}>
                 <p className="form-title">基本信息</p>
                 <Form.Item name="commercialUserId" label="商户" rules={[{ required: true }]}>
                     <Select
                             showSearch
                             onSearch={ handleSelectFetch }
                             notFoundContent={ null }
                             placeholder="请选择商户"
                             filterOption={false}
                             allowClear>
                         {
                             merchantList.map((item:any) => (<Option value={ item.id } key={ item.id }>{ item.name }</Option>))
                         }
                     </Select>
                 </Form.Item>
                 <Form.Item name="couponType" label="停车券类型" required>
                     <Radio.Group>
                         {
                             couponTypeList.map((item:any) => (<Radio key={ item.value } value={ item.value }>{ item.label }</Radio>))
                         }
                     </Radio.Group>
                 </Form.Item>

                 <Form.Item label="上限金额" required>
                     <Form.Item name="amount" noStyle wrapperCol={{ span:8 }} rules={ [
                         { required: true, type: 'number', min: 0, max: 99999999, message: '请输入0-9999999数值' }
                     ]}>
                         <InputNumber  maxLength={ 8 } min={ 0 } max={ 99999999 } placeholder="请输入" />
                     </Form.Item>
                     &nbsp;&nbsp;元
                 </Form.Item>
                 <Form.Item label="销售数" required>
                     <Form.Item name="number" noStyle wrapperCol={{ span:8 }} rules={ [
                         { required: true, type: 'number', min: 0, max: 99999999, message: '请输入0-9999999数值' }
                     ]}>
                         <InputNumber  maxLength={ 8 } min={ 0 } max={ 99999999 } placeholder="请输入" />
                     </Form.Item>
                     &nbsp;&nbsp;张
                 </Form.Item>

                 <Form.Item label="总金额" shouldUpdate={(prevValues, currentValues) => prevValues.amount !== currentValues.amount || prevValues.number !== currentValues.number}>
                     { ({ getFieldValue }) => {
                         console.log(getFieldValue('amount'),getFieldValue('number'))
                             return getFieldValue('amount')*getFieldValue('number') || 0
                        }
                     }
                 </Form.Item>
                 <Form.Item label="截止日期" required>
                     < Form.Item name="deadlineTime" noStyle  rules={[{required: true,message:'请选择截止日期'}]}>
                         <DatePicker disabledDate={ disabledDate }/>
                     </Form.Item>
                     &nbsp;&nbsp;23:59:59
                 </Form.Item>
                 <Form.Item name="parkingIds" label="可用停车场" rules={[{ required: true,message:'至少选择一个停车场' }]} wrapperCol={{ span:18 }}>
                     <FormTable />
                 </Form.Item>
                 <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                     <Button type="primary" htmlType="submit">
                         保存
                     </Button>
                 </Form.Item>
             </Form>
         </div>
    );
}

export default SaleDetail
