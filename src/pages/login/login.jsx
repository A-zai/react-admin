import React, { Component } from 'react'
import logo from "../../assets/imgs/logo.png";
import { Form, Icon, Input, Button,message} from "antd"
import { Redirect } from "react-router-dom"

import memoryUtils from "../../utils/memoryUtils"
import storageUtils from "../../utils/storageUtils";
import { reqLogin } from "../../api"
import '../less/login.less'

/* 登录 */
 class Login extends Component {
   handleSubmit = event => {
     // 阻止事件的默认行为: 阻止表单的提交
     event.preventDefault();
     //得数据
     const form = this.props.form;
    //  const username = form.getFieldsValue("username");
    //  const password = form.getFieldsValue("password");
    //  const values = form.getFieldsValue();
    //  console.log(username, password, values);

    
     form.validateFields(async(error,{username,password })=>{
       if(!error){ //验证通过
        
         //登录发Ajax请求 ,此时该函数返回的是promise，不想要，因为要会导致.then()提交回调函数，那么用await,重新赋值取得结果数据
        const result = await reqLogin(username,password)
        // console.log('result',result)
        if (result.status===0) { //请求登录成功 

           //得到返回的用户信息
          const user = result.data//user里存放的是[object Object],但取不出来，转成json数据

          //保存user(local\memory)localStorage里的数据只能是文本
          // localStorage.setItem("user_key",JSON.stringify(user))
          storageUtils.saveUser(user)
          memoryUtils.user =user 
         

          //跳转到admin路由
          this.props.history.replace('/')
        }else{//请求登录失败
          message.error(result.msg)
        }
       
      }else{
         console.log('前台表单验证失败')
       }
     })
     
   }

   /* 验证密码的验证器函数 */
   validatePWd =(rule,value,callback)=>{
      /*有一个小bug 在没有值的情况下按登录按钮，没有报登录错误，只有在点击空格之后按登录才显示错误！！！
        1). 必须输入
        2). 必须大于等于4位
        3). 必须小于等于12位
        4). 必须是英文、数字或下划线组成 
      */
     value =value.trim()
     if(!value){
       callback('请输入密码')
     }else if (value.length<4) {
       callback("密码不能小于4位!")
     }else if (value.length>12) {
       callback("密码不能大于12位!")
     }else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
       callback("密码只能包含英文、数字、或下划线组成");
     }else {
       callback()
     }
   }

   render() {
    const user = memoryUtils.user
    //如果登录
    if (user._id) {
      //自动跳转到admin
      return <Redirect to="/"></Redirect>;
    }
    //  const from = this.props.form
     const { getFieldDecorator } = this.props.form;
     return (
       <div className="login">
         <header className="login-header">
           <img src={logo} alt="logo" />
           <h1>后台管理系统</h1>
         </header>
         <section className="login-content">
           <h2>用户登录</h2>
           <Form onSubmit={this.handleSubmit} className="login-form">
             <Form.Item>
               {getFieldDecorator("username", {
                 //在这里视频上trim调用失败，但实际上是调用trim的value值是undefined，没有调用前，它是没有值的，所以给它一个初始值
                initialValue:'',
                 /*
                 声明式验证：使用内置的验证规则进行验证
                用户名/密码的的合法性要求，用声明式校验
                  1). 必须输入
                  2). 必须大于等于4位
                  3). 必须小于等于12位
                  4). 必须是英文、数字或下划线组成
                */
                 rules: [
                   { required: true, whitespace:true,message: "用户名必须输入!" },
                   { min: 4, message: "用户名不能小于4位!" },
                   { max: 12, message: "用户名不能大于12位!" },
                   {
                     pattern: /^[a-zA-Z0-9_]+$/,
                     message: "用户名只能包含英文、数字、或下划线组成"
                   }
                 ]
               })(
                 <Input
                   prefix={
                     <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                   }
                   placeholder="用户名"
                 />
               )}
             </Form.Item>
             <Form.Item>
               {getFieldDecorator("password", {
                 rules: [{ validator: this.validatePWd }]
               })(
                 <Input
                   prefix={
                     <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                   }
                   type="password"
                   placeholder="密码"
                 />
               )}
             </Form.Item>
             <Form.Item>
               <Button
                 type="primary"
                 htmlType="submit"
                 className="login-form-button"
               >
                 登录
               </Button>
             </Form.Item>
           </Form>
         </section>
       </div>
     )
   }
 }
const WrappedFormLogin = Form.create()(Login)


export default WrappedFormLogin;