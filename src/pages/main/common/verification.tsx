// Created by szatpig at 2020/6/20.
import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from 'react';
import {Drawer, Button, Input, Empty, Form, message, InputNumber} from 'antd';

import { humanVerifyList, humanVerify } from "@/api/admin/merchant-api";

const couponTypeList:any = {
    FIX_DEDUCT:'固定抵扣金额券',
    DISCOUNT_DEDUCT:'按比例折扣',
    TIME_DEDUCT:'次数抵扣',
}

const colorList:any = ['蓝色','黄色','黑色','白色','渐变绿色','黄绿双拼色','蓝白渐变色']


const { Search } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const VerificationForm = (props:any) =>{

    const { type,amount,couponNo } = props

    const onFinish = (values:any) => {
        console.log('Success:', values);
        let _data ={
            couponId:couponNo,
            ...values
        }
        humanVerify(_data).then(data => {
            message.success('核销成功');
        })
    };

    return(
        <Form
            {...layout}
            name="verifictionForm"
            initialValues={{
                parkingAmount:0,
                couponNo:couponNo
            }}
            onFinish={ onFinish }>
            {
                type !== 'FIX_DEDUCT' &&
                    <>
                        <Form.Item label="停车总额">
                            <Form.Item
                                    name="parkingAmount"
                                    noStyle
                                    rules={[
                                        { required: true,whitespace: true, type:'number', message: '请输入数字' }
                                    ]}
                            >
                                <InputNumber min={0} max={ 99999999 } step={ 5.00 }  maxLength={ 8 } placeholder="请输入金额" style={{ width: 160 }}/>
                            </Form.Item> &nbsp;&nbsp;元
                        </Form.Item>
                        <Form.Item label="核销金额" >
                            { amount } 元
                        </Form.Item>
                        <Form.Item label="还需支付" shouldUpdate={(prevValues, currentValues) => prevValues.parkingAmount !== currentValues.parkingAmount}>
                            {
                                ({ getFieldValue }) => {
                                    console.log(getFieldValue('parkingAmount'))
                                    return (getFieldValue('parkingAmount') - amount > 0 ? (getFieldValue('parkingAmount') - amount).toFixed(2) : 0) + ' 元'
                               }
                            }
                        </Form.Item>
                    </>
            }
            <Form.Item >
                <Button type="primary" htmlType="submit">
                    确定核销
                </Button>
            </Form.Item>
        </Form>
    )
}

const Verification = forwardRef((props:any,ref:any) => { //react hooks 通过 forwardRef 直接暴露组件
    const InputRef:any = useRef();
    useImperativeHandle(ref, () => ({
        show: () => {
            showDrawer() // 这里给父组件方法不一定是用dom的方法，可以使用自己const的方法
        }
    }));
    const [searchValue, setSearchValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [tableData,setTableData] = useState<object[]>([]);
    const [index,setIndex] = useState<number>(-1);

    const handleSelect = (i:number) => {
        setIndex(i);
    };
    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };
    const onSearch = (value:string) => {
        list(value)
    };
    const list = (plateNo:string) => {
        let _data={
            plateNo
        };
        humanVerifyList(_data).then((data:any) => {
            setTableData(data.data.list);
            if(data.data.list && data.data.list.length == 1){
                handleSelect(data.data.list[0].id)
            }
        })
    };
    useEffect(() => {
        console.log(InputRef);
        setSearchValue('');
        setTableData([])
    },[visible]);

    return (
            <div className="drawer-component-container">
                <Drawer
                        title="人工核销"
                        placement="right"
                        onClose={ onClose }
                        visible={ visible }
                        width={ 506 }
                        className="drawer-container"
                >
                    <div className="drawer-wrap">
                        <div className="search-item flex">
                            <span>车牌号</span>
                            <Search
                                placeholder="请输入车牌号"
                                onSearch={ onSearch } />
                        </div>
                        <div className="list-item">
                            {
                                tableData.length > 0 ?
                                        <>
                                            {
                                                tableData.map((item:any) => {
                                                       return(
                                                           <div key={ item.id } className={`ticket-wrap ${ index == item.id ? 'selected' : null}`} onClick={ ()=> handleSelect(item.id) }>
                                                               <p className="ticket-title">{ couponTypeList[item.couponType] }
                                                                   { item.couponType === 'FIX_DEDUCT' && <i>（{ item.couponAmount } 元）</i> }
                                                                   { item.couponType === 'DISCOUNT_DEDUCT' && <i>（上限{ item.couponAmount } 元）</i> }
                                                                   { item.couponType === 'TIME_DEDUCT' && <i>（上限{ item.couponAmount } 元）</i> }
                                                               </p>
                                                               <p className="flex between">
                                                                   <span>车牌号：{ item.plateNo }（{ colorList[item.plateColor] }）</span>
                                                                   <span>券码：{ item.couponNo }</span>
                                                               </p>
                                                               {
                                                                   item.couponType === 'DISCOUNT_DEDUCT' ?
                                                                       <>
                                                                           <p className="flex between">
                                                                               <span>上限金额：{ item.couponAmount }元</span>
                                                                               <span>折扣：{ item.discount }</span>
                                                                           </p>
                                                                           <p>截止时间：{ item.expirationTime }</p>
                                                                       </>:
                                                                       <p className="flex between">
                                                                           <span>{`${ item.couponType === 'DISCOUNT_DEDUCT' ? '上限':'' }金额`}：{ item.couponAmount }元</span>
                                                                           <span>截止时间：{ item.expirationTime }</span>
                                                                       </p>
                                                               }

                                                               <p className="flex ticket-parking">
                                                                   <span>可用停车场：</span><span>{ item.parkingNames }</span>
                                                               </p>
                                                               {
                                                                   index === item.id &&
                                                                   <div className={ `collapsed active ${ item.couponType == 'FIX_DEDUCT' ? 'noborder' :'' }` }>
                                                                       <VerificationForm key={ item.id } couponNo={ item.id } amount={ item.couponAmount } type={ item.couponType } />
                                                                   </div>
                                                               }
                                                           </div>
                                                       )
                                                })
                                            }





                                        </>:
                                        <Empty />
                            }
                        </div>
                    </div>
                </Drawer>
            </div>
    );
})

export default Verification
