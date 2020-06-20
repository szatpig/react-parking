// Created by szatpig at 2020/6/20.
import React, {useState, useEffect, useRef, useImperativeHandle, forwardRef} from 'react';
import { Drawer, Button, Input, Empty,Form } from 'antd';

const { Search } = Input;

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const VerificationForm = (props:any) =>{

    const { type } = props

    const onFinish = (values:any) => {
        console.log('Success:', values);
    };

    return(
        <Form
            {...layout}
            name="verifictionForm"
            onFinish={ onFinish }>
            {
                type > 1 &&
                    <>
                        <Form.Item label="停车总额">
                            <Form.Item
                                    name="username"
                                    noStyle
                                    rules={[{ required: true, message: '请输入金额' }]}
                            >
                                <Input style={{ width: 160 }} />
                            </Form.Item> &nbsp;&nbsp;元
                        </Form.Item>
                        <Form.Item label="核销金额" >
                            { 8 } 元
                        </Form.Item>
                        <Form.Item label="还需支付">
                            { 0 } 元
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
    const drawerRef:any = useRef();
    useImperativeHandle(ref, () => ({
        show: () => {
            showDrawer() // 这里给父组件方法不一定是用dom的方法，可以使用自己const的方法
        }
    }));
    const [visible, setVisible] = useState(false);
    const [tableData,setTableData] = useState<object[]>([{}]);
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
    const list = (value:string) => {

    };

    useEffect(() => {
        //do something
        console.log(drawerRef.current)
    });

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
                                tableData.length ?
                                        <>
                                            <div className={`ticket-wrap ${index == 1 ? 'selected' : null}`} onClick={ ()=> handleSelect(1) }>
                                                <p className="ticket-title">金额券 <i>（{ 12 } 元）</i></p>
                                                <p className="flex between">
                                                    <span>车牌号：苏E123511（蓝牌）</span>
                                                    <span>券码：CPU12252222000220202</span>
                                                </p>
                                                <p className="flex between">
                                                    <span>金额：10元</span>
                                                    <span>截止时间：2020–02–21 19:22:09</span>
                                                </p>
                                                <p className="flex ticket-parking">
                                                    <span>可用停车场：</span><span>可用停车场：苏州纳米大学停车场，苏州高新区停车场，苏州纳米大学停车场，苏州高新区停车场</span>
                                                </p>
                                                {
                                                    index === 1 &&
                                                    <div className="collapsed active noborder">
                                                        <VerificationForm type={ 1 } />
                                                    </div>
                                                }

                                            </div>
                                            <div className={`ticket-wrap ${index == 3 ? 'selected' : null}`} onClick={ ()=> handleSelect(3) }>
                                                <p className="ticket-title">次数券 <i>（上限{ 12 } 元）</i></p>
                                                <p className="flex between">
                                                    <span>车牌号：苏E123511（蓝牌）</span>
                                                    <span>券码：CPU12252222000220202</span>
                                                </p>
                                                <p className="flex between">
                                                    <span>金额：10元</span>
                                                    <span>截止时间：2020–02–21 19:22:09</span>
                                                </p>
                                                <p className="flex ticket-parking">
                                                    <span>可用停车场：</span><span>可用停车场：苏州纳米大学停车场，苏州高新区停车场，苏州纳米大学停车场，苏州高新区停车场</span>
                                                </p>
                                                {
                                                    index === 3 &&
                                                    <div className="collapsed active">
                                                        <VerificationForm type={ 3 } />
                                                    </div>
                                                }
                                            </div>
                                            <div className={`ticket-wrap ${index == 2 ? 'selected' : null}`} onClick={ ()=> handleSelect(2) }>
                                                <p className="ticket-title">折扣券 <i>（八折，上限{ 12 } 元）</i></p>
                                                <p className="flex between">
                                                    <span>车牌号：苏E123511（蓝牌）</span>
                                                    <span>券码：CPU12252222000220202</span>
                                                </p>
                                                <p className="flex between">
                                                    <span>金额：10元</span>
                                                    <span>折折：0.8</span>
                                                </p>
                                                <p>截止时间：2020–02–21 19:22:09</p>
                                                <p className="flex ticket-parking">
                                                    <span>可用停车场：</span><span>可用停车场：苏州纳米大学停车场，苏州高新区停车场，苏州纳米大学停车场，苏州高新区停车场</span>
                                                </p>
                                                {
                                                    index === 2 &&
                                                    <div className="collapsed active">
                                                        <VerificationForm type={ 2 } />
                                                    </div>
                                                }
                                            </div>
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
