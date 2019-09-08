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
import PAGE_SIZE from "../../utils/constants";
/**
 * 角色管理路由
 */
export default class Role extends Component {
  render() {
    const title=(
      <Button type='primary'>
        创建角色
      </Button>
    )
    return (
      <Card title={title}>
        <Table></Table>
        <Modal
          title='添加角色'
          
        >
          <AddForm/>
        </Modal>

        <Modal
          title='设置角色权限'

        >
          <AuthForm />
        </Modal>

      </Card>
    )
  }
}
