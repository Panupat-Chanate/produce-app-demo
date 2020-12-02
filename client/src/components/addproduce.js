import React,{Component, useState} from 'react';
import axios from 'axios';

export default class AddProduce extends Component{
  constructor(props) {
    super(props);
    this.state = {
      imgCollection: '',
      fileCollection: '',
      produceId: '',
      produceName: '',
      produceType: '',
      produceData: '',
      errors: ''
    }
    this.handleImg = this.handleImg.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
}

  handleSubmit = (e) => {
    e.preventDefault()
    if(this.validate()){
      const files = []
      const count = (this.state.fileCollection.length + this.state.imgCollection.length)
      var i2 = 0
      console.log(this.state.imgCollection)
      console.log(this.state.fileCollection)
      for (var i = 0; i < count; i++) {
        if (i < this.state.imgCollection.length) {
          files.push(this.state.imgCollection[i])
        } else {
          files.push(this.state.fileCollection[i2])
          i2++
        }
      }
      const formData = new FormData();
      for (const key of Object.keys(files)) {
        formData.append('allCollection', files[key])
      }
      formData.append('produceId', this.state.produceId)
      formData.append('produceName', this.state.produceName)
      formData.append('produceType', this.state.produceType)
      formData.append('produceData', this.state.produceData)
      axios.post("/upload",formData)
      .then((response) => {
        console.log(response.data)
        this.setState({
          imgCollection: '',
          produceId: '',
          produceName: '',
          produceType: '',
          produceData: ''
        })
      }).catch((error) => {
        console.log(error)
      });
    }
  }

  handleChange=(e)=>{
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleImg=(e)=>{
    for (var i = 0; i < e.target.files.length; i++) {
        const spilt = e.target.files[i].type.split('/',1)[0]
        console.log(spilt)
        if (spilt !== "image") {
            alert("ไฟล์รูปภาพเท่านั้น")
        } else {
          this.setState({
            [e.target.id]: e.target.files
          });
        }
    }
    
  }

  handleFile=(e)=>{
    for (var i = 0; i < e.target.files.length; i++) {
      const spilt = e.target.files[i].type.split('/',1)[0]
      console.log(spilt)
      if (spilt !== "application") {
          alert("ไฟล์เอกสารเท่านั้น")
      } else {
        this.setState({
          [e.target.id]: e.target.files
        });
      }
  }
  }

  validate(){
    let errors = {};
    let isValid = true;

    if (!this.state.imgCollection) {
      isValid = false;
      errors["imgCollection"] = " Please enter your imgCollection.";
    }

    if (!this.state.fileCollection) {
      isValid = false;
      errors["fileCollection"] = " Please enter your fileCollection.";
    }

    if (!this.state.produceId) {
      isValid = false;
      errors["produceId"] = " Please enter your produceId.";
    }

    if (!this.state.produceName) {
      isValid = false;
      errors["produceName"] = " Please enter your produceName.";
    }

    if (!this.state.produceType) {
      isValid = false;
      errors["produceType"] = " Please enter your produceType.";
    }

    if (!this.state.produceData) {
      isValid = false;
      errors["produceData"] = " Please enter your produceData.";
    }

    this.setState({
      errors: errors
    });

    return isValid;
}

  render(){
    return(
    <form align = "center" className="container p-5 col-md-6">
       <div className="text-center text-uppercase text-muted"><h1>Produce Insert</h1></div>
      <p></p>
      <div className="card-header">
      <p></p>
      <input className="col-sm-6" type="file" id="imgCollection" onChange={this.handleImg} multiple></input>
      <span className="text-danger">{this.state.errors.imgCollection}</span><p></p>

      <input className="col-sm-6" type="file" id="fileCollection" onChange={this.handleFile} multiple></input>
      <span className="text-danger">{this.state.errors.fileCollection}</span><p></p>

      <input className="col-sm-6" type="text" id="produceId" placeholder="รหัสผลิตภัณฑ์" value={this.state.produceId} onChange={this.handleChange}></input>
      <span className="text-danger">{this.state.errors.produceId}</span><p></p>

      <input className="col-sm-6" type="text" id="produceName" placeholder="ชื่อผลิตภัณฑ์" value={this.state.produceName} onChange={this.handleChange}></input>
      <span className="text-danger">{this.state.errors.produceName}</span><p></p>

      <input className="col-sm-6" type="text" id="produceType" placeholder="ประเภทผลิตภัณฑ์" value={this.state.produceType} onChange={this.handleChange}></input>
      <span className="text-danger">{this.state.errors.produceType}</span><p></p>

      <input className="col-sm-6" type="text" id="produceData"  placeholder="ข้อมูลผลิตภัณฑ์" value={this.state.produceData} onChange={this.handleChange}></input>
      <span className="text-danger">{this.state.errors.produceData}</span><p></p>

      <input type="submit" className="btn btn-primary" onClick={this.handleSubmit} value="เพิ่มข้อมูลผลิตภัณฑ์"></input><p></p>
      </div>
    </form>
    )
  }
}