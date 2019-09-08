import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import {reqDeleteImg} from '../../api'
import PropTypes from "prop-types";
import {BASE_IMG_PATH} from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }
  
  constructor(props){
    super(props)

    let fileList =[]
    const {imgs}=this.props //imgs 不一定有值
    if (imgs && imgs.length>0) {
      fileList = imgs.map((img,index)=>({
        uid:index,
        name:img,
        status:'done',
        url:BASE_IMG_PATH + img
      }))
    }

    this.state = {
      previewVisible: false,  //是否显示大图预览
      previewImage: '',  //大图的url和base64字符串
      fileList//所有上传图片文件的数组
    }
  }

  //返回所有已上传图片文件名的数组
  getImgs =()=>this.state.fileList.map(file => file.name)

  //隐藏大图预览
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true, //显示大图
    });
  };

  /* 
  文件状态改变的回调
   状态有：uploading done error removed
  */
  handleChange = async({file, fileList }) =>{

    //已经上传完成
    if (file.status==='done') { 

      //file与fileList中最后的一个file代表同一个图片信息的对象（不是同一个）
      file=fileList[fileList.length-1]

      //取出name，url
      const {name,url} =file.response.data

      //保存到file对象上
      file.name = name
      file.url = url
    }else if(file.status==='removed'){ //删除图片

      //发送i请求删除后台保存的图片
      const reslut = await reqDeleteImg(file.name)
      if(reslut.status===0){
        message.success('删除图片成功')
      }
    }
    //更新fileList的状态数据
     this.setState({ fileList });
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload 
          action="/manage/img/upload" //图片上传的路径path
          name='image'   //指定参数名
          listType="picture-card" //上传图片的样式
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange} //文件状态改变的回调，上传、完成、失败都会调用该函数
        >
          {fileList.length >= 4 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
