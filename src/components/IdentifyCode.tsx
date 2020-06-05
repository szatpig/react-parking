// Created by szatpig at 2019/8/22.
import React, { Component } from 'react';
import EnhanceWithClickOutside from 'react-click-outside';
import { ReloadOutlined } from '@ant-design/icons';

import baseConfig from '@/utils/config'

class IdentifyCode extends Component<Props, State> {

    codeImg = null;
    codeImgRef = (el:any) => this.codeImg =  el

    state:State = {
        codeUrl:'',
        number:0,
        show:false,
        codeArray:[]
    };


    componentDidMount() {
        this.setState({
            show:true
        })
        this.handleGetCode()
    }

    componentWillUnmount() {
    }

    componentDidUpdate(prevProps:Props, prevState:State) {
        console.log('prevProps:',this.props.error !== prevProps.error);
        if (this.props.error !== prevProps.error) {
            this.handleGetCode()
        }
    }

    //*********************************************************** */
    //验证码模块开始************************************************/
    //*********************************************************** */
    handleGetCode = () =>{
        this.clearMask();
        this.setState({
            number:0
        })
        const { username } = this.props
        let _data = {
            userName:username
        };
        this.setState((state,props)=>({ //'http://192.168.88.51:8080/internal/permission/getVeriCodeImg?account=zhucw&random=0.081783643824209'
            codeUrl: baseConfig.base + '/permission/getVeriCodeImg?userName=' + _data.userName +'&random='+Math.random()
        }))
    }
    codeRefresh= () =>{
        this.handleGetCode();
    }
    selectCode= (e:any) =>{
        let x = e.pageX,
            y = e.pageY,
            _el:any = this.codeImg,    //获取图片的原点
            nodex:number = this.getNodePosition(_el)[0],//原点x 与原点y
            nodey:number = this.getNodePosition(_el)[1],
            xserver:number = parseInt(x) - nodex,
            yserver:number = parseInt(y) - nodey;

        if(yserver > 152){
            return false;
        }


        let imgEle = document.createElement('img');
        imgEle.style.left = (xserver-15) + 'px'; // 指定创建的DIV在文档中距离左侧的位置    图片大小30 左右移动5
        imgEle.style.top = (yserver -15-152 - 40) + 'px'; // 指定创建的DIV在文档中距离顶部的位置
        imgEle.style.border = '1px solid #FF0000'; // 设置边框
        imgEle.style.position = 'absolute'; // 为新创建的DIV指定绝对定位
        imgEle.style.zIndex = '100';
        imgEle.style.width = '30px'; // 指定宽度
        imgEle.style.height = '30px'; // 指定高度
        //oDiv.src = 'select.png';
        imgEle.style.opacity = '0.5'; //透明度
        imgEle.className = 'zhezhao';//加class 点刷新后删除遮罩

        _el.parentNode.appendChild(imgEle);

        //第四次点击后自动提交
        this.setState((state) =>({
            number:state.number + 1 ,
            codeArray:state.codeArray.concat([Math.round(xserver*360/380) +'_'+ yserver])
        }),()=>{
            if (this.state.number === 3) {
                this.checkOutTree();
                this.props.handleEmitCode(this.state.codeArray)
            }
        });


    }
    getNodePosition= (node:any) => {
        let top =0,left =0;
        while (node) {
            if (node.tagName) {
                // console.log(node,node.offsetTop,node.offsetLeft)
                top = top + node.offsetTop;
                left = left + node.offsetLeft;
                node = node.offsetParent;
            }
            else {
                node = node.parentNode;
            }
        }
        return [left, top];
    }
    checkOutTree = () =>{
        this.setState({
            show:false
        })
        this.clearMask();
    }
    onClickOutside= () =>{
        this.setState({
            show:false
        })
        this.clearMask()
    }
    clearMask= () =>{
        let child:any = document.querySelector('.zhezhao');
        let childs = document.querySelectorAll('.zhezhao');
        for(var i = childs.length - 1; i>=0; i--){
            child.parentNode.removeChild(childs[i]);
        }
        this.setState({
            number:0
        })
    }
    //***********************************************************/
    //验证码模块结束**********************************************/
    //***********************************************************/

    render() {
        const { codeUrl,show } = this.state;
        return (
            <div className='identify-code-container'>
                <img
                    className = { `code-img ${ show && ' active' || ''}`}
                    ref={ this.codeImgRef }
                    onClick={ this.selectCode }
                    src={ codeUrl } />
                { show &&
                    <ReloadOutlined
                    onClick={ this.codeRefresh }
                    className="code-refresh"
                    type="redo" /> }
            </div>
        );
    }

}

interface State {
    codeUrl:string,
    codeActive?:boolean,
    number:number,
    codeArray:string[],
    show:boolean
}
interface Props {
    username:string,
    error:number,
    handleEmitCode:any
}


const EnhanceIdentifyCode = EnhanceWithClickOutside(IdentifyCode);

export default EnhanceIdentifyCode
