const express = require('express');
const { isEmpty } = require('lodash');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database : 'project_produce'
  });
con.connect(function(err) {
    if (err) return console.log(err);
    console.log("MySQL Connected");
});

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,"D:/OSD/produces-demo/client/public/"+file.mimetype.split('/', 1)+"");
        // cb(null,"D:/OSD/demo/client/public/"+file.originalname.substr(file.originalname.indexOf('.')+1)+"");
    },
    filename: function(req, file, cb){
       cb(null,"PRODUCE-" + Date.now() + path.extname(file.originalname));
    }
 });
const upload = multer({
    storage: storage,
// limits:{fileSize: 1000000},
})

router.post('/signup', async (req, res) => {
    console.log(req.body)
    sql = "SELECT username FROM user WHERE username = '"+ req.body.UserName +"'"
    con.query(sql, function (err, result) {
        if (err) return console.log(err);
        var strResult = JSON.stringify(result)
        console.log(typeof(strResult),strResult)
        if (strResult == "[]") {
            console.log("ไม่มี");
            sql = "INSERT INTO user (username, password) VALUES('"+ req.body.UserName +"', '"+ req.body.Password +"')"
            con.query(sql, function (err, result) {
                if (err) throw err;
                var checked ={
                    checkedState: false
                };
                console.log(checked);
                res.json(checked);
            })
        } else {
            console.log('มีแล้ว');
            var checked ={
                checkedState: true
            };
            console.log(checked);
            res.json(checked);
        }
    })
});

router.post('/upload', upload.array('allCollection', 6), (req, res, next) => {
    const jsonImg = [];
    const jsonFile = [];
    // const url = req.protocol + '://' + req.get('host')
    for (var i = 0; i < req.files.length; i++) {
        const spilt = JSON.stringify(req.files[i].mimetype.split('/',1))
        // console.log(spilt)
        if (spilt == '["application"]') {
            jsonFile.push(req.files[i].filename)
        } else {
            jsonImg.push(req.files[i].filename)
        }
    }

    console.log(jsonImg)
    const objData = JSON.parse(JSON.stringify(req.body));
    // console.log(objData);

    if (req.body) {
        sql = "INSERT INTO tb_produce (produce_id, produce_name, produce_type, produce_detail, produce_img, produce_file) VALUES('"+ objData.produceId +"', '"+ objData.produceName +"','"+ objData.produceType +"','"+ objData.produceDetail +"', '"+ jsonImg +"', '"+ jsonFile +"')"
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.json(result);
        })
    }
});

router.post('/signin', async (req, res) => {
    console.log(req.body.UserName)
    console.log(req.body.Password)
    sql = "SELECT username FROM user WHERE username = '"+ req.body.UserName +"'"
    con.query(sql, function (err, result) {
        if (err) return console.log(err);
        var strUser = JSON.stringify(result)
        if (strUser != "[]") {
            sql = "SELECT level FROM user WHERE username = '"+ req.body.UserName +"' AND password = '"+ req.body.Password +"'"
            con.query(sql, function (err, result) {
                if (err) return console.log(err);
                var strResult = JSON.stringify(result)
                var strResult2 = JSON.parse(JSON.stringify(result))
                // console.log(result)
                // console.log(typeof(strResult),strResult)
                if (strResult == "[]") {
                    console.log("รหัสผ่านผิด");
                    var checked ={
                        checkedUser: true,
                        checkedPass: false
                    };
                    console.log(checked);
                    res.json(checked);
                } else {
                    console.log('รหัสผ่านถูก');
                    console.log(strResult2)
                    var checked ={
                        checkedUser: true,
                        checkedPass: true,
                        // checkedLevel: strResult2
                    };
                    req.session.logedin = true;
                    req.session.username = req.body.UserName;
                    req.session.level = strResult2;
                    console.log(req.session.logedin , req.session.username);
                    console.log(checked);
                    res.json(checked);
                }
            })
        } else {
            var checked = {
                checkedUser: false
            };
            console.log('ชื่อผู้ใช้ผิด');
            res.json(checked);
        }
    })
});

