import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import sc2 from '../../sc2';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
import {Helmet} from "react-helmet";
import LoginRequired from "../LoginRequired";
import { fabric } from  "fabric";

@LoginRequired
@Form.create()
@connect(state => ({
  app: state.app
}))
export default class Editor extends Component {
  static fetchData({store, match}) {
    return null;
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  componentWillMount() {
    this.canvas = new fabric.Canvas(this.refs.canvas);
    console.log(this.canvas)
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Helmet>
          <title>Editor | Memeit.LOL</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input a title!' }],
            })(
              <Input placeholder="Title" />
            )}
          </FormItem>
          <canvas ref="canvas"></canvas>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
