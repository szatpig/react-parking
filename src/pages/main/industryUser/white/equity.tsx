// Created by szatpig at 2020/5/6.
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux'

import moment from 'moment';

import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button, DatePicker, Table, Checkbox, Cascader, Upload, Modal, message } from 'antd';

import Dayjs from 'dayjs';
import XLSX from 'xlsx'

import site from '@/utils/config'
import { getParkingDetailByBusinessId } from '@/api/common-api'
import {equityConfigList, grantConfirmData , grantEquity, parseWhitelist, importEquity} from '@/api/industryUser/white-api'
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
        ellipsis:true,
        fixed:true,
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
        width:160
    },
    {
        title: '终止日期',
        dataIndex: 'endDate',
        width:160
    }
];

interface TableProps {
    value?: any[];
    onChange?: (value: any[]) => void;
}

const FormTable:React.FC<TableProps> = ({ value = {}, onChange })=>{
    const [selectedRow, setSelectedRow] = useState([]);
    const [rowPages, setRowPages] = useState<object>({
        0:[]
    });
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
        setRowPages({
            ...rowPages,
            [page.current]:selectedRowKeys
        })
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
            triggerChange(Object.values(rowPages).reduce((current,sum) => sum.concat(current)))
        }
    }
    const onSelectAll = (row:any) => ({
        disabled: tableSelect, // Column configuration not to be checked
    })

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

    useEffect(() => {
        let temp = Object.values(rowPages).reduce((current,sum) => sum.concat(current))
        setSelectedRow(temp);
        if(temp.length > 0){
            triggerChange(temp)
        }
    },[rowPages]);

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
                            <Button type="primary"  htmlType="button" onClick={ handleQuery }>查询</Button>
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
                <Table rowKey="id"
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

