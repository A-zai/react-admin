import React, { Component } from 'react'
import LinkButton from '../../components/link-button'
import {reqProducts,reqSearchProducts,reqUpdateStatus} from '../../api'
import memoryUtils from "../../utils/memoryUtils";
import {
  Card,
  Input,
  Button,
  Select,
  Icon,
  Table,
  message,
} from 'antd'
const {Option}=Select

export default class ProductHome extends Component {
  state={
    //当前页的商品数组 
    products:[],
    total:0 ,//总商品的数量
    searchType:"productName",
    searchName:""
  }
 
  //根据指定页码异步获取对应页的数据显示
  getProducts = async pageNum => {
    this.current = pageNum; // 保存当前请求的页码
    let result;
    const { searchType, searchName } = this.state;
    if (this.search && searchName) {
      // 搜索分页请求
      result = await reqSearchProducts({
        pageNum,
        pageSize: 2,
        searchType,
        searchName
      });
    } else {
      // 发一般分页的请求
      result = await reqProducts(pageNum, 2);
    }
    if (result.status === 0) {
      const { list, total } = result.data;
      this.setState({
        products: list,
        total
      });
    }
  };

  reqUpdateStatus= async (productId,status)=>{
    const reslut =await reqUpdateStatus(productId,status)
    if (reslut.status===0) {
      message.success('更新商品状态成功')
      //重新获取当前页商品列表显示
      this.getProducts(this.current)
    }
  }

   componentWillMount(){
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name"
      },
      {
        title: "商品描述",
        dataIndex: "desc"
      },
      {
        title: "商品价格",
        dataIndex: "price", //一旦显示的不是某个字段的属性值时，要render,ta要显示的值是我们想要的
        render: price => "￥" + price
      },
      {
        title: "商品状态",
        // dataIndex: "status", 
        width: 100,
        render:( {_id,status}) => { //1 在售 2 下架
          let btnText='下架'
          let Text='在售'
          if(status===2){
            btnText='上架'
            Text='已下架'
          }
          return (
            <>
              <Button
                type="primary"
                onClick={() => this.reqUpdateStatus(_id, status === 1 ? 2 : 1)}
              >
                {btnText}
              </Button>
              <span>{Text}</span>
            </>
          );
        }
      },
      {
        title: "操作",
        width: 100,
        // dataIndex: "status",
        render: (product) => {
          return (
            <>
              <LinkButton
                onClick={()=>{
                  //将product存放到共享内存中
                  memoryUtils.product = product
                  //跳转到detail组件显示product
                  this.props.history.push(`/product/detail/${product._id}`)
                }}
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() => this.props.history.push(`/product/addupdate`,product)}
              >
                修改
              </LinkButton>
            </>
          );
        }
      }
    ];
  }
  //在第一次render之前发送请求
  componentDidMount(){
    this.getProducts(1);
  }

  render() {
    //取数据
    const {products,total,searchType,searchName}=this.state;
    const title = (
      <div>
        <Select
          value={searchType}
          style={{ width: 200 }}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option key="1" value="productName">
            按名称搜索
          </Option>
          <Option key="2" value="productDesc">
            按描述搜索
          </Option>
        </Select>
        <Input
          placeholder="关键字"
          value={searchName}
          style={{ width: 200, margin: "0 15px" }}
          onChange={event => this.setState({ searchName: event.target.value })}
        />
        <Button
          type="primary"
          onClick={() => {
            // 保存一个搜索标记
            this.search = true;
            this.getProducts(1);
          }}
        >
          搜索
        </Button>
      </div>
    );

    const extra = (
      <Button
        type="primary"
        onClick={() => this.props.history.push("/product/addupdate")}
      >
        <Icon type="plus"></Icon>
        添加商品
      </Button>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          dataSource={products}
          columns={this.columns}
          pagination={{
            current:this.current, //当前选中哪个页码
            pageSize: 2,
            total,
            // onChange:(page)=>this.getProducts(page) 函数，外面又创了个函数，同样的值传了进去，所以这两个可以进行下缩写
            onChange: this.getProducts //???为什么
            //onChange是函数，给它传的值也是个函数，当前页码值在里面，接收
          }}
        />
      </Card>
    );
  }
}
