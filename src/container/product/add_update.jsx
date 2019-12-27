import React, { Component } from 'react'
import {connect} from 'react-redux' 
import {getCategoryListAsync} from '../../redux/actions/category_action'
import PicturesWall from './pictures_wall'
import {reqAddproduct} from '../../api'
import RichTextEditor from './rich_text_editor'
import {Card,Button,Icon,Form,Input,Select, message} from 'antd'

const {Item} = Form
const {Option} = Select

@connect(
	state => ({categoryList:state.categoryList}),
	{getCategoryListAsync}
)
@Form.create()
class AddUpdate extends Component {

	componentDidMount(){
		if(!this.props.categoryList.length){
			this.props.getCategoryListAsync()
		}
	}

	handleSubmit = (event)=>{
    event.preventDefault()
    this.props.form.validateFields(async(err, values) => {
      if(!err){
				values.imgs = this.refs.picturesWall.getPictureNameArr()
				values.detail = this.refs.richTextEditor.getRichText()
				let result = await reqAddproduct(values)
				const {status,msg} = result
				if(status === 0){
					message.success('添加商品成功')
					this.props.history.replace('/admin/prod_about/product')
				}else{
					message.warning(msg)
				}
			}
    });
  }

	render() {
    const {getFieldDecorator} = this.props.form;
    return (
        <Card 
          title={
            <div>
              <Button type="link" onClick={this.props.history.goBack}>
                <Icon type="arrow-left"/>
                <span>返回</span>
              </Button>
              <span>商品添加</span>
            </div>}
        >
          <Form 
						onSubmit={this.handleSubmit}
						labelCol={{span:2}}
						wrapperCol={{span:7}}
          >
            <Item label="商品名称">
              {getFieldDecorator('name', {
                  rules: [{required: true, message: '请输入商品名称' }],
                })(<Input placeholder="商品名称"/>)}
            </Item>
            <Item label="商品描述">
              {getFieldDecorator('desc', {
                rules: [{required: true, message: '请输入商品描述' }],
              })(<Input placeholder="商品描述"/>)}
            </Item>
            <Item label="商品价格">
              {getFieldDecorator('price', {
                rules: [{required: true, message: '请输入商品价格' }],
              })(<Input
									placeholder="商品价格"
									prefix="￥"
									addonAfter="元"
                />)}
            </Item>
            <Item label="商品分类">
              {getFieldDecorator('categoryId', {
								initialValue:'',
                rules: [{required: true, message: '请选择一个分类' }],
              })(<Select>
                  <Option value="">请选择分类</Option>
                  {
										this.props.categoryList.map((category)=>{
											return <Option key={category._id} value={category._id}>{category.name}</Option>
										})
									}
                </Select>)}
            </Item>
            <Item label="商品图片">
              <PicturesWall ref="picturesWall"/>
            </Item>
            <Item label="商品详情" wrapperCol={{span:15}}>
              <RichTextEditor ref="richTextEditor"/>
            </Item>
            <Button type="primary" htmlType="submit">提交</Button>
          </Form>
        </Card>
    )
  }
}
export default AddUpdate