function Equity(props:Props) {
    const history = useHistory();
    const params:{type:string} = useParams();
    const [ submitForm ] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();
    const [equityList, setEquityList] = useState([]);
    const [fileList, setFileList] = useState<any[]>([]);

    const{ userToken } = props

    const disabledDate = (current:any) => {
        // Can not select days before today and today
        return current && current < moment().endOf('day');
    }

    const onFinish = (values:any) => {
        let { plateNo,plateColor,equityConfigId,whitelistUri,expirationTime,parkIdList } =  values,
                parkIdListSearch = !Array.isArray(parkIdList)? parkIdList:{};

        parkIdList = Array.isArray(parkIdList)?parkIdList.join(','):''
        if(params.type === 'single'){
            let _data ={
                plateNo,
                equityConfigId
            }
            grantConfirmData(_data).then((data:any) => {
                const { industryUserName, equityBalance, currentAvailableCount, equityUserCount, grandCount, newCount, totalAmount } = data.data
                modal.confirm({
                    icon:<ExclamationCircleOutlined />,
                    title: '发放确认',
                    className:'import-dialog-container',
                    okText:'确认发放',
                    cancelText:'取消',
                    content: (
                            <div className="import-dialog-wrapper">
                                <div className="import-cell">
                                    <p>行业信息</p>
                                    <div className="import-content">
                                        <p><span>行业用户名称：</span>{ industryUserName }</p>
                                        <p><span>权益余额：</span>{ equityBalance }元</p>
                                        <p><span>当前有效白名单：</span>{ currentAvailableCount } 个</p>
                                        <p><span>白名单上限：</span>{ equityUserCount } 个</p>
                                    </div>
                                </div>
                                <div className="import-cell">
                                    <p>发放信息</p>
                                    <div className="import-content">
                                        <p><span>共计：</span>{ grandCount } 笔</p>
                                        <p><span>其中新增白名单：</span>{ newCount }个</p>
                                        <p><span>权益金额总计：</span>{ totalAmount }元</p>
                                    </div>
                                </div>
                            </div>
                    ),
                    onOk: () => {
                        handleDialogSingleConfirm({
                            plateNo,
                            plateColor,
                            equityConfigId,
                            expirationTime:Dayjs(expirationTime).format('YYYY-MM-DD 23:59:59'),
                            parkIdList,
                            parkIdListSearch
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
            }
            parseWhitelist(_data).then((data:any) => {
                const { industryUserName, equityBalance, currentAvailableCount, equityUserCount, importCount, newCount, totalAmount } = data.data
                modal.confirm({
                    icon:<ExclamationCircleOutlined />,
                    title: '导入确认',
                    className:'import-dialog-container',
                    okText:'确认导入',
                    cancelText:'取消',
                    content: (
                            <div className="import-dialog-wrapper">
                                <div className="import-cell">
                                    <p>行业信息</p>
                                    <div className="import-content">
                                        <p><span>行业用户名称：</span>{ industryUserName }</p>
                                        <p><span>权益余额：</span>{ equityBalance }元</p>
                                        <p><span>当前有效白名单：</span>{ currentAvailableCount }个</p>
                                        <p><span>白名单上限：</span>{ equityUserCount }个</p>
                                    </div>
                                </div>
                                <div className="import-cell">
                                    <p>导入信息</p>
                                    <div className="import-content">
                                        <p><span>共计：</span>{ importCount } 笔</p>
                                        <p><span>其中新增白名单：</span>{ newCount }个</p>
                                        <p><span>权益金额总计：</span>{ totalAmount }元</p>
                                    </div>
                                </div>
                            </div>
                    ),
                    onOk: () => {
                        handleDialogConfirm({
                            equityConfigId,
                            whitelistUri,
                            expirationTime:Dayjs(expirationTime).format('YYYY-MM-DD 23:59:59'),
                            parkIdList,
                            parkIdListSearch
                        })//确认按钮的回调方法，在下面
                    },
                    onCancel() {
                        console.log('Cancel');
                    },
                });
            })
        }
    };

    const handleDialogSingleConfirm = (_data:any) => {
        grantEquity(_data).then((data:any) => {
            message.success('发放成功');
            history.replace('/home/white')
        })
    }

    const handleDialogConfirm = (_data:any) => {
        importEquity(_data).then((data:any) => {
            message.success('导入成功');
            history.replace('/home/white')
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

    const onFileChange= ({ file,fileList,event }:any) => {
        // setFileList(fileList);
        // console.log(file);
    };

    const handleRemove= ({ file,fileList,event }:any) => {
        setFileList([]);
    };

    const handleBeforeUpload =(file:any,_fileList:any)=>{
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error( '超过2M限制，不允许上传');
            return Promise.reject(false);
        }
        const fileType = '.xls, .xlsx';
        if(fileType.indexOf(file.name.split(/\./)[1]) === -1){
            message.error( '仅支持上传.xls, .xlsx格式');
            return Promise.reject(false);
        }

        let _reader = new FileReader();
        _reader.readAsBinaryString(file);

        _reader.onloadend = (evt:any) => {
            let _text = evt.target.result;
            let wb = XLSX.read(_text,{type:'binary'});
            let _data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
            console.log(_data)
            // _text = _text.split('-').filter((item:any)=>item);
            //
            // // 判断表头不能删除
            // if(!_text[0] || _text[0].indexOf("勿删表头")==-1){
            //     message.error('【'+ file.name +'】表请勿删除表头');
            //     return Promise.reject(false);
            // }else{
            //     _text.shift();
            // }
            //
            // // 判断导入数
            // if(_text.length > 1000){
            //     message.error("单次导入不要超过1000条");
            //     return Promise.reject(false);
            // }

        };

        setFileList([file]);
        return true ;
    };

    const normFile = ({ file,fileList,event }:any) => {
        if(file.status === 'uploading') return false;
        if(file.status === 'removed') return ;
        const { response } = file;
        if(response){
            if(response.status === 1000){
                return response.data.filePath
            }
        }
        return ;
    };

    const handleDownLoad = (e:any) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        const aLink = document.createElement('a');
        document.body.appendChild(aLink);
        aLink.style.display='none';
        aLink.target = '_blank'
        aLink.href = site.exeUrl + '/internal/template/download/coupon/批量导入白名单.xls';
        aLink.click();
        document.body.removeChild(aLink);
    }

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
                     params.type === 'single' &&
                     <>
                         <Form.Item name="plateNo" label="车牌号" rules={[{ required: true,whitespace: true }]}>
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
                     params.type === 'batch' &&
                     <Form.Item name="whitelistUri"
                            label="文件"
                            getValueFromEvent={ normFile }
                            className="upload-container"
                            wrapperCol={{ span:18 }}
                            rules={[{ required: true }]}>
                         <Upload name="file"
                                 accept=".xls, .xlsx, .csv"
                                 className="upload-wrapper"
                                 action={ site.upload + "/upload/etc-coupon"}
                                 data={{ type:"etc-equity" }}
                                 headers = {{ token:userToken }}
                                 fileList={ fileList }
                                 beforeUpload = { handleBeforeUpload }
                                 onRemove = { handleRemove }
                                 onChange={ onFileChange }>
                             <Button>选择文件</Button> <span onClick={ handleDownLoad } className="upload-template">请按照<i>模板</i>上传</span>
                             <p className="upload-txt">支持.xls, .xlsx格式长传，单次上传上限1000行，请勿删除模板表头</p>
                         </Upload>
                     </Form.Item>
                 }
                 <Form.Item label="截止时间" required>
                     < Form.Item name="expirationTime" noStyle  rules={[{required: true,message:'请选择截止日期'}]}>
                         <DatePicker disabledDate={ disabledDate }/>
                     </Form.Item>
                     &nbsp;&nbsp;23:59:59
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
