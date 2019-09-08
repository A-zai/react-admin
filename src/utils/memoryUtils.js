/* 
outmemory 内存溢出
在内存存储数据的工具对象
 */
import storageUtils from "./storageUtils";

export default{

  //存当前登录的用户
  
  // user: JSON.parse(localStorage.getItem('user_key') || '{}')
  user: storageUtils.getUser() ,//多次读取
  product: {}, //需要显示的商品
} 
