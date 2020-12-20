import React,{Component, useCallback} from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import Session from './session'

export default class Userhome extends Component{
  constructor() {
    super();
    this.state={
      searchId: '',
      searchName: '',
      searchType: '',
      searchData: '',
      arrayData: [],
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

  render(){
    return(
    <form>
      <div align="right">
        <input type="text" name="searchId" id="searchId" value={this.state.searchId} onChange={this.handleChange} placeholder="ID"></input> &nbsp;&nbsp;
        <input type="text" name="searchName" id="searchName" value={this.state.searchName} onChange={this.handleChange} placeholder="Name"></input> &nbsp;&nbsp;
        <input type="text" name="searchType" id="searchType" value={this.state.searchType} onChange={this.handleChange} placeholder="Type"></input> &nbsp;&nbsp;
        <input type="text" name="searchData" id="searchData" value={this.state.searchData} onChange={this.handleChange} placeholder="Data"></input> <p></p>
        <input type="submit" className="btn btn-primary" value={"ค้นหา"} className={"btn btn-primary"}
          onClick={this.handleSubmit}/>
      </div>
      <p></p>
      <div>
        <table className="table table-bordered">
          <thead>
            <tr align="center">
              <th>Image</th>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>Data</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
          {this.state.arrayData.map((item, index) => (
            <tr key={index}>
              <td align="center"><img src={'/image/'+ item.produce_img} alt="" width="50" height="60"/></td>
              <td>{item.produce_id}</td>
              <td>{item.produce_name}</td>
              <td>{item.produce_type}</td>
              <td>{item.produce_data}</td>
              <td></td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
    )
  }
}