// Created by szatpig at 2020/6/18.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux'

import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button,Radio, Cascader, Upload, Modal, message } from 'antd';

import site from '@/utils/config'
import {commercialUserEdit, commercialUserAdd , getCommercialUserById} from '@/api/industryUser/store-api'

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
    const { id } = useParams();
    const [ submitForm ] = Form.useForm();
    const [userInfo, setUserInfo] = useState([]);
    const [fileList, setFileList] = useState<any[]>([]);

    const{ userToken } = props

    const onFinish = (values:any) => {
        let { name,username,address,contact,phone,region,invoiced,pictures,certificateList,permitList } = values,
                [province, city, area]= region || [],
                _data ={
                    name,username,address,contact,phone,
                    province, city, area,pictures,certificateList,permitList
                }
        if(!!!id){
            commercialUserAdd(_data).then((data:any) => {
                message.success('发放成功');
                history.replace('/home/white')
            })
        }else{
            commercialUserEdit({
                id,
                ..._data
            }).then((data:any) => {
                message.success('发放成功');
                history.replace('/home/white')
            })
        }
    };

    const getUserInfo = () => {
        if(!!!id) return false;
        let _data ={
            id
        }
        getCommercialUserById(_data).then((data:any) => {
            setUserInfo(data.data)
        })
    }

    const handleRemove= ({ file,fileList,event }:any) => {
        setFileList([]);
    };

    const handleBeforeUpload =(file:any,_fileList:any)=>{
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            message.error( '超过1M限制，不允许上传');
            return Promise.reject(false);
        }
        const fileType = '.jpeg, .jpg, .png, gif, .bmp';
        if(fileType.indexOf(file.name.split(/\./)[1]) === -1){
            message.error( '仅支持上传.jpeg, .jpg, .png, gif, .bmp格式');
            return Promise.reject(false);
        }
        return true ;
    };
    const onFileChange= ({ file,fileList,event }:any) => {
        // setFileList(fileList);
        console.log(file);
        if(file.status === 'done'){

        }
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
        getUserInfo()
    },[]);

    return (
            <div className="store-detail-container">
                <div className="breadcrumb-container line">
                    <div className="breadcrumb-cell">
                        <div onClick={ () => history.go(-1) }><LeftOutlined />返回</div>
                        <div>{ !!!id ? '添加商户':'编辑商户' }</div>
                    </div>
                </div>
                <Form form={ submitForm }
                      {...layout}
                      className="form-container"
                      name="nest-messages"
                      onFinish={ onFinish }
                      validateMessages={validateMessages}
                      initialValues={{
                        invoiced:0
                      }}>
                    <p className="form-title">基本信息</p>
                    <p className="form-tips">图片格式支持支持.jpg\.png\.jpeg 格式文件，最多3张，不超过1MB</p>
                    <Form.Item name="name" label="商户名称" rules={[
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

                    <Form.Item name="contact" label="联系人"  rules={[{ required: true,whitespace: true }]}>
                        <Input maxLength={ 20 } placeholder="请输入联系人" />
                    </Form.Item>

                    <Form.Item name="phone" label="联系电话" rules={[
                        { required: true,whitespace: true },
                        { pattern: /^(((\d{2}-)?0\d{2,3}-?\d{7,8})|((\d{2}-)?(\d{2,3}-)?([1][3-9][0-9]\d{8})))$/g}
                    ]}>
                        <Input maxLength={ 15 } placeholder="请输入联系电话" />
                    </Form.Item>
                    <Form.Item name="invoiced" label="是否开具发票">
                        <Radio.Group>
                            <Radio value={ 1 }>是</Radio>
                            <Radio value={ 0 }>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="pictures"
                               label="商户图片"
                               getValueFromEvent={ normFile }
                               className="upload-container"
                               wrapperCol={{ span:18 }}>
                        <Upload name="logo"
                                className="upload-wrapper"
                                accept=".jpeg, .jpg, .png, gif, .bmp"
                                action={ site.upload + "/commercialUser/uploadEntryFile"}
                                headers = {{ token:userToken }}
                                showUploadList={ false }
                                beforeUpload = { handleBeforeUpload }
                                onChange={ onFileChange }>
                            <Button>上传图片</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="certificateList"
                               label="营业执照"
                               getValueFromEvent={ normFile }
                               className="upload-container"
                               wrapperCol={{ span:18 }}>
                        <Upload name="logo"
                                className="upload-wrapper"
                                accept=".jpeg, .jpg, .png, gif, .bmp"
                                action={ site.upload + "/commercialUser/uploadEntryFile"}
                                headers = {{ token:userToken }}
                                showUploadList={ false }
                                beforeUpload = { handleBeforeUpload }
                                onChange={ onFileChange }>
                            <Button>上传图片</Button>
                        </Upload>
                        <p><img src='' alt=""/></p>
                    </Form.Item>
                    <Form.Item name="permitList"
                               label="开业许可证"
                               getValueFromEvent={ normFile }
                               className="upload-container"
                               wrapperCol={{ span:18 }}>
                        <Upload name="logo"
                                className="upload-wrapper"
                                accept=".jpeg, .jpg, .png, gif, .bmp"
                                action={ site.upload + "/commercialUser/uploadEntryFile"}
                                headers = {{ token:userToken }}
                                showUploadList={ false }
                                beforeUpload = { handleBeforeUpload }
                                onChange={ onFileChange }>
                            <Button>上传图片</Button>
                        </Upload>
                    </Form.Item>
                    <p className="form-title">创建商户账号</p>
                    <Form.Item name="username" label="账号名" rules={[
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
