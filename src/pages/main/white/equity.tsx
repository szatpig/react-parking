// Created by szatpig at 2020/5/6.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux'

import { LeftOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, DatePicker, Table, Checkbox, Cascader, Upload, Modal   } from 'antd';

import Dayjs from 'dayjs';

import site from '@/utils/config'
import { getParkingDetailByBusinessId } from '@/api/common-api'
import {equityConfigList, grantValid , grantEquity, parseWhitelist, importEquity} from '@/api/white-api'
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

const columns = [
    {
        title: '停车场名称',
        dataIndex: 'parkingName',
        width: 120,
    },
    {
        title: '地址',
        dataIndex: 'address',
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
    const [tableData,setTableData] = useState<object[]>([])

    const [ form ] = Form.useForm();
    const onFormLayoutChange = ({  }) => {
        // setFormLayout(layout);
    };

    const triggerChange = (value:object[]) => {
        if (onChange) {
            onChange(value);
        }
    };

    const onSelectChange = (selectedRowKeys:any,selectedRows:any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys,selectedRows);
        setSelectedRow(selectedRows);
        triggerChange(selectedRowKeys)
    };

    const checkboxChange = (e:any) => {
        console.log(`checked = ${e.target.checked}`);
    }
    const rowSelection = {
        onChange: onSelectChange,
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
            county
        }
        list(_data)
    };

    const list = (args?:object) => {
        let _data={
            ...args
        };
        getParkingDetailByBusinessId(_data).then((data:any) => {
            setTableData(data.data.list);
        })
    };

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
                            <Input placeholder="停车场名称" maxLength={ 18 } />
                        </Form.Item>
                        <Form.Item label="所属业主" name="owner">
                            <Input placeholder="请输入" maxLength={ 10 } />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">查询</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <div className="search-container export">
                <div className="input-cells">
                    <Checkbox onChange={ checkboxChange }>全选</Checkbox> 已选中 { selectedRow.length } 条
                </div>
            </div>
            <div className="table-container">
                <Table rowKey="id" bordered rowSelection={ rowSelection } columns={ columns } dataSource={ tableData } />
            </div>
        </>
    )
}

