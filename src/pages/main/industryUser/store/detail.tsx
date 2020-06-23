// Created by szatpig at 2020/6/18.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux'

import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button,Radio, DatePicker, Table, Checkbox, Cascader, Upload, Modal, message } from 'antd';

import site from '@/utils/config'
import { getParkingDetailByBusinessId } from '@/api/common-api'
import {equityConfigList, grantConfirmData , grantEquity, parseWhitelist, importEquity} from '@/api/industryUser/white-api'

import region from '@/json/region'
import XLSX from "xlsx";

const options = region;

const { Option } = Select;

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

function StoreDetail(props:Props) {
    const history = useHistory();
    const params:any = useParams();
    const [ submitForm ] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();
    const [equityList, setEquityList] = useState([]);
    const [fileList, setFileList] = useState<any[]>([]);

    const{ userToken } = props

    const onFinish = (values:any) => {
        let { plateNo,plateColor,equityConfigId,whitelistUri,expirationTime,parkIdList } =  values,
                parkIdListSearch = !Array.isArray(parkIdList)? parkIdList:{};

        parkIdList = Array.isArray(parkIdList)?parkIdList.join(','):''
        if(params.id === 0){
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
                equityConfigId
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
                                        <p><span>权益余额总计：</span>{ totalAmount }元</p>
                                    </div>
                                </div>
                            </div>
                    ),
                    onOk: () => {
                        handleDialogConfirm({
                            equityConfigId,
                            whitelistUri,
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

    useEffect(() => {
        getEquityList()
    },[]);

    return (
            <div className="store-detail-container">
                <div className="breadcrumb-container line">
                    <div className="breadcrumb-cell">
                        <div onClick={ () => history.go(-1) }><LeftOutlined />返回</div>
                        <div>{ params.id === 0 ? '添加商户':'编辑商户' }</div>
                    </div>
                </div>
                <Form form={ submitForm } {...layout} className="form-container" name="nest-messages" onFinish={ onFinish } validateMessages={validateMessages}>
                    <p className="form-title">基本信息</p>
                    <p className="form-tips">图片格式支持支持.jpg\.png\.jpeg 格式文件，最多3张，不超过1MB</p>
                    <Form.Item name="plateNo" label="商户名称" rules={[
                        { required: true,whitespace: true },
                        { pattern:/^[\w\u4e00-\u9fa5()（）]{3,20}$/, message: '请输入3-20位字符'}
                    ]}>
                        <Input maxLength={ 20 } placeholder="请输入商户名称" />
                    </Form.Item>
                    <div className="address-item">
                        <Form.Item label="商户地址" className="region-wrap" name="region" required wrapperCol={{ span: 9 }} rules={[
                            { type:'array', whitespace: true,validateTrigger:'blur' }
                        ]}>
                            <Cascader options={ options } placeholder="请选择省市区" />
                        </Form.Item>
                        <Form.Item name="address" className="address-wrap" labelCol={{ span:0 }} rules={[
                            { required: true, whitespace: true,message:'请完善商户地址' }
                        ]}>
                            <Input placeholder="详情地址" maxLength={ 18 } />
                        </Form.Item>
                    </div>

                    <Form.Item name="plateNo" label="联系人"  rules={[{ required: true,whitespace: true }]}>
                        <Input maxLength={ 20 } placeholder="请输入联系人" />
                    </Form.Item>

                    <Form.Item name="plateNo" label="联系电话" rules={[
                        { required: true,whitespace: true },
                        { pattern: /^(((\d{2}-)?0\d{2,3}-?\d{7,8})|((\d{2}-)?(\d{2,3}-)?([1][3-9][0-9]\d{8})))$/g}
                    ]}>
                        <Input maxLength={ 15 } placeholder="请输入联系电话" />
                    </Form.Item>
                    <Form.Item name="commissionInvoice" label="是否开具发票">
                        <Radio.Group>
                            <Radio value="1">是</Radio>
                            <Radio value="0">否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="merchantUrl"
                               label="商户图片"
                               getValueFromEvent={ normFile }
                               className="upload-container"
                               wrapperCol={{ span:18 }}>
                        <Upload name="logo"
                                className="upload-wrapper"
                                accept=".jpeg, .jpg, .png, gif, .bmp"
                                action={ site.upload + "/businessAccount/uploadLogo"}
                                headers = {{ token:userToken }}
                                showUploadList={ false }
                                beforeUpload = { handleBeforeUpload }
                                onChange={ onFileChange }>
                            <Button>上传图片</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="storeUrl"
                               label="营业执照"
                               getValueFromEvent={ normFile }
                               className="upload-container"
                               wrapperCol={{ span:18 }}>
                        <Upload name="logo"
                                className="upload-wrapper"
                                accept=".jpeg, .jpg, .png, gif, .bmp"
                                action={ site.upload + "/businessAccount/uploadLogo"}
                                headers = {{ token:userToken }}
                                showUploadList={ false }
                                beforeUpload = { handleBeforeUpload }
                                onChange={ onFileChange }>
                            <Button>上传图片</Button>
                        </Upload>
                        <p><img src='' alt=""/></p>
                    </Form.Item>
                    <Form.Item name="openUrl"
                               label="开业许可证"
                               getValueFromEvent={ normFile }
                               className="upload-container"
                               wrapperCol={{ span:18 }}>
                        <Upload name="logo"
                                className="upload-wrapper"
                                accept=".jpeg, .jpg, .png, gif, .bmp"
                                action={ site.upload + "/businessAccount/uploadLogo"}
                                headers = {{ token:userToken }}
                                showUploadList={ false }
                                beforeUpload = { handleBeforeUpload }
                                onChange={ onFileChange }>
                            <Button>上传图片</Button>
                        </Upload>
                    </Form.Item>
                    <p className="form-title">创建商户账号</p>
                    <Form.Item name="storeAccount" label="账号名" rules={[
                        { required: true,whitespace: true,pattern:/^[a-zA-Z]+[\w]{2,19}$/, message: '请输入以字母开头3-20位，可包含数字、字母、下划线' },
                    ]}>
                        <Input maxLength={ 20 } placeholder="请输入以字母开头3-20位，可包含数字、字母、下划线" />
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


interface Props  {
    userToken:string
}

const mapStateToProps = (state:any) => ({
    userToken:state.user.token
})

export default connect(mapStateToProps,{})(StoreDetail)
