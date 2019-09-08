import React, { Component } from 'react'
import  LinkButton  from "../../components/link-button";
import memoryUtils from '../../utils/memoryUtils'
import {reqProduct , reqCategory} from '../../api'
import {BASE_IMG_PATH} from "../../utils/constants";
import  './product.less'
import {
  Card,
  List,
  Icon
} from 'antd'
const {Item}=List
/* 
商品管理的详情子路由组件
*/
export default class ProductDetail extends Component {
  state ={
    product : memoryUtils.product,
    categoryName:''
  }

  getCategory = async (categoryId) => {
    const result = await reqCategory(categoryId)
    if (result.status===0) {
      const categoryName = result.data.name
      this.setState({
        categoryName
      })
    }
  }

  async componentDidMount(){
    if (!this.state.product._id) {
      //如果状态里的product是个空对象，发送请求
      const result = await reqProduct(this.props.match.params.id);
      if (result.status === 0) {
        // 内存没有product
        const product = result.data;

        this.setState({
          product
        });
        console.log(product);
        //获取分类
        this.getCategory(product.categoryId);
        
      }
      
    } else {
      //内存中又product对象，直接发送请求获取分类
      this.getCategory(this.state.product.categoryId);
      console.log('object')
    }
    
  }

  render() {
    const {product,categoryName} =this.state
    const title = (
      <>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type="arrow-left"></Icon>
        </LinkButton>
        <span>商品详情</span>
      </>
    );
    return (
      <Card className="detail" title={title}>
        <List>
          <Item>
            <span className="detail-left">商品名称:</span>
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className="detail-left">商品描述:</span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className="detail-left">商品价格:</span>
            <span>{product.price}元</span>
          </Item>
          <Item>
            <span className="detail-left">所属分类:</span>
            <span>{categoryName}</span>
          </Item>
          <Item>
            <span className="detail-left">商品图片:</span>
            <span className="detail-imgs">
              {product.imgs &&
                product.imgs.map(item => (
                  <img key={item} src={BASE_IMG_PATH + item} alt="img" />
                ))}
            </span>
          </Item>
          <Item>
            <span className="detail-left">商品详情:</span>
            <div dangerouslySetInnerHTML={{ __html: product.detail }}></div>
          </Item>
        </List>
      </Card>
    );
  }
}
