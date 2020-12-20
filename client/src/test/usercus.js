import React,{Component} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import {Card, InputGroup, Button, FormControl} from 'react-bootstrap';



export default class UserCustomer extends Component{
  constructor() {
    super();
    this.state={
      searchcusId: '',
      searchcusName: '',
      searchcusEmail: '',
      searchcusData: '',
      arrayData: [],
      currentPage: 1,
      dataPage: 5
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
    axios.post("/searchcustomer",this.state)
    .then((response) => {
      this.setState({
        arrayData: []
      });
      const numbers = response.data
      console.log(numbers)
      var concatData = this.state.arrayData.concat(response.data);
      this.setState({ 
        arrayData: concatData,
        // originAll: {
        //   originId: this.state.searchId,
        //   originName: this.state.searchName,
        //   originType: this.state.searchType,
        //   originData: this.state.searchData
        // }
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
        border: "1px solid #000000",
        color: "ffffff",
        textAlign: "center",
        fontWeight: "bold",
        variant:"outline-secondary"
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
        <input type="submit" value={"ค้นหา"} className={"btn btn-success"}
          onClick={this.handleSubmit}/>
           &nbsp;&nbsp;
           <span><a href="/userhome" className="btn btn-secondary">Back</a></span>
      </div>
      <p></p>
      <div className="modal fade" id="popupEdit" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">  
            <div className="modal-body">
            <p></p>
            <h2 className=" text-center text-uppercase text-muted">View Customer</h2>
                <div text-align="right" className="card-header p-4">
                  <label>ID:</label>&nbsp;&nbsp;
                  <a>{this.state.popupId}</a>
                  <p></p>
                  <label>Name:</label>&nbsp;&nbsp;
                  <a>{this.state.popupName}</a>
                  <p></p>
                  <label>Email:</label>&nbsp;&nbsp;
                  <a>{this.state.popupEmail}</a>
                  <p></p>
                  <label>Address:</label>&nbsp;&nbsp;
                  <a>{this.state.popupAddress}</a>
                  <p></p>
                  <label>Product Data:</label>&nbsp;&nbsp;
                  <a>{this.state.popupData}</a>
                </div>
                <div className="modal-body" align="right">
                  <button type="button" className="btn btn-secondary" onClick={this.cancle} data-dismiss="modal">Back</button>
                </div>
            </div>
          </div>
        </div>
      </div>

        <div>
            <Card>
                {/* <Card.Header>Test</Card.Header> */}
                <Card.Body>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                        <th width="10%">ID</th>
                        <th width="10%">Name</th>
                        <th width="15%">Email</th>
                        <th width="25%">Address</th>
                        <th width="30%">Product Data</th>
                        <th width="10%">View</th> 
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
                        <td className="text-success">
                            <i class="far fa-eye"  data-toggle="modal" data-target="#popupEdit" onClick={this.popup} id={
                            '{ "id":"'+item.id+'", "item_id":"'+item.customer_id+'", "item_name":"'+item.customer_name+'", "item_email":"'+item.customer_email+'", "item_address":"'+item.customer_address+'", "item_data":"'+item.customer_data+'"}'
                            }></i>
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

                                <i class="fas fa-angle-double-left"></i>&nbsp;&nbsp;First
                                </Button>
                                <Button type="button" variant="secondary"  disabled={currentPage === 1 ? true:false} onClick={this.Prevpage}>

                                <i class="fas fa-angle-left"></i>&nbsp;&nbsp;Prev
                                </Button>
                            </InputGroup.Prepend>
                            <FormControl style={pageNum} value={currentPage} disabled></FormControl>
                            <InputGroup.Append>
                                <Button  type="button" variant="secondary"  disabled={currentPage === totalPage ? true:false} onClick={this.Nextpage}>

                                <i class="fas fa-angle-right"></i>&nbsp;&nbsp;Next
                                </Button>
                                <Button  type="button" variant="secondary"  disabled={currentPage === totalPage ? true:false} onClick={this.Lastpage}>

                                <i class="fas fa-angle-double-right"></i>&nbsp;&nbsp;Last
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </div>
                </Card.Footer>
            </Card>
        </div>

    </form>
    )
  }
}