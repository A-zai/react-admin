import React, { Component } from 'react'
import {
  Form,
  Input,
  Tree
} from 'antd'
import menuList from '../../config/menuConfig'
import PropTypes from 'prop-types'

const {Item}=Form
const {TreeNode}=Tree

/*
添加分类的form组件
 */
export default class AuthForm extends Component {
  static propTypes ={
    role:PropTypes.object
  }

  handleCheck=()=>{

    }
  render() {
    const {role}=this.props

    
    const formItemLayout={
      labelCol:{span:5},
      wrapperCol:{span:16}
    }
    return (
      <>
        <Item label='角色名称' {...formItemLayout}>
          <Input/>
        </Item>
        <Tree
          checkable //是否支持被选中
          defaultExpandAll //默认展开所有的树节点
          checkedKeys={checkedKeys} //选中复选框的树节点受控组件
          onClick={this.handleCheck} //点击复选框触发
        >
          <TreeNode title='平台权限' key='all'>

          </TreeNode>
        </Tree>
      </>
    )
  }
}
