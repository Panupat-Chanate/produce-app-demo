import React,{Component, useState} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import Session from './session'

export default class Home extends Component{
  constructor() {
    super();
    this.state={
      _id: '',
      searchId: '',
      searchName: '',
      searchType: '',
      searchData: '',
      _img: '',

      popupName: '',
      popupId: '',
      popupType: '',
      popupData: '',

      arrayData: [],
      editItem: false,
      originAll: {
        origin_id: '',
        originId: '',
        originName: '',
        originType: '',
        originData: ''
      }
    }
  }

  getSession=() => {
    axios.get('/checkSession', {withCredentials: true})
    .then(response => {
      console.log(response.data)
      if (response.data) {
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
      this.setState({
        arrayData: []
      })
      const numbers = response.data
      console.log(numbers)
      var concatData = this.state.arrayData.concat(response.data);
      this.setState({ 
        arrayData: concatData,
        originAll: {
          originId: this.state.searchId,
          originName: this.state.searchName,
          originType: this.state.searchType,
          originData: this.state.searchData
        }
      })
      // console.log(this.state.arrayData[20].produce_img)
    }).catch((error) => {
      console.log(error)
    });
  }

  handleChange=(e)=>{
    this.setState({
      [e.target.id]: e.target.value
    });
  }
  handleDelete=(e)=>{
    console.log(e.target.id)
    var value = {
      delId: e.target.id
    }
    axios.post("/deleteproduce",value)
    .then((response) => {
      this.handleSubmit(e);
    }).catch((error) => {
      console.log(error)
    });
  }
  beforeEdit=(e)=>{
    const Item = JSON.parse(e.target.id)
    this.setState({
      editItem: true,
      _id: Item._id,
      searchId: Item.item_id,
      searchName: Item.item_name,
      searchType: Item.item_type,
      searchData: Item.item_data,
      _img: Item._img
    });
  }
  afterEdit=(e)=>{
    e.preventDefault();
    var value = {
      edit_id: this.state._id,
      editId: this.state.searchId,
      editName: this.state.searchName,
      editType: this.state.searchType,
      editData: this.state.searchData
    }
    axios.post("/editproduce",value)
    .then((response) => {
      this.setState({
        editItem: false,
        searchId: this.state.originAll.originId,
        searchName: this.state.originAll.originName,
        searchType: this.state.originAll.originType,
        searchData: this.state.originAll.originData,
        _img: ''
      })
      this.handleSubmit(e);
    }).catch((error) => {
      console.log(error)
    });
  }

  popup=(e)=>{
    const Item = JSON.parse(e.target.id)
    this.setState({
      _img: Item._img,
      popupId: Item.item_id,
      popupName: Item.item_name,
      popupType: Item.item_type,
      popupData: Item.item_data,
    });
  }

  cancle=(e)=>{
    e.preventDefault();
    this.setState({
      editItem: false,
      searchId: this.state.originAll.originId,
      searchName: this.state.originAll.originName,
      searchType: this.state.originAll.originType,
      searchData: this.state.originAll.originData,
      // _img: ''
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
      _img: ''
    });
  }

  render(){
    return(
    <form>
      <div align="right">
        <img src={'/image/'+ this.state._img} hidden={this.state.editItem?false:true} alt="" width="50" height="60"/> &nbsp;&nbsp;
        <img src={'/image/'+ this.state._img} hidden={this.state.editItem?false:true} alt="" width="50" height="60"/> &nbsp;&nbsp;
        <img src={'/image/'+ this.state._img} hidden={this.state.editItem?false:true} alt="" width="50" height="60"/> <p></p>
        <input type="file" name="picture" id="picture" hidden={this.state.editItem?false:true}/> <p></p>
        <input type="text" name="searchId" id="searchId" value={this.state.searchId} onChange={this.handleChange} placeholder="ID"></input> &nbsp;&nbsp;
        <input type="text" name="searchName" id="searchName" value={this.state.searchName} onChange={this.handleChange} placeholder="Name"></input> <p></p>
        <input type="text" name="searchType" id="searchType" value={this.state.searchType} onChange={this.handleChange} placeholder="Type"></input> &nbsp;&nbsp;
        <input type="text" name="searchData" id="searchData" value={this.state.searchData} onChange={this.handleChange} placeholder="Data"></input> <p></p>
        <input type="button" value="ยกเลิก" className="btn btn-danger" disabled={!this.state.editItem}
          onClick={this.cancle}/> &nbsp;&nbsp;
        <input type="button" className="btn btn-warning text-light" value="ล้างข้อมูล" onClick={this.clear}></input> &nbsp;&nbsp;
        <input type="submit" value={this.state.editItem?"บันทึก":"ค้นหา"} className={this.state.editItem?"btn btn-success":"btn btn-primary"}
          onClick={this.state.editItem?this.afterEdit:this.handleSubmit}/>
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
              <th>Download</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
          {this.state.arrayData.map((item, index) => (
            <tr key={index}>
              <td align="center"><img src={'/image/'+ item.produce_img} alt="" width="50" height="60" data-toggle="modal" data-target="#exampleModalCenter" onClick={this.popup} id={
                  '{ "_img":"'+item.produce_img+'","_id":"'+item._id+'", "item_id":"'+item.produce_id+'", "item_name":"'+item.produce_name+'", "item_type":"'+item.produce_type+'", "item_data":"'+item.produce_data+'"}'
              }/></td>
              <td>{item.produce_id}</td>
              <td>{item.produce_name}</td>
              <td>{item.produce_type}</td>
              <td>{item.produce_data}</td>
              <td align="center" className="text"><i class="fas fa-file-download"></i></td>
              <td align="center" className="text-primary">
                <i class="fas fa-edit" onClick={this.beforeEdit} id={
                  '{ "_img":"'+item.produce_img+'","_id":"'+item._id+'", "item_id":"'+item.produce_id+'", "item_name":"'+item.produce_name+'", "item_type":"'+item.produce_type+'", "item_data":"'+item.produce_data+'"}'
                }></i>
              </td>
              <td align="center" className="text-danger">
                <i class="fas fa-trash-alt" onClick={this.handleDelete} id={item._id}></i>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            {/* <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">{"Name: "+this.state.popupName}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div> */}
            <div className="modal-body" align="center">
              <button type="button" className="btn"><i class="fas fa-angle-double-left"></i></button> &nbsp;
              <img src={'/image/'+ this.state._img} alt="" width="290" height="310"/> &nbsp;
              <button type="button" className="btn"><i class="fas fa-angle-double-right"></i></button> &nbsp;
            </div>
            {/* <div className="modal-footer">
              <h5 className="modal-body" id="exampleModalLongTitle">{"ID: "+this.state.popupId}</h5>
              <h5 className="modal-body" id="exampleModalLongTitle">{"Name: "+this.state.popupName}</h5>
              <h5 className="modal-body" id="exampleModalLongTitle">{"Type: "+this.state.popupType}</h5>
              <h5 className="modal-body" id="exampleModalLongTitle">{"Data: "+this.state.popupData}</h5>
            </div> */}
          </div>
        </div>
      </div>
    </form>
    )
  }
}