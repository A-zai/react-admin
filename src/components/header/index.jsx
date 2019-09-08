import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'

import { Modal } from "antd";
import LinkButton from "../link-button";
import { reqWeather } from '../../api'
import menuConfig from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";
import { formateDate } from "../../utils/dateUtils";
import "./index.less"
import storageUtils from '../../utils/storageUtils';

class Header extends Component {
  state = {
    currentTime: formateDate(Date.now()),
    dayPictureUrl: "", //天气的图片url
    weather: "" // 天气的文本值
  };

  /* 根据当前请求的路径查找到对应的title */
  getTitle = () => {
    const path = this.props.location.pathname;

    let title;
    menuConfig.forEach(item => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(cItem => cItem.key === path);
        // 如果cItem有值
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };

  /* 用循环定时器 */
  updateTime = () => {
    this.intervalId =setInterval(() => {
      this.setState({
        currentTime: formateDate(Date.now()) //进行转化处理
      });
    }, 1000);
  };

  getWeather = async () => {
    const { dayPictureUrl, weather } = await reqWeather("上海");
    this.setState({
      dayPictureUrl,
      weather
    });
  };

  loginout=()=>{
    Modal.confirm({
      title: "你确定要退出该账户吗?",
      content: "Some descriptions",
      onOk:()=> {
        console.log("OK");
        //删除保存的user
        storageUtils.removeUser()
        memoryUtils.user = {};
        //跳转到login
        this.props.history.replace('/login')
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  //清除定时器
  componentWillUnmount(){
    clearInterval(this.intervalId)
  }

  componentDidMount() {
    this.updateTime();
    this.getWeather();
  }
  render() {
    const { currentTime, dayPictureUrl, weather } = this.state;

    const { username } = memoryUtils.user;
    const title = this.getTitle();
    return (
      <div className="Header">
        <div className="header-top">
          欢迎 {username} &nbsp;
          <LinkButton onClick={this.loginout}>退出</LinkButton>
        </div>
        <div className="header-button">
          <div className="header-button-left">{title}</div>
          <div className="header-button-right">
            <span>{currentTime}</span>
            {dayPictureUrl ? <img src={dayPictureUrl} alt="weather" /> : null}
            <span>{weather}</span>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(Header)