router.post('/addproduce', async (req, res) => {
    const storage = multer.diskStorage({
        destination: "D:/OSD/produces-demo/client/public/image",
        filename: function(req, file, cb){
           cb(null,"PRODUCE-" + Date.now() + path.extname(file.originalname));
        }
     });

     const upload = multer({
        storage: storage,
        // limits:{fileSize: 1000000},
     }).single("Image");

    upload(req, res, (err) => {
        const objData = JSON.parse(JSON.stringify(req.body));
        console.log(objData);
        console.log("Request file --->", req.file);
        if (req.body) {
            // const jsonImg = '{ "image1":"'++'","image2":"'++'" }'
            console.log(req.file.filename)
            sql = "INSERT INTO tb_produce (produce_id, produce_name, produce_type, produce_data, produce_img) VALUES('"+ objData.ProduceId +"', '"+ objData.ProduceName +"','"+ objData.ProduceType +"','"+ objData.ProduceDetail +"', '"+ req.file.filename +"')"
            con.query(sql, function (err, result) {
                if (err) throw err;
                res.json(true);
            })
        }
    })   
});

router.get('/showProduce/:Id', async (req, res) => {
    sql = "SELECT produce_img FROM tb_produce WHERE produce_id = '"+req.params.Id+"'"
    con.query(sql, function (err, result) {
        if (err) return console.log(err)
        console.log(result);
        res.contentType('image/jpeg');
        res.send(result.produce_img)
    })
});

router.get("/qrcode/:id", (req, res) => {
    const id = req.params.id
    res.send(id)
    // fs.readFile(`./public/upload/${id}.jpg`, function (err, data) {
    //     if (err) throw err
    //     else {
    //         res.writeHead(200, { "Content-Type": "image/jpeg" })
    //         res.end(data)
    //     }
    // })
})

