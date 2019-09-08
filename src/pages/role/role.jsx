import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'

import {reqRoles} from '../../api'
import {reqAddRole,reqUpdateRole} from '../../api'
import LinkButton from '../../components/link-button'
import AddForm from "./add-form";
import AuthForm from "./auth-form";
import memoryUtils from "../../utils/memoryUtils";
import {formateDate} from "../../utils/dateUtils";
import {PAGE_SIZE} from "../../utils/constants";
import { async } from 'q'
/**
 * 角色管理路由
 */
export default class Role extends Component {
  state={
    roles:[], //所有角色的列表
    isShowAdd:false, //是否显示添加界面
    isShowAuth:false //是否显示设置权限界面
  }

  authRef = React.createRef()

  /* 初始化角色列数组 */
  initColum=()=>{
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name"
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: create_time => formateDate(create_time)
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: auth_time => formateDate(auth_time)
      },
      {
        title: "授权人",
        dataIndex: "auth_name"
      },
      {
        title: "操作",
        render: (role) => <LinkButton onClick={()=>this.showAuth(role)}>设置权限</LinkButton>
      }
    ];
  }

  //显示权限设置界面
  showAuth=()=>{
    this.role = role
    this.setState({
      isShowAuth:true
    })
  }

  //异步获取角色显示
  getRoles =async ()=>{
    const reslut=await reqRoles()
    if (reslut.status===0) {
      const roles=reslut.data
      this.setState({
        roles
      })
    }
  }

  //添加角色
  addRole=()=>{
    //表单验证，通过了继续
    this.form.validateFields((error,valuess)=>{
      if (!error) {
        //重置输入
        this.form.resetFields()
        //隐藏确认框
        this.setState({
          isShowAdd:false
        })
      }
    })
  }

  //给角色授权
  updateRole=()=>{
    //隐藏确认框
    this.setState=({
      isShowAuth:false
    })
  }

  componentWillMount(){
    this.initColum()
  }

  componentDidMount(){
    this.getRoles()
  }

  render() {
    const { roles, isShowAdd, isShowAuth } =this.state
    const role=this.role || {}
    const title=(
      <Button type='primary' onClick={()=>this.state({isShowAdd:true})}>
        创建角色
      </Button>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey="_id"
          dataIndex={roles}
          columns={this.columns}
          pagination={{ defaultPageSize: PAGE_SIZE }}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({
              isShowAdd: false
            });
            //重置一组输入控件的值与状态，如不传入参数，则重置所有组件???
            this.form.resetFields();
          }}
        >
          <AddForm setForm={form => (this.form = form)} />
        </Modal>

        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false });
          }}
        >
          <AuthForm ref={this.authRef} role={role} />
        </Modal>
      </Card>
    );
  }
}
