import React from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';

export default function AddCustomer() {
    const { register, handleSubmit, setValue, errors } = useForm({
      // resolver: yupResolver(schema)
    });
    
    const onSubmit = data => {
      console.log(data)
      axios.post("/addCustomer",data)
        .then((response) => {
          alert("อัพโหลดข้อมูลเสร็จสิ้น");
        }).catch((error) => {
      });
      setValue("CustomerId", null)
      setValue("CustomerName", null)
      setValue("CustomerEmail", null)
      setValue("CustomerAddress", null)
      setValue("CustomerData", null)
    };

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)} align = "center" className="container p-5 col-md-6" >
      <div className="text-center text-uppercase text-muted"><h1>Customer Insert</h1></div>
      <p></p>
      <div className="card-header">
      <p></p>
      {/* <input type="file" name="picture" id="picture" className="col-sm-6" ref={register({required: "อัพโหลดไฟล์ PDF"})} multiple/>
      <span><p></p>{errors.picture?.message}</span> */}
      <p></p>
      <input type="text" name="CustomerId" className="col-sm-6" ref={register({required: "กรุณากรอกรหัสลูกค้า"})} placeholder="รหัสลูกค้า:" />
      <span><p></p>{errors.CustomerId?.message}</span>
      <p></p>
      <input type="text" name="CustomerName" className="col-sm-6" ref={register({required: "กรุณากรอกรายชื่อลูกค้า"})} placeholder="รายชื่อลูกค้า:" />
      <span><p></p>{errors.CustomerName?.message}</span>
      <p></p>
      <input type="email" name="CustomerEmail" className="col-sm-6" ref={register({required: "กรุณากรอก Email ลูกค้า"})} placeholder="Email:" />
      <span><p></p>{errors.CustomerEmail?.message}</span>
      <p></p>
      <input type="text" name="CustomerAddress" className="col-sm-6" ref={register({required: "กรุณากรอกข้อมูลที่อยู่ลูกค้า"})} placeholder="ข้อมูลที่อยู่ลูกค้า:" />
      <span><p></p>{errors.CustomerAddress?.message}</span>
      <p></p>
      <input type="text" name="CustomerData" className="col-sm-6" ref={register({required: "กรุณากรอกข้อมูลผลิตภัณฑ์ของลูกค้า"})} placeholder="ข้อมูลผลิตภัณฑ์ลูกค้า:" />
      <span><p></p>{errors.CustomerData?.message}</span>
      <p></p><p></p>
      <input type="submit" className="btn btn-primary" value="เพิ่มข้อมูลลูกค้า"/>&nbsp;&nbsp;
      <span><a href="/searchcustomer" className="btn btn-secondary">Back</a></span>
      <p></p>
      </div>
    </form>
    </div>
  );
}
