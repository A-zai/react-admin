import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import PicturesWall from "./picturesWall";
import RichTextEditor from "./rich-text-editor";

import {reqCategorys,addOrUpdateProduct}from '../../api'//发送请求，接口函数
import {
  Card,
  Input,
  Icon,
  Form,
  Select,
  Button,
  message
} from 'antd'
const {Item} = Form 
const {Option}= Select
/* 
商品管理的添加/修改子路由组件
*/
class ProductAddUpdate extends Component {
  
  //动态获取商品分类列表
  state ={
    categorys:[]
  }

  getCategorys=async ()=>{
    const result = await reqCategorys()
    if(result.status===0){
      const categorys =result.data
      this.setState({
        categorys
      })
    }

  }

  //创建一个ref容器，保存到组件对象上
  pwRef=React.createRef()
  editorRef=React.createRef()

  //进行表单验证
  handleSubmit= (event)=>{
    //阻止表单默认行为
    event.preventDefault()

    this.props.form.validateFields(async (error, values) => {
      if (!error) {
        //得到表单自动收集的数据
        const { name, desc, price, categoryId } = values;
        console.log({ name, desc, price, categoryId });

        //获取所有的上传图片文件名的数组
        const imgs = this.pwRef.current.getImgs();
        console.log("imgs", imgs);

        //获取商品详情
        const detail = this.editorRef.current.getDetail();
        console.log("detail", detail);

        //封装product对象
        const product = { name, desc, price, categoryId, imgs, detail };
        //取出在内存中存放的id 错误!!!
        if(this.props.location.state){
          product._id = this.props.location.state._id; //如果有值，更新
        }
        
        //请求添加/更新商品

        const reslut = await addOrUpdateProduct(product);
        if (reslut.status === 0) {
          message.success("操作商品成功");
          this.props.history.replace("/product");
        } else {
          message.error("操作商品失败");
        }
      }
    });
  }

  //获取商品分配列表显示
  componentDidMount(){
    this.getCategorys()
  }

  //对价格进行自定义验证
  validatePrice=(rules,value,callback)=>{
    if (value<0) {
      callback('价格不能小于0')
    }else{
      callback()
    }
  }
   render() {
     const {categorys}=this.state

     const product=this.props.location.state || {}

     const {getFieldDecorator}=this.props.form
     const title =(
       <>
       <LinkButton 
       onClick={() => this.props.history.goBack()}
       >
        <Icon type='arrow-left'></Icon>
       </LinkButton>
       <span>{product._id ? '修改':'添加'}商品</span>
       </>
     )

    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 10 },
    };

    return (
      <Card title={title}>
        <Form onSubmit={this.handleSubmit} {...formItemLayout}>
          <Item label="商品名称">
            {
              getFieldDecorator("name", {
              initialValue:product.name,
              rules: [
                { required: true, whitespace: true, message: "请输入商品名称" }
              ]
            })(
              <Input placeholder="商品名称"></Input>
              )
            }
          </Item>
          <Item label="商品描述">
            {
              getFieldDecorator("desc", {
              initialValue:product.desc,
              rules: [
                { required: true, whitespace: true, message: "请输入商品描述" }
              ]
            })(
              <Input placeholder="商品描述"></Input>
              )
            }
          </Item>
          <Item label="商品价格">
            {
              getFieldDecorator("price", {
              initialValue: product.price && ('' + product.price ),
              rules: [
                { required: true, whitespace: true, message: "请输入商品价格" },
                { validator:this.validatePrice}
              ]
            })(
              <Input placeholder="商品价格" type="number" addonAfter="元"></Input>
              )
            } 
          </Item>
          <Item label="商品分类">
            {
              getFieldDecorator("categoryId", {
              initialValue:product.categoryId || '',
              rules: [
                { required: true, whitespace: true, message: "请选择商品分类" }
              ]
            })(
              <Select>
                <Option value="">未选择</Option>
                {
                  categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                }
              </Select> 
            )}
          </Item>
          <Item label="商品图片" wrapperCol={{ span: 15} }>
            <PicturesWall ref={this.pwRef} imgs={product.imgs}/>
          </Item>
          <Item label="商品详情" wrapperCol={{ span: 15} }>
            <RichTextEditor ref={this.editorRef} detail={product.detail}/>
          </Item>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form>
      </Card>
    );
  }
 
}
export default Form.create()(ProductAddUpdate)