router.post('/search', async (req, res) => {
    console.log(req.body)
    let sql = "SELECT * FROM tb_produce "
    if (req.body.searchId != null && req.body.searchName != null && req.body.searchType != null && req.body.searchDetail != null) {
        console.log("1")
       sql+="WHERE produce_id LIKE '%"+ req.body.searchId +"%' AND produce_name LIKE '%"+ req.body.searchName +"%' AND produce_type LIKE '%"+ req.body.searchType +"%' AND produce_detail LIKE '%"+ req.body.searchDetail +"%'"
    }
    else if (req.body.searchId == null && req.body.searchName != null && req.body.searchType != null && req.body.searchDetail != null) {
        console.log("2")
        sql+="WHERE produce_name LIKE '%"+ req.body.searchName +"%' AND produce_type LIKE '%"+ req.body.searchType +"%' AND produce_detail LIKE '%"+ req.body.searchDetail +"%'"
    }
    else if (req.body.searchId != null && req.body.searchName == null && req.body.searchType != null && req.body.searchDetail != null) {
        console.log("3")
        sql+="WHERE produce_id LIKE '%"+ req.body.searchId +"%' AND produce_type LIKE '%"+ req.body.searchType +"%' AND produce_detail LIKE '%"+ req.body.searchDetail +"%'"
    }
    else if (req.body.searchId != null && req.body.searchName != null && req.body.searchType == null && req.body.searchDetail != null) {
        console.log("4")
        sql+="WHERE produce_id LIKE '%"+ req.body.searchId +"%' AND produce_name LIKE '%"+ req.body.searchName +"%' AND produce_detail LIKE '%"+ req.body.searchDetail +"%'"
    }
    else if (req.body.searchId != null && req.body.searchName != null && req.body.searchType != null && req.body.searchDetail == null) {
        console.log("5")
        sql+="WHERE produce_id LIKE '%"+ req.body.searchId +"%' AND produce_name LIKE '%"+ req.body.searchName +"%' AND produce_type LIKE '%"+ req.body.searchType +"%'"
    }
    else if (req.body.searchId == null && req.body.searchName == null && req.body.searchType != null && req.body.searchDetail != null) {
        console.log("6")
        sql+="WHERE produce_type LIKE '%"+ req.body.searchType +"%' AND produce_detail LIKE '%"+ req.body.searchDetail +"%'"
    }
    else if (req.body.searchId != null && req.body.searchName != null && req.body.searchType == null && req.body.searchDetail == null) {
        console.log("7")
        sql+="WHERE produce_id LIKE '%"+ req.body.searchId +"%' AND produce_name LIKE '%"+ req.body.searchName +"%'"
    }
    else if (req.body.searchId == null && req.body.searchName != null && req.body.searchType == null && req.body.searchDetail != null) {
        console.log("8")
        sql+="WHERE produce_name LIKE '%"+ req.body.searchName +"%' AND produce_detail LIKE '%"+ req.body.searchDetail +"%'"
    }
    else if (req.body.searchId != null && req.body.searchName == null && req.body.searchType != null && req.body.searchDetail == null) {
        console.log("9")
        sql+="WHERE produce_id LIKE '%"+ req.body.searchId +"%' AND produce_type LIKE '%"+ req.body.searchType +"%'"
    }
    else if (req.body.searchId == null && req.body.searchName != null && req.body.searchType != null && req.body.searchDetail == null) {
        console.log("10")
        sql+="WHERE produce_name LIKE '%"+ req.body.searchName +"%' AND produce_type LIKE '%"+ req.body.searchType +"%'"
    }
    else if (req.body.searchId != null && req.body.searchName == null && req.body.searchType == null && req.body.searchDetail != null) {
        console.log("11")
        sql+="WHERE produce_id LIKE '%"+ req.body.searchId +"%' AND produce_detail LIKE '%"+ req.body.searchDetail +"%'"
    }
    else if (req.body.searchId != null && req.body.searchName == null && req.body.searchType == null && req.body.searchDetail == null) {
        console.log("12")
        sql+="WHERE produce_id LIKE '%"+ req.body.searchId +"%'"
    }
    else if (req.body.searchId == null && req.body.searchName != null && req.body.searchType == null && req.body.searchDetail == null) {
        console.log("13")
        sql+="WHERE produce_name LIKE '%"+ req.body.searchName +"%'"
    }
    else if (req.body.searchId == null && req.body.searchName == null && req.body.searchType != null && req.body.searchDetail == null) {
        console.log("14")
        sql+="WHERE produce_type LIKE '%"+ req.body.searchType +"%'"
    }
    else if (req.body.searchId == null && req.body.searchName == null && req.body.searchType == null && req.body.searchDetail != null) {
        console.log("15")
        sql+="WHERE produce_detail LIKE '%"+ req.body.searchDetail +"%'"
    }
    con.query(sql, function (err, result) {
        // console.log(result)
        if (err) return console.log(err);
        const resJson= [];

        var strResult = JSON.parse(JSON.stringify(result))
        console.log('kk',result)
        if (strResult != "[]") {
            console.log(strResult)
            for (var i = 0; i < strResult.length; i++) {
                resJson.push({
                    _id: strResult[i]._id,
                    produce_id: strResult[i].produce_id,
                    produce_name: strResult[i].produce_name,
                    produce_type: strResult[i].produce_type,
                    produce_detail: strResult[i].produce_detail,
                    produce_img: strResult[i].produce_img.split(','),
                    produce_file: strResult[i].produce_file.split(',')
                })
            }
            console.log(resJson)
            res.json(resJson);
        } else {
            console.log(strResult)
            var queryData ={
                dataStatus: false
            };
            res.json(queryData);
        }
    })
});

