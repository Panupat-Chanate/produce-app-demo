import React,{Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import {Card, InputGroup, Button, FormControl} from 'react-bootstrap';
// import ReactToPrint from 'react-to-print';

export default class HomeCustomer extends Component{
  constructor() {
    super();
    this.state={
      id: '',
      searchcusId: '',
      searchcusName: '',
      searchcusEmail: '',
      searchcusAddress: '',
      searchcusData: '',
      arrayData: [],
      currentPage: 1,
      dataPage: 5,
      editItem: false,
      originAll: {
        originid: '',
        originId: '',
        originName: '',
        originEmail: '',
        originAddress: '',
        originData: '',
        
      }
    }
  }

  getSession=() => {
    axios.get('/checkSession', {withCredentials: true})
    .then(response => {
      console.log(response.data)
      if (response.data) {

      }else {
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
    axios.post("/searchcustomer",this.state)
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
          originId: this.state.searchcusId,
          originName: this.state.searchcusName,
          originEmail: this.state.searchcusEmail,
          originAddress: this.state.searchcusAddress,
          originData: this.state.searchcusData
        }
      })
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
    axios.post("/deletecustomer",value)
    .then((response) => {
      this.handleSubmit(e);
    }).catch((error) => {
      console.log(error)
    });
  }

  cancle=(e)=>{
    e.preventDefault();
    this.setState({
      editItem: false,
      searchcusId: this.state.originAll.originId,
      searchcusName: this.state.originAll.originName,
      searchcusEmail: this.state.originAll.originEmail,
      searchcusAddress: this.state.originAll.originAddress,
      searchcusData: this.state.originAll.originData  
      
    });
  }

  Edit=(e)=>{
    e.preventDefault();
    var value = {
          edit_id: this.state.id,
          editId: this.state.popupId,
          editName: this.state.popupName,
          editEmail: this.state.popupEmail,
          editAddress: this.state.popupAddress,
          editData: this.state.popupData
    }
    axios.post("/editcustomer",value)
    .then((response) => {
      this.handleSubmit(e);
    }).catch((error) => {
      console.log(error)
    });
  }

  popup=(e)=>{
    const Item = JSON.parse(e.target.id)
    console.log(e.target.id)
    this.setState({
      id: Item.id,    
      popupId: Item.item_id,
      popupName: Item.item_name,
      popupEmail: Item.item_email,
      popupAddress: Item.item_address,
      popupData: Item.item_data
   
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
        border: "1px solid #17A2BB",
        color: "17A2BB",
        textAlign: "center",
        fontWeight: "bold"
    };

    return(
    <form>
      <div align="center" className="card-header p-2">
      <h1 className=" text-center text-uppercase text-muted">Customer Page</h1>
      <p></p>
        <input type="text" name="searchcusId" id="searchcusId" value={this.state.searchcusId} onChange={this.handleChange} placeholder="ID"></input> &nbsp;&nbsp;
        <input type="text" name="searchcusName" id="searchcusName" value={this.state.searchcusName} onChange={this.handleChange} placeholder="Name"></input> &nbsp;&nbsp;
        <input type="text" name="searchcusEmail" id="searchcusEmail" value={this.state.searchcusEmail} onChange={this.handleChange} placeholder="Email"></input> &nbsp;&nbsp;
        <p></p>
        <input type="text" name="searchcusAddress" id="searchcusAddress" value={this.state.searchcusAddress} onChange={this.handleChange} placeholder="Address"></input> &nbsp;&nbsp;
        <input type="text" name="searchcusData" id="searchcusData" value={this.state.searchcusData} onChange={this.handleChange} placeholder="Produce Data"></input> &nbsp;&nbsp;
        <p></p>
           <input type="submit" value={"ค้นหา"} className={"btn btn-success"} onClick={this.handleSubmit}/>&nbsp;&nbsp;
           <span><a  href="/homepop" className="btn btn-secondary">Back</a></span>&nbsp;&nbsp; 
           <span><a  href="/addcustomer" className="btn btn-primary">+Add Cutomer</a></span>
         
      </div>
    
      <p></p>
      <div>
        <Card>
            {/* <Card.Header><div align="right"> <span><a  href="/addcustomer" className="btn btn-primary">+Add Cutomer</a></span> </div></Card.Header> */}
              <Card.Body>
        <table class="table table-bordered"> 
          <thead>
            <tr>
              <th width="10%">ID</th>
              <th width="10%">Name</th>
              <th width="15%">Email</th>
              <th width="25%">Address</th>
              <th width="25%">Product Data</th>
              <th width="5%">PDF</th> 
              <th width="5%">Edit</th>
              <th width="5%">Delete</th>
            </tr>
          </thead>
          <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td>{item.customer_id}</td>
              <td>{item.customer_name}</td>
              <td>{item.customer_email}</td>
              <td>{item.customer_address}</td>
              <td>{item.customer_data}</td>
              <td align="center" className="text-secondary">
                <i class="far fa-file-pdf"></i>
              </td>
              <td align="center" className="text-primary">
                <i class="fas fa-edit"  data-toggle="modal" data-target="#popupEdit" onClick={this.popup} id={
                  '{ "id":"'+item.id+'", "item_id":"'+item.customer_id+'", "item_name":"'+item.customer_name+'", "item_email":"'+item.customer_email+'", "item_address":"'+item.customer_address+'", "item_data":"'+item.customer_data+'"}'
                }></i>
              </td>
              <td align="center" className="text-danger">
                <i class="fas fa-trash-alt" onClick={this.handleDelete} id={item.id}></i>
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

                                <i class="fas fa-angle-double-left"></i>First
                                </Button>
                                <Button type="button" variant="secondary" disabled={currentPage === 1 ? true:false} onClick={this.Prevpage}>

                                <i class="fas fa-angle-left"></i>Prev
                                </Button>
                            </InputGroup.Prepend>
                            <FormControl style={pageNum} value={currentPage} disabled></FormControl>
                            {/* <FormLabel style={pageNum} name="currentPage" placeholder={currentPage}></FormLabel> */}
                            <InputGroup.Append>
                                <Button type="button" variant="secondary" disabled={currentPage === totalPage ? true:false} onClick={this.Nextpage}>

                                <i class="fas fa-angle-right"></i>Next
                                </Button>
                                <Button type="button" variant="secondary" disabled={currentPage === totalPage ? true:false} onClick={this.Lastpage}>

                                <i class="fas fa-angle-double-right"></i>Last
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </Card.Footer>
            </Card>
      </div>

      <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body" align="center">
              <button type="button" className="btn"><i class="fas fa-angle-double-left"></i></button> &nbsp;
              <button type="button" className="btn"><i class="fas fa-angle-double-right"></i></button> &nbsp;
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="popupEdit" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="modal-body" align="center">
              <h2>Edit Customer</h2>
            <p></p>
                <input type="text" name="popupId" id="popupId" value={this.state.popupId} onChange={this.handleChange} placeholder="ID"></input> &nbsp;&nbsp;
                <input type="text" name="popupName" id="popupName" value={this.state.popupName} onChange={this.handleChange} placeholder="Name"></input> <p></p>
                <input type="text" name="popupEmail" id="popupEmail" value={this.state.popupEmail} onChange={this.handleChange} placeholder="Email"></input> &nbsp;&nbsp;
                <input type="text" name="popupAddress" id="popupAddress" value={this.state.popupAddress} onChange={this.handleChange} placeholder="Address"></input> <p></p>
                <input type="text" name="popupData" id="popupData" value={this.state.popupData} onChange={this.handleChange} placeholder="Product Data"></input> <p></p>
                
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={this.Edit} data-dismiss="modal">บันทึก</button>
                <button type="button" className="btn btn-secondary" onClick={this.cancle} data-dismiss="modal">ยกเลิก</button>
                
           </div>
          </div>
        </div>
      </div>
    </form>
    )
  }
}