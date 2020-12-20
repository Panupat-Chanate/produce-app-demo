import React, { Component } from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';
import UserProfile from './session';

export default class Signin extends Component {
    constructor(props) {
        super(props);
        this.state={
            UserName: '',
            Password: '',
            errors: ''
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if(this.validate()){
            axios.post('/signin', this.state)
            .then((response) => {
                console.log(response)
                var checkedUser = response.data.checkedUser
                var checkedPass = response.data.checkedPass
                if (checkedUser === true) {
                    if (checkedPass === true) {
                        UserProfile.setName(this.state.UserName);
                        browserHistory.push("/");
                    } else {
                        alert("รหัสผ่านไม่ถูกต้อง");
                    }
                }
                if (checkedUser === false) {
                    alert("ชื่อผู้ใช้ไม่ถูกต้อง");
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    handleChange=(e)=>{
        this.setState({
          [e.target.id]: e.target.value
        });
    }

    validate(){
        let errors = {};
        let isValid = true;
    
        if (!this.state.UserName) {
          isValid = false;
          errors["UserName"] = "ป้อนชื่อผู้ใช้";
        }
    
        if (!this.state.Password) {
          isValid = false;
          errors["Password"] = "ป้อนรหัสผ่าน";
        }
    
        this.setState({
          errors: errors
        });
    
        return isValid;
    }

    render () {
        return (
            <form>
                <div align = "center" className="signmargin">
                    <div>
                        <i className="fas fa-user prefix"></i>
                        <input type="text" id="UserName" value={this.state.UserName} className="sign-input" placeholder="Username" onChange={this.handleChange}></input>
                        <br></br>
                        <span className="text-danger error">
                            <i className={this.state.errors.UserName?"fas fa-times-circle error":""}></i>
                            {this.state.errors.UserName}
                        </span>
                    </div>

                    <div>
                        <i class="fas fa-lock prefix"></i>
                        <input type="password" id="Password" value={this.state.Password} className="sign-input" placeholder="Password" onChange={this.handleChange}></input>
                        <br></br>
                        <span className="text-danger error">
                            <i className={this.state.errors.Password?"fas fa-times-circle error":""}></i>
                            {this.state.errors.Password}
                        </span>
                    </div>

                    <div>
                        <input type="submit" className="btn btn-primary" onClick={this.handleSubmit} value="เข้าสู่ระบบ"></input>
                        <span><a href="/signup">สมัครสมาชิก</a></span>
                    </div>
                </div>
            </form>
        )
    }
}