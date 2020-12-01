import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
// import { yupResolver } from '@hookform/resolvers';
// import * as Yup from "yup";

// const schema = Yup.object().shape({
//   UserName: Yup.string()
//     .required('ป้อนชื่อผู้ใช้')
//     .matches(/[A-Za-z0-9]+/ , 'กรุณากรอกให้ถูกต้อง')
//     .min(2, 'สั้นเกินไป')
//     .max(30, 'ยาวเกินไป'),
//   Password: Yup.string()
//     .required('ป้อนพาสเวิร์ด')
//     .matches(/[A-Za-z0-9]+/ , 'กรุณากรอกให้ถูกต้อง')
//     .min(8, 'สั้นเกินไป')
//     .max(8, 'ยาวเกินไป'),
//   CPassword: Yup.string()
//     .required('ยืนยันพาสเวิร์ด')
//     .matches(/[A-Za-z0-9]+/ , 'กรุณากรอกให้ถูกต้อง')
//     .min(8, 'สั้นเกินไป')
//     .max(8, 'ยาวเกินไป'),
//   // picture: Yup.mixed()
//   //   .test("type", "ไฟล์ .jpeg เท่านั้น", (value) => {
//   //     return value && value[0].type === 'image/jpeg';
//   //   })
//   //   .test("fileSize", "ไฟล์ขนาดใหญ่เกินไป", (value) => {
//   //     return value && value[0].size <= 5000000;
//   //   })
// });

export default function Signup() {
    const { register, handleSubmit, setValue, errors, watch } = useForm({
      // resolver: yupResolver(schema)
    });
    const [file, setFile] = useState('');
    const password = useRef({});
    password.current = watch("Password", "");

    const onSubmit = data => {
      console.log(data)
      var value = {
        checkUser: data.UserName
      }
      axios.post('/signup', data)
      .then((response) => {
        var checkedState = response.data.checkedState
        if (checkedState === true) {
          alert("บุคคลนี้ได้ลงทะเบียนไปแล้ว");
        }
        if (checkedState === false) {
          alert("สมัครสมาชิกเสร็จสิ้น");
          setValue("UserName", null)
          setValue("Password", null)
          setValue("CPassword", null)
          setValue("picture", null)
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
          required: "กรุณากรอกชื่อผู้ใช้",
          minLength: {
            value: 2,
            message: "สั้นเกินไป"
          }
        })
      } placeholder="Username" />
      <p></p>
      <span >{errors.UserName?.message}</span>
      <p></p>
      <input type="password" name="Password" 
        ref={register
          ({
            required: "กรุณากรอกพาสเวิร์ด",
            minLength: {
              value: 8,
              message: "พาสเวิร์ดมีอย่างน้อย 8 ตัว"
            }
          })
        } placeholder="Password" />
      <p></p>
      <span >{errors.Password?.message}</span>
      <p></p>
      <input type="password" name="CPassword" ref={register
        ({
          validate: value =>
            value === password.current || "พาสเวิร์ดไม่ตรงกัน"
        })
      } placeholder="Confirm-Password" />
      <p></p>
      <span >{errors.CPassword?.message}</span>
      <p></p>
      {/* <input type="file"  name="picture" id="file" ref={register({required: "อัพโหลดรูปโปรไฟล์"})} onChange={handleSelect} />
      <span >{errors.picture?.message}</span>
      <p></p> */}
      <input type="submit" className="btn btn-primary" value="สมัครสมาชิก"/>
      <span><a  href="/"> เข้าสู่ระบบ</a></span>
    </form>
    </div>
  );
}