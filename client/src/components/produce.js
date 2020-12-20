import React,{Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import {Card, InputGroup, Button, FormControl} from 'react-bootstrap';
import UserProfile from './session';

UserProfile.getName();

export default class Produce extends Component{
  constructor() {
    super();
    this.state={
      _id: '',
      searchId: '',
      searchName: '',
      searchType: '',
      searchDetail: '',
      _img: [],
      _file: [],
      _notEqual: [],
      _equal: [],
      currentPage: 1,
      dataPage: 10,

      popupName: '',
      popupId: '',
      popupType: '',
      popupDetail: '',
      popupFile: [],
      fileCollection: '',

      arrayData: [],
      level: '',
      checked: []
    }
    this.handleUpload = this.handleUpload.bind(this)
  }

  getSession=() => {
    axios.get('/checkSession', {withCredentials: true})
    .then(response => {
      console.log(response.data)
      if (response.data.logedin) {
        if (response.data.level === 0) {
          this.setState({
            level: false
          })
          return console.log("admin")
        }
        this.setState({
          level: true
        })
        return console.log("user")
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
    };
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
    console.log(e.target.id)
    console.log(this.state.fileCollection)
    const formData = new FormData();
    for (const key of Object.keys(this.state.fileCollection)) {
      formData.append('fileCollection', this.state.fileCollection[key])
    }
    formData.append('edit_id', this.state._id)
    formData.append('editName', this.state.popupName)
    formData.append('editType', this.state.popupType)
    formData.append('editDetail', this.state.popupDetail)
    formData.append('oldFile', this.state._file)
    axios.post("/editproduce",formData)
    .then((response) => {
      this.handleSubmit(e);
    }).catch((error) => {
      console.log(error)
    });
  }

  popupDelete=(e)=>{
    console.log(e.target.id)
    var notEqual = []
    var equal = []
    for (const value in this.state._notEqual) {
      if (`${this.state._file[value]}` !== e.target.id) {
        notEqual.push(`${this.state._file[value]}`)
        console.log(notEqual)
      } else {
        equal.push(`${this.state._file[value]}`)
        console.log(equal)
      }
    }
    this.setState({
      _notEqual: notEqual,
      _equal: equal
    })
  }

  deleteFile=(e)=>{
    // this.setState({
    //   _file: this.state._deleteFile
    // })
    const value = {
      _id: this.state._id,
      _notEqual: this.state._notEqual,
      _equal: this.state._equal
    }
    axios.post("/deletefile", value)
    .then((response) => {
      // this.handleSubmit(e);
    }).catch((error) => {
      console.log(error)
    });
  }

  popup=(e)=>{
    const Item = JSON.parse(e.target.id)
    this.setState({
      _id: Item._id,
      _img: Item._img,
      popupId: Item.item_id,
      popupName: Item.item_name,
      popupType: Item.item_type,
      popupDetail: Item.item_detail,
      _file: Item._file.split(','),
      _notEqual: Item._file.split(',')
    });
    // console.log(this.state._file)
  }

  clear=(e)=>{
    e.preventDefault();
    this.setState({
      editItem: false,
      searchId: "",
      searchName: "",
      searchType: "",
      searchDetail: "",
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
      popupDetail: '',
      fileCollection: ''
      // _img: ''
    });
  }

  Firstpage = () => {
    if(this.state.currentPage > 1) {
        this.setState({
            currentPage: 1
        });
    }
  };

  Prevpage = () => {
      if(this.state.currentPage > 1) {
          this.setState({
              currentPage: this.state.currentPage - 1
          });
      }
  };


  Lastpage = () => {
      if(this.state.currentPage < Math.ceil(this.state.arrayData.length / this.state.dataPage)) {
          this.setState({
              currentPage: Math.ceil(this.state.arrayData.length / this.state.dataPage)
          });
      }
  };


  Nextpage = () => {
    if(this.state.currentPage < Math.ceil(this.state.arrayData.length / this.state.dataPage)) {
        this.setState({
            currentPage: this.state.currentPage + 1
        });
    }
  };


  render(){
    const {arrayData, currentPage, dataPage} = this.state;
    const lastindex = currentPage * dataPage;
    const firstindex = lastindex - dataPage;
    const currentData = arrayData.slice(firstindex, lastindex);
    const totalPage = arrayData.length / dataPage;

    const pageNum = {
        width: "60px",
        border: "none",
        color: "",
        textAlign: "center",
        fontWeight: "bold"
    };

    return(
    <form>
      <div  align="right" className="">
        {/* <label className="sr-only" for="inlineFormInputGroupUsername2">Username</label>
        <div className="input-group mb-2 mr-sm-2">
          <div className="input-group-prepend">
            <div className="input-group-text">@</div>
          </div>
          <input type="text" className="form-control" id="inlineFormInputGroupUsername2" placeholder="Username"/>
        </div> */}
        <i class="fas fa-passport"></i><input type="text" name="searchId" id="searchId" className="produce-input" value={this.state.searchId} onChange={this.handleChange} placeholder="ID"></input> &nbsp;&nbsp;
        <i class="fas fa-font"></i><input type="text" name="searchName" id="searchName" className="produce-input" value={this.state.searchName} onChange={this.handleChange} placeholder="Name"></input> &nbsp;&nbsp;
        <i class="fas fa-swatchbook"></i><input type="text" name="searchType" id="searchType" className="produce-input" value={this.state.searchType} onChange={this.handleChange} placeholder="Type"></input> &nbsp;&nbsp;
        <i class="fas fa-info-circle"></i><input type="text" name="searchDetail" id="searchDetail" className="produce-input" value={this.state.searchDetail} onChange={this.handleChange} placeholder="Detail"></input> <p></p>
        <span type="button" className="btn btn-warning text-light" value="ล้างข้อมูล" onClick={this.clear}><i class="fas fa-brush"></i> ล้างข้อมูล</span> &nbsp;&nbsp;
        <button type="submit" className={"btn btn-primary"} onClick={this.handleSubmit}><i className="fas fa-search"></i> ค้นหา</button>
      </div>
      <p></p>
      <div>
        <Card>
              {/* <Card.Header><div align="right"> <span><a  href="/addcustomer" className="btn btn-primary">+Add Cutomer</a></span> </div></Card.Header> */}
          <Card.Body>
            <table class="table table-striped">
              <thead>
                <tr align="center">
                  <th width="5%"><input type="checkbox"/></th>
                  <th width="5%">Image</th>
                  <th width="5%">ID</th>
                  <th width="10%">Name</th>
                  <th width="10%">Type</th>
                  <th width="25%">Detail</th>
                  <th width="20%">File</th>
                  <th hidden={this.state.level} width="20%">Action</th>
                </tr>
              </thead>
              <tbody>
              {currentData.map((item, index) => (
                <tr key={index} align="">
                  <td align="center"><input type="checkbox"></input></td>
                  <td align="center">
                    <span className="btn">
                      <img src={'/image/' + item.produce_img[0]} alt="" width="50" height="60" data-toggle="modal" data-target="#viewIMG" onClick={this.popup} 
                      id={
                        '{"_img":"'+item.produce_img+'","_id":"'+item._id+'", "item_id":"'+item.produce_id+'", "item_name":"'+item.produce_name+'", "item_type":"'+item.produce_type+'", "item_detail":"'+item.produce_detail+'", "_file":"'+item.produce_file+'"}'
                      }
                      />
                      </span>
                  </td>
                  <td align="center">{item.produce_id}</td>
                  <td align="center">{item.produce_name}</td>
                  <td align="center">{item.produce_type}</td>
                  <td>{item.produce_detail}</td>
                  <td align="left">
                  {item.produce_file.map((file, indexfile) => (
                    <tr key={indexfile}>
                      <a href={'/application/' + file} target="_blank" hidden={file?false:true}><i className="fas fa-file"></i> {file}</a>
                    </tr>
                  ))}
                  </td>
                  <td align="center" hidden={this.state.level}>
                      <span className="btn text-primary">
                        <i className="fas fa-edit" data-toggle="modal" data-target="#popupEdit" onClick={this.popup} id={
                          '{"_img":"'+item.produce_img+'","_id":"'+item._id+'", "item_id":"'+item.produce_id+'", "item_name":"'+item.produce_name+'", "item_type":"'+item.produce_type+'", "item_detail":"'+item.produce_detail+'", "_file":"'+item.produce_file+'"}'
                        }></i>
                      </span>
  
                      <span className="btn text-primary">
                        <i className="fas fa-folder-minus" data-toggle="modal" data-target="#popupDelete" onClick={this.popup} id={
                          '{"_img":"'+item.produce_img+'","_id":"'+item._id+'", "item_id":"'+item.produce_id+'", "item_name":"'+item.produce_name+'", "item_type":"'+item.produce_type+'", "item_data":"'+item.produce_detail+'", "_file":"'+item.produce_file+'"}'
                        }></i>
                      </span>

                      <span className="btn text-danger">
                        <i class="fas fa-trash-alt" onClick={this.handleDelete} id={'{"_id":"'+item._id+'", "_img":"'+item.produce_img+'", "_file":"'+item.produce_file+'"}'}></i>
                      </span>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          </Card.Body>
          <Card.Footer>
            <div style={{"float":"right"}}>
              <InputGroup size="sm">
                <InputGroup.Prepend>
                  <Button type="button" variant="secondary" disabled={currentPage === 1 ? true:false} onClick={this.Firstpage}>
                    <i class="fas fa-angle-double-left"></i> First
                  </Button>
                  <Button type="button" variant="secondary" disabled={currentPage === 1 ? true:false} onClick={this.Prevpage}>
                    <i class="fas fa-angle-left"></i> Prev
                  </Button>
                </InputGroup.Prepend>
                <FormControl style={pageNum} value={currentPage} disabled></FormControl>        
                <InputGroup.Append>
                  <Button type="button" variant="secondary" disabled={currentPage === totalPage ? true:false} onClick={this.Nextpage}>
                    Next <i class="fas fa-angle-right"></i>
                  </Button>
                  <Button type="button" variant="secondary" disabled={currentPage === totalPage ? true:false} onClick={this.Lastpage}>
                    Last <i class="fas fa-angle-double-right"></i>
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </div>
          </Card.Footer>
        </Card>
      </div>

      <div className="modal fade" id="viewIMG" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body" align="center">
              <div id="Slide" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img src={'/image/'+ this.state._img} alt="" width="290" height="310"/>
                  </div>
                  {/* <div className={this.state.count<2?"dis":"carousel-item"}>
                    <img src={'/image/'+ this.state._img.jsonIMG1} hidden={this.state.count<2} alt="" width="290" height="310"/>
                  </div>
                  <div className={this.state.count<3?"":"carousel-item"}>
                    <img src={'/image/'+ this.state._img.jsonIMG2} hidden={this.state.count<3} alt="" width="290" height="310"/>
                  </div> */}
                </div>
                {/* <a className="carousel-control-prev" href="#Slide" role="button" data-slide="prev">
                  <span className="btn"><i className="fas fa-angle-double-left"></i></span>
                </a> */}
                {/* <a className="carousel-control-next" href="#Slide" role="button" data-slide="next">
                  <span className="btn"><i className="fas fa-angle-double-right"></i></span>
                </a> */}
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
              <textarea  rows="5" cos="28" className="col-sm-6" type="text" name="popupDetail" id="popupDetail" value={this.state.popupDetail} onChange={this.handleChange} placeholder="Detail"></textarea> <p></p>

              <input type="file" id="fileCollection" name="fileCollection" onChange={this.handleUpload} multiple></input>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={this.cancle} data-dismiss="modal">ยกเลิก</button>
              <button type="button" className="btn btn-primary" onClick={this.Edit} data-dismiss="modal">บันทึก</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="popupDelete" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">{"ID: "+this.state.popupId}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body" align="center">
              <div class="form-check">
              {this.state._notEqual.map((file, indexfile) => (
                <tr key={indexfile}>
                  <td>
                    <span className="btn text-danger">
                      {file} <i className="fas fa-trash" onClick={this.popupDelete} id={file}></i><br />
                    </span>
                  </td>
                </tr>
              ))}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={this.cancle} data-dismiss="modal">ยกเลิก</button>
              <button type="button" className="btn btn-primary" onClick={this.deleteFile} data-dismiss="modal">บันทึก</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    )
  }
}