router.post('/deleteproduce', async (req, res) => {
    console.log(req.body)
    console.log(req.body._file.split(',')[0])
    const count = req.body._img.split(',').length + req.body._file.split(',').length
    var type = ""
    var str = ""
    var i2 = 0
    for (var i = 0; i < count; i++) {
        if (i < req.body._img.split(',').length) {
            type = "image" 
            str = req.body._img.split(',')[i]
        } else {
            type = "application" 
            str = req.body._file.split(',')[i2]
            i2++
        }
        const pathToFile = "D:/OSD/produces-webapp/client/public/"+type+"/"+str
        fs.unlink(pathToFile, function(err) {
            if (err) {
                return console.log(err);
            } else {
                console.log("Successfully deleted the file.")
            }
        })
    }
    sql = "DELETE FROM tb_produce WHERE _id = '"+ req.body._id +"'"
    con.query(sql, function (err, result) {
        if (err) return console.log(err);
        res.json(result);
    })
})

router.post('/deletefile', async (req, res) => {
    console.log(req.body)
    console.log(req.body._equal[0])
    const count = req.body._equal.length
    var str = ""
    for (var i = 0; i < count; i++) {
        str = req.body._equal[i]
        const pathToFile = "D:/OSD/produces-demo/client/public/application/"+str
        fs.unlink(pathToFile, function(err) {
            if (err) {
                return console.log(err);
            } else {
                console.log("Successfully deleted the file.")
            }
        })
    }
    var strFile = req.body._notEqual.toString();
    console.log(strFile)
    // if (strFile === "[]") {
    //     strFile = ''
    // }
    // sql = "UPDATE tb_produce SET produce_file = '"+ strFile +"'  WHERE _id = '"+ req.body._id +"'"
    // con.query(sql, function (err, result) {
    //     if (err) return console.log(err);
    //     res.json(result);
    // })
})

router.post('/maxfile', async (req, res) => {
    console.log(req.body._id)
    sql = "SELECT produce_file FROM tb_produce WHERE _id = '"+ req.body._id +"'"
    con.query(sql, function (err, result) {
        if (err) return console.log(err);
        var strResult = JSON.parse(JSON.stringify(result))
        var jsonResult =  JSON.parse('{'+strResult[0].produce_file+'}')

        const count = []
        for (const value in jsonResult) {
            count.push(`${jsonResult[value]}`)
        }
        console.log(count.length)
        const value = (5 - count.length)
        res.json(value)
    })
})

router.post('/editproduce', upload.array('fileCollection', 6), async (req, res) => {
    const objData = JSON.parse(JSON.stringify(req.body));
    const jsonFile = [];
    for (var i = 0; i < req.files.length; i++) {
        jsonFile.push(req.files[i].filename)
    }
    // console.log(jsonFile)
    console.log(objData.oldFile)

    const count = jsonFile.length + objData.oldFile.split(',').length
    const sumFile = [];
    var i3 = 0
    for (var i2 = 0; i2 < count; i2++) {
        if (i2 < objData.oldFile.split(',').length) {
            sumFile.push(objData.oldFile.split(',')[i2])
        } else {
            sumFile.push(jsonFile[i3])
            i3++
        } 
    }
    console.log(sumFile)
    sql = "UPDATE tb_produce SET produce_name = '"+ req.body.editName +"', produce_type = '"+ req.body.editType +"', produce_detail = '"+ req.body.editDetail+"', produce_file = '"+ sumFile +"'  WHERE _id = '"+ req.body.edit_id +"'"
    con.query(sql, function (err, result) {
        if (err) return console.log(err);
        res.json(result);
    })
})

router.get('/checkSession', async (req, res) => {
    if (req.session.logedin) {
        console.log(req.session.logedin, req.session.level[0].level)
        var session ={
            logedin: req.session.logedin,
            level: req.session.level[0].level,
            username: req.session.username
        };
        res.json(session);
    } else {
        console.log(false)
        res.json(false);
    }
})

router.get('/logout', async (req, res) => {
    if (req.session.logedin) {
        req.session.logedin = false;
        req.session.username = '';
        res.json(req.session.logedin);
    } else {}
})

router.get('/getUser', async (req, res) => {
    if (req.session.level) {
        console.log(req.session.level)
        res.json(req.session.level);
    } else {}
})

