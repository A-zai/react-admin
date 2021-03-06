import React, { Component } from "react";
import PropTypes from 'prop-types'
import { EditorState, convertToRaw ,ContentState} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default   class RichTextEditor extends Component {

  static propTypes={
    detail:PropTypes.string
  }


  constructor(props){
    super(props) 

    const detail=this.props.detail
    //detail有值
    if (detail) {
      const contentBlock = htmlToDraft(detail); //htmlToDraft(html)中的html是detail格式的
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.state = {
        editorState //带数据的，根据detail的html格式一系列转换创建后生成的editorState
      };
    }else{
      //初始化一个空的编辑状态对象
      this.state={
        editorState:EditorState.createEmpty()
      }
    }
 
  }

  onEditorStateChange= editorState => {
    this.setState({
      editorState
    });
  };

  /* 返回详情信息 */
  getDetail=()=>{
    return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
  }

  /* 上传图片的回调函数 */
  uploadImageCallBack(file) {
  return new Promise(
    (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/manage/img/upload");
      const data = new FormData();
      data.append('image', file);
      xhr.send(data);
      xhr.addEventListener('load', () => { //上传成功时有个load回调
        const response = JSON.parse(xhr.responseText);
        resolve(response); //response.data.url
      });
      xhr.addEventListener('error', () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    }
  );
}

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{ border: "1px solid", height: 300, paddingLeft: 20 }}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              uploadCallback: this.uploadImageCallBack,
              alt: { present: true, mandatory: true }
            }
          }}
        />
      </div>
    );
  }
}
