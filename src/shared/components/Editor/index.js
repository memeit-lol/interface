import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import sc2 from '../../sc2';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
const FormItem = Form.Item;
import {Helmet} from "react-helmet";
import LoginRequired from "../LoginRequired";
import { images as imagesAPI, stickers as stickersAPI } from '../../api';

@LoginRequired    // If logged in continue, else go to '/'.
@Form.create()    // Part of antd, helps create a form with advanced features.
@connect(state => ({
  app: state.app    // Hold app variables such as the user object, if the user is logged in, and username.
}))
export default class Editor extends Component {
  /**
   * This is for SSR preloading.
   * @param {Object} store - The initial store from the server side rendering.
   * @param {Object} match - Tells where the location is.
   * @returns {null} - We don't need this for the editor.
   */
  static fetchData({store, match}) {
    return null;
  }

  /**
   * For the state we need an array or the image and sticker links from the api.
   * @returns {Object} - This returns the initial state for react.
   */
  state = {
    stickers: [],
    images: []
  }

  /**
   * This function is fired when the form submits.
   * @param {Object} e - An event object from the form submission.
   */
  handleSubmit = (e) => {
    e.preventDefault();   // Stops from reloading. We don't need to with this app.
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log(this.exported())
      }
    });
  }

  /**
   * This function is fired when the React component is about to load.
   * This is where we get the image and stickers array for the React state.
   */
  componentWillMount() {
    imagesAPI().then(d => {
      this.setState({
        images: d
      })
      stickersAPI().then(d2 => {
        this.setState({
          stickers: d2,
          loaded: true
        })
      })
    })
  }

  /**
   * This is ran after the React component was mounted.
   * This logic must be after the dom has loaded so we have access to the dom window.
   * This creates a new fabric canvas, initiates the del key, and adds a default background image.
   */
  componentDidMount() {
    if(typeof window.fabricCanvas === 'undefined') {
      window.fabricCanvas = new window.fabric.Canvas('canvas', {
        width: this.refs.canvas.parentElement.clientWidth
      });
      window.onkeyup = function (ev) {
        switch (ev.keyCode) {
          case 46:
            this.removeElement()
            break
        }
      }.bind(this)
      this.addBackgroundImage('https://api.memeit.lol/v1/meme/1_Advice_Yoda_Gives.jpg');
    }
  }

  /**
   * This exports the canvas into an image.
   * @returns {String} - base64 png string of the canvas.
   */
  exported() {
    return window.fabricCanvas.toDataURL()
  }

  /**
   * This exports the canvas into a json object for drafting.
   * @returns {Object} - A Fabric instance to save for drafts.
   */
  draft() {
    return JSON.stringify(window.fabricCanvas.toJSON())
  }

  /**
   * This adds a sticker to the canvas editor.
   * @param {String} url - The link to an image with access control '*'. 
   */
  addSticker(url) {
    window.fabric.Image.fromURL(url, function (img) {
      var scale = 50 / img.height
      img.scale(scale)
      window.fabricCanvas.add(img)
      window.fabricCanvas.setActiveObject(img)
    }, {crossOrigin: 'anonymous'})
  }

  /**
   * This function deletes an active object on the canvas, or a custom object.
   * @param {Object} element - An Fabric object to delete.
   */
  removeElement(element = window.fabricCanvas.getActiveObject()) {
    window.fabricCanvas.remove(element)
  }

  /**
   * This function creates default textboxes on the editor.
   * One at the top and one on the bottom.
   */
  defaultTextAreas() {
    this.addText('DOUBLE CLICK ON ME', 0, 25)
    this.addText('DOUBLE CLICK ON ME', 0, window.fabricCanvas.height - 75)
  }

  /**
   * This creates a textbox, adds it to the fabric canvas, and sets it as an active object.
   * @param {String} text - The initial text on the textbox
   * @param {Integer} x - The initial x position
   * @param {Integer} y - The initial y position
   */
  addText(text = "DOUBLE CLICK ON ME", x = 0, y = 0) {
    var element = new window.fabric.Textbox(text, { width: this.refs.canvas.parentElement.clientWidth, height: 50, breakWords: true, textAlign:'center',left: x, top: y, fontFamily: 'Impact', fontSize: 40, stroke: '#000000', strokeWidth: 3, fill: "#ffffff", strokeMiterLimit: 2, strokeLineCap: "round" })
    window.fabricCanvas.add(element)
    window.fabricCanvas.setActiveObject(element)
  }

  /**
   * This adds a background image to the canvas and runs the defaultTextAreas function.
   * @param {String} url - This is the image url for the background image
   */
  addBackgroundImage(url) {
    if(window !== null) {
      var i = new Image()
      i.onload = function () {
        window.fabricCanvas.clear()
        window.fabricCanvas.setHeight(i.height)
        window.fabricCanvas.setWidth(i.width)
        window.fabricCanvas.setBackgroundImage(url, function () {
          var scale = i.height / i.width
          window.fabricCanvas.backgroundImage.scaleToWidth(this.refs.canvas.parentElement.clientWidth)
          window.fabricCanvas.setDimensions({width: this.refs.canvas.parentElement.clientWidth, height: this.refs.canvas.parentElement.clientWidth  * scale})
          var text = new window.fabric.Text('memeit.lol', { left: 7, top: this.refs.canvas.parentElement.clientWidth * scale - 25, fontFamily: 'Impact', fontSize: 20, stroke: '#000000', strokeWidth: .75, fill: "#ffffff", strokeMiterLimit: 2, strokeLineCap: "round" });
          text.selectable = false
          window.fabricCanvas.add(text)
          this.defaultTextAreas()
        }.bind(this), {crossOrigin: 'anonymous'})
      }.bind(this);
      i.src = url
    }
  }

  /**
   * This renders the component onto the DOM.
   */
  render() {
    const { getFieldDecorator } = this.props.form;    // From antd, helps get form values.
    const { loaded, images, stickers } = this.state;    // loaded is changed after the array is loaded, images is an array of all images from the api, stickers is an array of all the stickers from the api.
    let imagesDOM, stickersDOM;   // These variable are for the sliders above and below the editor for picking stickers and background images.
    if(loaded) {    // Runs if both stickers and images arrays are loaded into React state.
      
    }
    return (
      <div>
        <Helmet>
          <title>Editor | Memeit.LOL</title>
        </Helmet>
        <Form onSubmit={this.handleSubmit} style={{maxWidth: 500, margin: '10px auto'}} className="login-form">
          <FormItem>
            {getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input a title!' }],
            })(
              <Input placeholder="Title" />
            )}
          </FormItem>
          <div><div><canvas ref="canvas" id="canvas"></canvas></div></div>
          <Button type="primary" style={{display: 'block', margin: '10px auto'}} htmlType="submit" className="login-form-button">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
