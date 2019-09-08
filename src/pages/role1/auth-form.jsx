import React, { Component } from "react";
import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig";
import PropTypes from "prop-types";

const { Item } = Form;
const { TreeNode } = Tree;

/*
添加分类的form组件
 */
export default class AuthForm extends Component {

  static propTypes = {
    role: PropTypes.object
  }

  state ={
    checkedKeys:[]
  }

  handleCheck = (checkedKeys) => {
    // 更新checkedKeys状态数据
    this.setState({
      checkedKeys
    })
  }

  /* 根据菜单的数组生成<TreeNode></TreeNode>*/
  getTreeNodes=(menuList)=>{
    return menuList.map(item=>{
      return <TreeNode title={item.title} key={item.key}>
        {item.children ? this.getTreeNodes(item.children) : null}
      </TreeNode>
    }) 
  }


  render() {
    console.log('AuthForm render()')
    
    const { checkedKeys } = this.state;
    const { role } = this.props
    const formItemLayout = {
      labelCol: { span: 4 },  // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    }

    return (
      <>
        <Item label='角色名称' {...formItemLayout}>
          <Input value={role.name} disabled/>
        </Item>
        <Tree
          checkable //是否支持被选中
          defaultExpandAll //默认展开所有的树节点
          checkedKeys={checkedKeys} //选中复选框的树节点受控组件
          onClick={this.handleCheck} //点击复选框触发
        >
          <TreeNode title='平台权限' key='all'>
           {
             this.getTreeNodes(menuList)
           } 
          </TreeNode>
        </Tree>
      </>
    )
  }
}
