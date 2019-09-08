import React, { Component } from 'react'
import {Redirect ,Switch ,Route } from "react-router-dom"
import memoryUtils from "../../utils/memoryUtils"
import { Layout } from "antd"

import Header from "../../components/header"
import LeftNav from "../../components/left-nav/LeftNav"
import Product from '../product/product'
import Home from '../home/home'
import Category from "../category/category"
import Role from "../role1/role"
import User from "../user/user"
import Bar from '../charts/bar'
import Line from "../charts/line"
import Pie from "../charts/pie" 


const { Footer, Sider, Content } = Layout

/* 
一级路由组件：管理
*/
export default class Admin extends Component {
  render() {
    //const user = JSON.parse(localStorage.getItem("user_key")|| '{}')//用parse解析
    const user = memoryUtils.user
    //如果没有登录，user没有_id
    if (!user._id) {
      //自动跳转到login
      return <Redirect to='/login'></Redirect> 
    }
    return (
      <Layout style={{ height: "100%" }}>
        <Sider>
          <LeftNav></LeftNav>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ backgroundColor: " #fff", margin: 20 }}>
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/product" component={Product} />
              <Route path="/category" component={Category} />
              <Route path="/role" component={Role} />
              <Route path="/user" component={User} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/line" component={Line} />
              <Route path="/charts/pie" component={Pie} />
              <Redirect to='/home' />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center", color: "rgba(0,0,0,.5)" }}>
            推荐使用Footer，裹上虾皮炸一炸效果更佳，老人小孩都说好
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