router.post('/addCustomer', async (req, res) => {
   
    const objData = JSON.parse(JSON.stringify(req.body));
    console.log(objData);
    if (req.body) {
        res.redirect('/')
        sql = "INSERT INTO tb_customer (customer_id, customer_name, customer_email,customer_address,customer_data) VALUES('"+ objData.CustomerId +"', '"+ objData.CustomerName +"','"+ objData.CustomerEmail +"','"+ objData.CustomerAddress +"', '"+ objData.CustomerData +"')"
        con.query(sql, function (err, result) {
            if (err) throw err;
            // res.json(result);
        })
    }
})

router.get('/showCustomer', async (req, res) => {
    sql = "SELECT * FROM tb_customer"
    con.query(sql, function (err, result) {
        if (err) return console.log(err);
        var strResult = JSON.parse(JSON.stringify(result))
        // var strResult = JSON.stringify(result)
        console.log(result)
        console.log(strResult)
        res.json(strResult);
    })
})

router.post('/searchcustomer', async (req, res) => {
    console.log(req.body)
    let sql = "SELECT * FROM tb_customer "
    if (req.body.searchcusId != null && req.body.searchcusName != null && req.body.searchcusEmail != null && req.body.searchcusAddress != null && req.body.searchcusData != null) {
        console.log("1")
       sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%' AND customer_name LIKE '%"+ req.body.searchcusName +"%' AND customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_address LIKE '%"+ req.body.searchcusAddress +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName != null && req.body.searchcusEmail != null && req.body.searchcusAddress != null && req.body.searchcusData != null) {
        console.log("2")
        sql+="WHERE customer_name LIKE '%"+ req.body.searchcusName +"%' AND customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_address LIKE '%"+ req.body.searchcusAddress +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId != null && req.body.searchcusName == null && req.body.searchcusEmail != null && req.body.searchcusAddress != null && req.body.searchcusData != null) {
        console.log("3")
        sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%'  AND customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_address LIKE '%"+ req.body.searchcusAddress +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId != null && req.body.searchcusName != null && req.body.searchcusEmail == null && req.body.searchcusAddress != null && req.body.searchcusData != null) {
        console.log("4")
        sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%' AND customer_name LIKE '%"+ req.body.searchcusName +"%' AND customer_address LIKE '%"+ req.body.searchcusAddress +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId != null && req.body.searchcusName != null && req.body.searchcusEmail != null && req.body.searchcusAddress == null && req.body.searchcusData != null) {
        console.log("5")
        sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%' AND customer_name LIKE '%"+ req.body.searchcusName +"%' AND customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId != null && req.body.searchcusName != null && req.body.searchcusEmail != null && req.body.searchcusAddress != null && req.body.searchcusData == null) {
        console.log("6")
        sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%' AND customer_name LIKE '%"+ req.body.searchcusName +"%' AND customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_address LIKE '%"+ req.body.searchcusAddress +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName == null && req.body.searchcusEmail != null && req.body.searchcusAddress != null && req.body.searchcusData != null) {
        console.log("7")
        sql+="WHERE customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_address LIKE '%"+ req.body.searchcusAddress +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId != null && req.body.searchcusName != null && req.body.searchcusEmail == null && req.body.searchcusAddress == null && req.body.searchcusData != null) {
        console.log("8")
        sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%' AND customer_name LIKE '%"+ req.body.searchcusName +"%'  AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId != null && req.body.searchcusName != null && req.body.searchcusEmail != null && req.body.searchcusAddress == null && req.body.searchcusData == null) {
        console.log("9")
        sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%' AND customer_name LIKE '%"+ req.body.searchcusName +"%' AND customer_email LIKE '%"+ req.body.searchcusEmail +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName != null && req.body.searchcusEmail == null && req.body.searchcusAddress != null && req.body.searchcusData != null) {
        console.log("10")
        sql+="WHERE  customer_name LIKE '%"+ req.body.searchcusName +"%' AND customer_address LIKE '%"+ req.body.searchcusAddress +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName != null && req.body.searchcusEmail != null && req.body.searchcusAddress == null && req.body.searchcusData != null) {
        console.log("11")
        sql+="WHERE customer_name LIKE '%"+ req.body.searchcusName +"%' AND customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName != null && req.body.searchcusEmail != null && req.body.searchcusAddress != null && req.body.searchcusData == null) {
        console.log("12")
        sql+="WHERE customer_name LIKE '%"+ req.body.searchcusName +"%' AND customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_address LIKE '%"+ req.body.searchcusAddress +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName == null && req.body.searchcusEmail == null && req.body.searchcusAddress != null && req.body.searchcusData != null) {
        console.log("13")
        sql+="WHERE customer_address LIKE '%"+ req.body.searchcusAddress +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName == null && req.body.searchcusEmail != null && req.body.searchcusAddress == null && req.body.searchcusData != null) {
        console.log("14")
        sql+="WHERE customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName == null && req.body.searchcusEmail != null && req.body.searchcusAddress != null && req.body.searchcusData == null) {
        console.log("15")
        sql+="WHERE customer_email LIKE '%"+ req.body.searchcusEmail +"%' AND customer_address LIKE '%"+ req.body.searchcusAddress +"%'"
    }
    else if (req.body.searchcusId != null && req.body.searchcusName == null && req.body.searchcusEmail == null && req.body.searchcusAddress == null && req.body.searchcusData != null) {
        console.log("16")
        sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%' AND customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    else if (req.body.searchcusId != null && req.body.searchcusName == null && req.body.searchcusEmail != null && req.body.searchcusAddress == null && req.body.searchcusData == null) {
        console.log("17")
        sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%' AND customer_email LIKE '%"+ req.body.searchcusEmail +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName != null && req.body.searchcusEmail == null && req.body.searchcusAddress == null && req.body.searchcusData == null) {
        console.log("18")
        sql+="WHERE customer_name LIKE '%"+ req.body.searchcusName +"%'"
    }
    else if (req.body.searchcusId != null && req.body.searchcusName == null && req.body.searchcusEmail == null && req.body.searchcusAddress == null && req.body.searchcusData == null) {
        console.log("19")
        sql+="WHERE customer_id LIKE '%"+ req.body.searchcusId +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName == null && req.body.searchcusEmail != null && req.body.searchcusAddress == null && req.body.searchcusData == null) {
        console.log("20")
        sql+="WHERE customer_email LIKE '%"+ req.body.searchcusEmail +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName == null && req.body.searchcusEmail == null && req.body.searchcusAddress != null && req.body.searchcusData == null) {
        console.log("21")
        sql+="WHERE customer_address LIKE '%"+ req.body.searchcusAddress +"%'"
    }
    else if (req.body.searchcusId == null && req.body.searchcusName == null && req.body.searchcusEmail == null && req.body.searchcusAddress == null && req.body.searchcusData != null) {
        console.log("22")
        sql+="WHERE customer_data LIKE '%"+ req.body.searchcusData +"%'"
    }
    con.query(sql, function (err, result) {
        console.log(result)
        if (err) return console.log(err);
        var strResult = JSON.parse(JSON.stringify(result))
        if (strResult != "[]") {
            console.log(strResult)
            res.json(strResult);
        } else {
            console.log(strResult)
            var queryData ={
                dataStatus: false
            };
            res.json(queryData);
        }
    })
})

router.post('/deletecustomer', async (req, res) => {
    console.log(req.body.delId)
    sql = "DELETE FROM tb_customer WHERE id = '"+ req.body.delId +"'"
    con.query(sql, function (err, result) {
        if (err) return console.log(err);
        res.json(result);
    })
})

router.post('/editcustomer', async (req, res) => {
    console.log(req.body)
    sql = "UPDATE tb_customer SET customer_id = '"+ req.body.editId +"', customer_name = '"+ req.body.editName +"', customer_email = '"+ req.body.editEmail +"', customer_address = '"+ req.body.editAddress +"', customer_data = '"+ req.body.editData +"' WHERE id = '"+ req.body.edit_id +"'"
    con.query(sql, function (err, result) {
        if (err) return console.log(err);
        res.json(result);
    })
})



module.exports = router;