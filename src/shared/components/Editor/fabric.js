import React, { Component } from 'react';

export default class Fabric extends Component {
	componentDidMount() {
    if(window !== null) {
      window.fabricCanvas = new window.fabric.Canvas('canvas', {
        width: this.refs.canvas.parentElement.clientWidth
      });
      window.onkeyup = function (ev) {
        switch (ev.keyCode) {
          case 46:
            this.removeElement()
            break
        }
      }
      this.addBackgroundImage('https://api.memeit.lol/v1/meme/1_Advice_Yoda_Gives.jpg');
    }
  }
  export() {
    return window.fabricCanvas.toDataURL()
  }
  draft() {
    return JSON.stringify(window.fabricCanvas.toJSON())
  }
  addSticker(url) {
    window.fabric.Image.fromURL(url, function (img) {
      var scale = 50 / img.height
      img.scale(scale)
      window.fabricCanvas.add(img)
      window.fabricCanvas.setActiveObject(img)
    }, {crossOrigin: 'anonymous'})
  }
  removeElement(element = window.fabricCanvas.getActiveObject()) {
    window.fabricCanvas.remove(element)
  }
  defaultTextAreas() {
    this.addText('DOUBLE CLICK ON ME', 0, 25)
    this.addText('DOUBLE CLICK ON ME', 0, window.fabricCanvas.height - 75)
  }
  addText(text = "DOUBLE CLICK ON ME", x = 0, y = 0) {
    var element = new window.fabric.Textbox(text, { width: this.refs.canvas.parentElement.clientWidth, height: 50, breakWords: true, textAlign:'center',left: x, top: y, fontFamily: 'Impact', fontSize: 40, stroke: '#000000', strokeWidth: 3, fill: "#ffffff", strokeMiterLimit: 2, strokeLineCap: "round" })
    window.fabricCanvas.add(element)
    window.fabricCanvas.setActiveObject(element)
  }
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
  render() {
    return <canvas ref="canvas" id="canvas"></canvas>
  }
};