function Equity(props:Props) {
    const history = useHistory();
    const params:{type:string} = useParams();
    const [ submitForm ] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();

    const [equityList, setEquityList] = useState([]);

    const{ userToken } = props



    const onFinish = (values:any) => {
        console.log(values);
        const { plateNo,plateColor,equityConfigId,whitelistUri,expirationTime,parkIdList } =  values;
        if(params.type == 'single'){
            let _data ={
                plateNo,
                plateColor,
                equityConfigId,
                expirationTime:Dayjs(expirationTime).format('YYYY-MM-DD 23:59:59'),
                parkIdList
            }
            grantEquity(_data).then((data:any) => {
                modal.confirm({
                    icon:<ExclamationCircleOutlined />,
                    title: '发放确认',
                    className:'import-dialog-container',
                    okText:'确认发放',
                    content: (
                            <div className="import-dialog-wrapper">
                                <div className="import-cell">
                                    <p>行业信息</p>
                                    <div className="import-content">
                                        <p><span>行业用户名称：</span>某某某某某某某有限公司</p>
                                        <p><span>权益余额：</span>40000元</p>
                                        <p><span>当前有效白名单：</span>100个</p>
                                        <p><span>白名单上限：</span>110个</p>
                                    </div>
                                </div>
                                <div className="import-cell">
                                    <p>导入信息</p>
                                    <div className="import-content">
                                        <p><span>共计：</span>某某某某某某某有限公司</p>
                                        <p><span>其中新增白名单：</span>0个</p>
                                        <p><span>权益余额总计：</span>40000元</p>
                                    </div>
                                </div>
                            </div>
                    ),
                    onOk: () => {
                        handleDialogConfirm({
                            equityConfigId,
                            whitelistUri,
                            expirationTime,
                            parkIdList
                        })//确认按钮的回调方法，在下面
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            })
        }else{
            let _data ={
                whitelistUri,
                equityConfigId,
                expirationTime:Dayjs(expirationTime).format('YYYY-MM-DD 23:59:59'),
                parkIdList
            }
            parseWhitelist(_data).then((data:any) => {
                modal.confirm({
                    icon:<ExclamationCircleOutlined />,
                    title: '导入确认',
                    className:'import-dialog-container',
                    okText:'确认导入',
                    content: (
                            <div className="import-dialog-wrapper">
                                <div className="import-cell">
                                    <p>行业信息</p>
                                    <div className="import-content">
                                        <p><span>行业用户名称：</span>某某某某某某某有限公司</p>
                                        <p><span>权益余额：</span>40000元</p>
                                        <p><span>当前有效白名单：</span>100个</p>
                                        <p><span>白名单上限：</span>110个</p>
                                    </div>
                                </div>
                                <div className="import-cell">
                                    <p>导入信息</p>
                                    <div className="import-content">
                                        <p><span>共计：</span>某某某某某某某有限公司</p>
                                        <p><span>其中新增白名单：</span>0个</p>
                                        <p><span>权益余额总计：</span>40000元</p>
                                    </div>
                                </div>
                            </div>
                    ),
                    onOk: () => {
                        handleDialogConfirm({
                            equityConfigId,
                            whitelistUri,
                            expirationTime,
                            parkIdList
                        })//确认按钮的回调方法，在下面
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            })
        }
    };

    const handleDialogConfirm = (_data:any) => {
        importEquity(_data).then((data:any) => {

        })
    }

    const getEquityList = () => {
        let _data ={}
        equityConfigList(_data).then((data:any) => {
            setEquityList(data.data.map((item:any) => ({
                value:item.id,
                label:item.equityLevel
            })))
        })
    }

    const handleUpload= ({ file,fileList,event }:any) => {
        const { response } = file;
        if(response){
            if(response.status == 1000){

            }
        }
        console.log(response);
    };

    const handleRemove= ({ file,fileList,event }:any) => {
        console.log(file);
    };

    const normFile = ({ file,fileList,event }:any) => {
        const { response } = file;
        if(response){
            if(response.status == 1000){
                return response.data.fileUri
            }
        }
        return ;
    };

    useEffect(() => {
        getEquityList()
    },[]);

    return (
         <div className="equity-container">
             <div className="breadcrumb-container line">
                 <div className="breadcrumb-cell">
                     <div onClick={ () => history.go(-1) }><LeftOutlined />返回</div>
                     <div>{ params.type == 'single' ? '发放权益金':'批量导入权益金' }</div>
                 </div>
             </div>
             <Form form={ submitForm } {...layout} className="form-container" name="nest-messages" onFinish={ onFinish } validateMessages={validateMessages}>
                 {
                     params.type == 'single' &&
                     <>
                         <Form.Item name="plateNo" label="车牌号" rules={[{ required: true }]}>
                             <Input maxLength={ 20 } placeholder="请输入车牌号" />
                         </Form.Item>
                         <Form.Item name="plateColor" label="车牌颜色" rules={[{ required: true }]}>
                             <Select
                                     placeholder="请选择"
                                     allowClear>
                                 {
                                     colorList.map((item:any,index:number) => {
                                       return  <Option value={ index } key={ index }>{ item }</Option>
                                     })
                                 }
                             </Select>
                         </Form.Item>
                     </>
                 }
                 <Form.Item name="equityConfigId" label="权益等级" rules={[{ required: true }]}>
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
                 {
                     params.type == 'batch' &&
                     <Form.Item name="whitelistUri" label="车牌号" getValueFromEvent={ normFile } className="upload-container" wrapperCol={{ span:18 }} rules={[{ required: true }]}>
                         <Upload name="file"
                                 className="upload-wrapper"
                                 action={ site.upload + "/upload/etc-coupon"}
                                 data={{ type:"etc-equity" }}
                                 headers = {{ token:userToken }}
                                 onRemove = { handleRemove }
                                 onChange={ handleUpload }>
                             <Button>选择文件</Button> <span className="upload-template">请按照<i>模板</i>上传</span>
                             <p className="upload-txt">支持.xls, .xlsx, .csv格式长传，单次上传上限1000行，请勿删除模板表头</p>
                         </Upload>


                     </Form.Item>
                 }
                 <Form.Item name="expirationTime" label="截止时间" rules={[{ required: true }]}>
                     <DatePicker />
                 </Form.Item>
                 <Form.Item name="parkIdList" label="可用停车场" rules={[{ required: true,message:'至少选择一个停车场' }]} wrapperCol={{ span:18 }}>
                     <FormTable />
                 </Form.Item>
                 <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                     <Button type="primary" htmlType="submit">
                         保存
                     </Button>
                 </Form.Item>
             </Form>
             {contextHolder}
         </div>
    );
}

interface Props  {
    userToken:string
}

const mapStateToProps = (state:any) => ({
    userToken:state.user.token
})

export default connect(mapStateToProps,{})(Equity)
