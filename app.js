const express = require('express')
// const router = express.Router()
const mongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser'); 
const app = express()
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
app.use(bodyParser.json())
app.use(cookieParser())
const USER = require('./schema/schema')
require('dotenv').config()


app.use(express.static("static"));


app.listen(3000,()=>{
    console.log('listening')
})

//DATABASE CONNECTION
var db;
mongoClient.connect(url=process.env.MONGODB).then(client=>{
    db = client.db('new')
}).then(()=>console.log('connected to database')).catch(err=>console.log(err))



app.post('/newUser',async (req,res)=>{
    var data = req.body

    var exists = await db.collection('userpass').find().toArray().then(a=>a.filter(e=>e.username == data.username))

    exists == '' && data.username != 'null' ? insertuser() : res.json({message:'Username already exists'});

    async function insertuser(){

        var uid = randomNumber(10000000,99999999) //random 8 dight number

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.password,salt)

        await db.collection('userpass').insertOne(new USER({username :data.username,password:hashedPassword,uid:uid}))
        .then(res.json({message:"Success User Created"}))
        .catch(err=>console.log(err))
    }
})

const secret = process.env.SECRET

app.post('/authenticate', (req,res)=>{
    var data = req.body; //GET SUBMITTED USERNAME AND PASSWORD
    validate(data)

    async function validate(info){
        var exists = await db.collection('userpass').findOne({username:info.username})
        console.log(exists)
        if(exists == '' || !exists) {
             res.json({message:'User does not exists'})
        }
        else{
            await bcrypt.compare(info.password, exists.password,function(err,valid){
                if(valid){
                    const token = jwt.sign({uid:exists.uid},secret)
                    res.cookie("auth-token",`${token}`,{sameSite:'strict',path:'/',expires:new Date(new Date().getTime()+3600*1000),httpOnly:true})
                    res.cookie('username',`${data.username}`,{expires:new Date(new Date().getTime()+3600*1000)})
                    res.json({message:'USER IS VALID',status:'200'})
                }else{
                    res.json({message:'INCORRECT PASSWORD',status:'401'})
                }
            });
        }
    }
})


app.post('/logout',(req,res)=>{
    var auth_token =  req.cookies['auth-token']
    res.cookie("auth-token",`${auth_token}`,{sameSite:'strict',path:'/',expires:new Date(new Date().getTime()+0*1000),httpOnly:true})
    res.cookie('username',`null`,{expires:new Date(new Date().getTime()+0*1000)})
    res.send({message:'LOGGED OUT',status:200})
})



app.post('/getTodos',(req,res)=>{
    // auth()
    var data = req.cookies;
    var token = data['auth-token']

    if(token == '' || token == "null" || token == null){
        res.json({message:'User does not exists'})
    }else{
        var verified = jwt.verify(token,secret)

        var info = verified.uid
        validate(info)
    
        async function validate(info){
    
            var exists = await db.collection('userpass').find().toArray().then(a=>a.filter(e=>e.uid == info))
            if(exists == '') {
                 res.json({message:'User does not exists'})
            }
            else{
                var todos = exists[0].todos
                res.json(todos || [])
            }        
        }
    }

    
})


app.post('/updateTodos',async (req,res)=>{
    var newtodo = req.body.todos;
    var data = req.cookies['auth-token'];
    let verify = async(key)=>{
        var verified = jwt.verify(key,secret)
        var uid = verified.uid
        var exists = await db.collection('userpass').find().toArray().then(a=>a.filter(e=>e.uid==uid))
        var changed_todos = {};
        changed_todos.todos = newtodo;
        changed_todos.username = exists[0].username
        changed_todos.password = exists[0].password
        if(exists==''){
            res.json({message:'User does not exist'})
        }
        else{
            await db.collection('userpass').updateOne({uid:uid},{$set:changed_todos},(err,response)=>{
                if(err) throw err
                response ? res.json({message:'Todos Updated!'}) : pass
            })
        }
    }
    data == '' || !data ? res.json({message:'Not logged In, Data will not be Saved'}) :verify(data)
})


function randomNumber(min, max){
    const r = Math.random()*(max-min) + min
    return Math.floor(r)
}