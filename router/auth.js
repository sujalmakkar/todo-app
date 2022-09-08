// const express = require('express')
// const router = express.Router()
// const mongoClient = require('mongodb').MongoClient;
// var jwt = require('jsonwebtoken')
// const secret = 'randomsecttvdcadvcb'


// //DATABASE CONNECTION
// var db;
// mongoClient.connect(url="mongodb://localhost:27017").then(client=>{
//     db = client.db('27017')
// }).then(()=>console.log('connected to database')).catch(err=>console.log(err))


// var auth = router.post('/', (req,res)=>{
//     var data = req.body;
//     validate(data)

//     async function validate(info){
//         var exists = await db.collection('userpass').find().toArray().then(a=>a.filter(e=>e.username == info.username))
//         if(exists == '') {
//              res.json({message:'User does not exists'})
//         }
//         else{
//             const token = jwt.sign({username:info.username},secret)
//             await bcrypt.compare(info.password, exists[0].password,function(err,valid){
//                 if(valid){
//                     res.cookie("auth-token",`${token}`,{sameSite:'strict',path:'/',expires:new Date(new Date().getTime()+3600*1000),httpOnly:true}).send({message:'USER IS VALID'})
//                 }else{
//                     res.json({message:'INCORRECT PASSWORD'})
//                 }
//             });
//         }
//     }
// })

// module.exports = auth