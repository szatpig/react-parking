// Created by szatpig at 2020/6/18.
import React, {useState, useEffect} from 'react';
import { useParams, useHistory, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux'

import { LeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Button,Radio, Cascader, Upload, Modal, message } from 'antd';

import {commercialUserEdit, commercialUserAdd , getCommercialUserById} from '@/api/industryUser/store-api'

import region from '@/json/region'

import site from '@/utils/config'

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
    const [modal, contextHolder] = Modal.useModal();
    const [ submitForm ] = Form.useForm();
    const [picturesLists, setPicturesLists] = useState([]);
    const [certificateLists, setCertificateLists] = useState([]);
    const [permitLists, setPermitLists] = useState([]);

    const{ userToken } = props

    const onFinish = (values:any) => {
        let { region,...others } = values,
                [province, city, area]= region || [],
                _data ={
                    ...others,
                    province, city, area
                }
                console.log(values)
        return false;
        if(id > 0){
            commercialUserEdit({
                id,
                ..._data
            }).then((data:any) => {
                message.success('编辑成功');
                history.replace('/home/store')
            })
        }else{
            commercialUserAdd(_data).then((data:any) => {
                modal.success({
                    title: '用户添加成功',
                    className:'import-dialog-container',
                    content: (
                            <div className="import-dialog-wrapper password-dialog-wrapper">
                                <div className="import-cell">
                                    <p>请使用下方账号和默认密码登录系统</p>
                                    <div className="import-content">
                                        <p><span>登录地址：</span><a target="_blank" href={ data.data.loginUserAddress }>{ data.data.loginUserAddress }</a></p>
                                        <p><span>用户账号：</span>{ data.data.userName }</p>
                                        <p><span>默认密码：</span>{ data.data.password }</p>
                                    </div>
                                </div>
                            </div>
                    ),
                    onOk: () => {
                        history.replace('/home/store')
                    }
                });
            })
        }
    };

    const getUserInfo = () => {
        if(id < 1) return false;
        let _data ={
            id
        }
        getCommercialUserById(_data).then((data:any) => {
            let { province, city, area,pictures,certificateList,permitList,...others } = data.data,
            region = [province, city, area] || [];
            pictures = pictures.map((item:any) => ({
                uid:item.id,
                url:site.imagesUrl + item.image
            }));
            certificateList = certificateList.map((item:any) => ({
                uid:item.id,
                url:site.imagesUrl + item.image
            }))
            permitList = permitList.map((item:any) => ({
                uid:item.id,
                url:site.imagesUrl + item.image
            }))
            // setPicturesLists(pictures)
            // setCertificateLists(certificateList)
            // setPermitLists(permitList)
            submitForm.setFieldsValue({
                ...others,
                pictures,
                certificateList,
                permitList,
                region,
            })
        })
    }

    const handleBeforeUpload =(file:any,fileList:any)=>{
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

        // console.log('onFileChange',fileList,file);
        // if(file.status === 'done'){
        //     const { response } = file;
        //     if(response.status === 1000){
        //         setPicturesLists(fileList.map((item:any) => item.response.data))
        //     }
        //
        // }
    };
    const handlePreview= (file:any) => {
        console.log(file)
        modal.success({
            title: '图片查看',
            className:'import-dialog-container',
            content: (
                    <div className="import-dialog-wrapper password-dialog-wrapper">

                    </div>
            ),
            onOk: () => {
                history.replace('/home/store')
            }
        });
    };
    const normFile = ({ file,fileList,event }:any) => {
        console.log(1111,file)
        if(file.status === 'uploading') return false;
        const { response } = file;
        console.log('normFile',fileList);
        if(response){
            if(response.status === 1000){
                return fileList.map((item:any) => item.response.data);
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
                        <div>{ id > 0 ? '编辑商户':'添加商户' }</div>
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
                               className="upload-container upload-multiple-container"
                               wrapperCol={{ span:18 }}>
                        <Upload name="file"
                                className="upload-wrapper"
                                accept=".jpeg, .jpg, .png, gif, .bmp"
                                action={ site.upload + "/commercialUser/uploadEntryFile"}
                                headers = {{ token:userToken }}
                                showUploadList={ true }
                                listType="picture-card"
                                fileList={ certificateLists }
                                beforeUpload = { handleBeforeUpload }
                                onPreview={ handlePreview }
                                onChange={ onFileChange }>
                            <Button>上传图片</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="certificateList"
                               label="营业执照"
                               getValueFromEvent={ normFile }
                               className="upload-container  upload-multiple-container"
                               wrapperCol={{ span:18 }}>
                        <Upload name="file"
                                className="upload-wrapper"
                                accept=".jpeg, .jpg, .png, gif, .bmp"
                                action={ site.upload + "/commercialUser/uploadEntryFile"}
                                headers = {{ token:userToken }}
                                showUploadList={ true }
                                fileList={ certificateLists }
                                listType="picture-card"
                                beforeUpload = { handleBeforeUpload }
                                onChange={ onFileChange }>
                            <Button>上传图片</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item name="permitList"
                               label="开业许可证"
                               getValueFromEvent={ normFile }
                               className="upload-container upload-multiple-container"
                               wrapperCol={{ span:18 }}>
                        <Upload name="file"
                                className="upload-wrapper"
                                accept=".jpeg, .jpg, .png, gif, .bmp"
                                action={ site.upload + "/commercialUser/uploadEntryFile"}
                                headers = {{ token:userToken }}
                                showUploadList={ true }
                                fileList={ permitLists }
                                listType="picture-card"
                                beforeUpload = { handleBeforeUpload }
                                onChange={ onFileChange }>
                            <Button>上传图片</Button>
                        </Upload>
                    </Form.Item>
                    <p className="form-title">创建商户账号</p>
                    <Form.Item name="username" label="账号名" rules={[
                        { required: true,whitespace: true,pattern:/^[a-zA-Z]+[\w]{2,19}$/, message: '请输入以字母开头3-20位，可包含数字、字母、下划线' },
                    ]}>
                        <Input disabled={ id > 0 } maxLength={ 20 } placeholder="请输入以字母开头3-20位，可包含数字、字母、下划线" />
                    </Form.Item>

                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
                { contextHolder }
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
