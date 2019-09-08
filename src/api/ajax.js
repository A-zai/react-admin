/* 
可以发送Ajax任意请求的函数模块
封装axios,函数返回值一个promise
将post请求参数转化成urlencoded格式（默认json）---用请求拦截器
请求成功的结果不是response，而是response.data----响应拦截器 成功
统一处理请求异常-- --响应拦截器  失败
*/

import axios from 'axios'
import qs from 'qs'
import {message} from 'antd'

//指定的前面的基础路径地址：服务器--后台应用的地址url
// axios.defaults.baseURL ='http://localhost:5000'

//使用请求拦截器
axios.interceptors.request.use((config)=>{
  let data = config.data
  if (data &&data instanceof Object) {
    //将data的值转化成urlencoded格式
    config.data = qs.stringify(data)
  }
  return config
})

//使用响应拦截器
axios.interceptors.response.use(
  response=>{
    return response.data
  },
  error=>{
    message.error('请求出错' + error.message)
    return new Promise(()=>{}) //中断promise链
  }
)

export default axios

/* axios.post('/login',{username,password}).then(result=>{
  
}) */