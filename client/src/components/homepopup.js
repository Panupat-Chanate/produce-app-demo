import React,{Component, useState} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import Session from './session'

export default class Homepopup extends Component{
  constructor() {
    super();
    this.state={
      _id: '',
      searchId: '',
      searchName: '',
      searchType: '',
      searchData: '',
      _img: [],
      _file: [],

      popupName: '',
      popupId: '',
      popupType: '',
      popupData: '',
      popupFile: [],
      fileCollection: '',

      arrayData: [],
      preview: '',
      count: '',
      countFile: ''
    }
    this.handleUpload = this.handleUpload.bind(this)
  }

  getSession=() => {
    axios.get('/checkSession', {withCredentials: true})
    .then(response => {
      console.log(response.data)
      if (response.data.logedin) {
        if (response.data.level == 0) {
          // กลับไปหน้าปัจจุบัน
          return console.log("user")
        }
        return console.log("admin")
      } else {
        browserHistory.push("/");
      }
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidMount() {
    this.getSession();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/search",this.state)
    .then((response) => {
      console.log(response)
      this.setState({
        arrayData: []
      })
      var concatData = this.state.arrayData.concat(response.data);
      // console.log(concatData[0].produce_img)
      // console.log([concatData[0].produce_img].length)
      this.setState({
        arrayData: concatData
      })
      console.log(this.state.arrayData)
    }).catch((error) => {
      console.log(error)
    });
  }

  handleChange=(e)=>{
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  handleUpload=(e)=>{
    this.setState({
      [e.target.id]: e.target.files,
    });
  }

  handleDelete=(e)=>{
    const Item = JSON.parse(e.target.id)
    console.log(Item)
    axios.post("/deleteproduce",Item)
    .then((response) => {
      this.handleSubmit(e);
    }).catch((error) => {
      console.log(error)
    });
  }
 
  Edit=(e)=>{
    e.preventDefault();
    // console.log(this.state._file)
    // console.log(this.state.fileCollection)
    const formData = new FormData();
    for (const key of Object.keys(this.state.fileCollection)) {
      formData.append('fileCollection', this.state.fileCollection[key])
    }
    formData.append('edit_id', this.state._id)
    formData.append('editName', this.state.popupName)
    formData.append('editType', this.state.popupType)
    formData.append('editData', this.state.popupData)
    formData.append('oldFile', this.state._file)
    axios.post("/editproduce",formData)
    .then((response) => {
      this.handleSubmit(e);
    }).catch((error) => {
      console.log(error)
    });
  }

  popup=(e)=>{
    const Item = JSON.parse(e.target.id)
    this.setState({
      _id: Item._id,
      _img: Item._img.split(','),
      popupId: Item.item_id,
      popupName: Item.item_name,
      popupType: Item.item_type,
      popupData: Item.item_data,
      _file: Item._file
    });
  }

  clear=(e)=>{
    e.preventDefault();
    this.setState({
      editItem: false,
      searchId: "",
      searchName: "",
      searchType: "",
      searchData: "",
      // _img: ''
    });
  }

  cancle=(e)=>{
    e.preventDefault();
    this.setState({
      _id: '',
      preview: '',
      popupId: '',
      popupName: '',
      popupType: '',
      popupData: '',
      fileCollection: ''
      // _img: ''
    });
  }

  render(){
    return(
    <form>
      <div align="right">
        <input type="text" name="searchId" id="searchId" value={this.state.searchId} onChange={this.handleChange} placeholder="ID"></input> &nbsp;&nbsp;
        <input type="text" name="searchName" id="searchName" value={this.state.searchName} onChange={this.handleChange} placeholder="Name"></input> <p></p>
        <input type="text" name="searchType" id="searchType" value={this.state.searchType} onChange={this.handleChange} placeholder="Type"></input> &nbsp;&nbsp;
        <input type="text" name="searchData" id="searchData" value={this.state.searchData} onChange={this.handleChange} placeholder="Data"></input> <p></p>
        <input type="button" className="btn btn-warning text-light" value="ล้างข้อมูล" onClick={this.clear}></input> &nbsp;&nbsp;
        <input type="submit" value={"ค้นหา"} className={"btn btn-primary"} onClick={this.handleSubmit}/>
      </div>
      <p></p>
      <div>
        <table class="table table-bordered">
          <thead>
            <tr align="center">
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Data</th>
              <th>File</th>
              <th>Add & Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
          {this.state.arrayData.map((item, index) => (
            <tr key={index}>
              <td align="center">
                <span className="btn">
                  <img src={'/image/' + item.produce_img[0]} alt="" width="50" height="60" data-toggle="modal" data-target="#viewIMG" onClick={this.popup} 
                  // id={
                  // '{"_img":'+'{"jsonIMG0":"'+item.produce_img.jsonIMG0+'","jsonIMG1":"'+item.produce_img.jsonIMG1+'","jsonIMG2":"'+item.produce_img.jsonIMG2+'"}'+',"_id":"'+item._id+'", "item_id":"'+item.produce_id+'", "item_name":"'+item.produce_name+'", "item_type":"'+item.produce_type+'", "item_data":"'+item.produce_data+'"}'
                  // }
                  />
                  </span>
              </td>
              <td>{item.produce_id}</td>
              <td>{item.produce_name}</td>
              <td>{item.produce_type}</td>
              <td>{item.produce_data}</td>
              <td align="" className="text">
              {item.produce_file.map((file, indexfile) => (
                <tr key={indexfile}>
                  <a href={'/application/' + file} target="_blank"><i className="fas fa-file"></i> {file}</a>
                  </tr>
              ))}
              </td>
              <td align="center">
                <span className="btn text-primary">
                  <i className="fas fa-edit" data-toggle="modal" data-target="#popupEdit" onClick={this.popup} id={
                    '{"_img":"'+item.produce_img+'","_id":"'+item._id+'", "item_id":"'+item.produce_id+'", "item_name":"'+item.produce_name+'", "item_type":"'+item.produce_type+'", "item_data":"'+item.produce_data+'", "_file":"'+item.produce_file+'"}'
                  }></i>
                </span>
              </td>
              <td align="center">
                <span className="btn text-danger">
                  <i class="fas fa-trash-alt" onClick={this.handleDelete} id={'{"_id":"'+item._id+'", "_img":"'+item.produce_img+'", "_file":"'+item.produce_file+'"}'}></i>
                </span>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal fade" id="viewIMG" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body" align="center">
              <div id="Slide" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    {/* <img src={'/image/'+ this.state._img} alt="" width="290" height="310"/> */}
                  </div>
                  {/* <div className={this.state.count<2?"dis":"carousel-item"}>
                    <img src={'/image/'+ this.state._img.jsonIMG1} hidden={this.state.count<2} alt="" width="290" height="310"/>
                  </div>
                  <div className={this.state.count<3?"":"carousel-item"}>
                    <img src={'/image/'+ this.state._img.jsonIMG2} hidden={this.state.count<3} alt="" width="290" height="310"/>
                  </div> */}
                </div>
                <a className="carousel-control-prev" href="#Slide" role="button" data-slide="prev">
                  <span className="btn"><i className="fas fa-angle-double-left"></i></span>
                </a>
                <a className="carousel-control-next" href="#Slide" role="button" data-slide="next">
                  <span className="btn"><i className="fas fa-angle-double-right"></i></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="popupEdit" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">{"ID: "+this.state.popupId}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" align="center">
              {/* <img src={'/image/' + this.state._img.jsonIMG0} alt="" width="150" height="170"/>
              <img src={'/image/'+ this.state._img.jsonIMG1} hidden={this.state.count<2} alt="" width="150" height="170"/>
              <img src={'/image/'+ this.state._img.jsonIMG2} hidden={this.state.count<3} alt="" width="150" height="170"/>
              <img src={'/image/'+ this.state._img.jsonIMG3} hidden={this.state.count<4} alt="" width="150" height="170"/>
              <img src={'/image/'+ this.state._img.jsonIMG4} hidden={this.state.count<5} alt="" width="150" height="170"/> <p></p> */}

              {/* <input type="text" name="popupId" id="popupId" value={this.state.popupId} onChange={this.handleChange} placeholder="ID"></input> &nbsp;&nbsp; */}
              <input type="text" name="popupName" id="popupName" value={this.state.popupName} onChange={this.handleChange} placeholder="Name"></input> <p></p>
              <input type="text" name="popupType" id="popupType" value={this.state.popupType} onChange={this.handleChange} placeholder="Type"></input> <p></p>
              <input type="text" name="popupData" id="popupData" value={this.state.popupData} onChange={this.handleChange} placeholder="Data"></input> <p></p>
              
              <input type="file" id="fileCollection" name="fileCollection" onChange={this.handleUpload} multiple></input>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={this.cancle} data-dismiss="modal">ยกเลิก</button>
              <button type="button" className="btn btn-primary" onClick={this.Edit} data-dismiss="modal">บันทึก</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    )
  }
}