import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { browserHistory } from 'react-router';
import {connect} from 'react-redux'

function Signin() {
  const { register, handleSubmit, setValue, errors } = useForm();

  const onSubmit = data => {
    console.log(data)
    var value = {
      checkUser: data.UserName,
      checkPass: data.Password
    }
    axios.post('/signin', value)
    .then((response) => {
      var checkedUser = response.data.checkedUser
      var checkedPass = response.data.checkedPass

      if (checkedUser === true) {
        if (checkedPass === true) {
          var checkedLevel = response.data.checkedLevel[0].level
          if (checkedLevel === 0) {
            browserHistory.push("/produce");
          } else {
            browserHistory.push("/userhome");
          }
          this.props.dispatch({
            type:'LEVEL',
            checkedLevel
          })
        } else {
          alert("รหัสผ่านไม่ถูกต้อง");
          setValue("Password", null)
        }
      }
      if (checkedUser === false) {
        alert("ชื่อผู้ใช้ไม่ถูกต้อง");
        setValue("UserName", null)
        setValue("Password", null)
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  return (
    <div align = "center">
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" name="UserName" ref={register
        ({
          required: "กรุณากรอกชื่อผู้ใช้"
        })
      } placeholder="Username" />
      <p></p>
      <span >{errors.UserName?.message}</span>
      <p></p>
      <input type="password" name="Password" 
        ref={register
          ({
            required: "กรุณากรอกพาสเวิร์ด"
          })
        } placeholder="Password" />
      <p></p>
      <span >{errors.Password?.message}</span>
      <p></p>
      <input type="submit" className="btn btn-primary" value="เข้าสู่ระบบ"/>
      <span><a  href="/signup"> สมัครสมาชิก</a></span>
    </form>
    </div>
  );
}
export default connect()(Signin);