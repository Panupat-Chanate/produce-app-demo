import React, { Component, useRef } from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

export default class Signin extends Component {
    constructor(props) {
        super(props);
        this.state={
            UserName: '',
            Password: '',
            CPassword: '',
            errors: ''
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        if(this.validate()){
            var value = {
                UserName: this.state.UserName,
                Password: this.state.Password
              }
            axios.post('/signup', value)
            .then((response) => {
                var checkedState = response.data.checkedState
                if (checkedState === true) {
                alert("บุคคลนี้ได้ลงทะเบียนไปแล้ว");
                }
                if (checkedState === false) {
                alert("สมัครสมาชิกเสร็จสิ้น");
                this.setState({
                    UserName: '',
                    Password: '',
                    CPassword: ''
                })
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

        if (!this.state.CPassword) {
            isValid = false;
            errors["CPassword"] = "ป้อนรหัสผ่านอีกครั้ง";
        }

        if (this.state.Password !== this.state.CPassword) {
            isValid = false;
            errors["CPassword"] = "พาสเวิร์ดไม่ตรงกัน";
        }
    
        this.setState({
          errors: errors
        });
    
        return isValid;
    }

    render () {
        return (
            
            <form>
                <div align = "center">
                    <input type="text" id="UserName" value={this.state.UserName} placeholder="Username" onChange={this.handleChange}></input>
                    <p></p>
                    <span className="text-danger">{this.state.errors.UserName}</span>
                    <p></p>

                    <input type="password" id="Password" value={this.state.Password} placeholder="Password" onChange={this.handleChange}></input>
                    <p></p>
                    <span className="text-danger">{this.state.errors.Password}</span>
                    <p></p>

                    <input type="password" id="CPassword" value={this.state.CPassword} placeholder="Confirm-Password" onChange={this.handleChange}></input>
                    <p></p>
                    <span className="text-danger">{this.state.errors.CPassword}</span>
                    <p></p>

                    <input type="submit" className="btn btn-primary" onClick={this.handleSubmit} value="สมัครสมาชิก"></input>
                    <span><a  href="/"> เข้าสู่ระบบ</a></span>
                </div>
            </form>
        )
    }
}