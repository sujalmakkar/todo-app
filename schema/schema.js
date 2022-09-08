const mongoose = require('mongoose');

var USERSchema = new mongoose.Schema({
        username:{type:String,required:true},
        password:{type:String,required:true},
        uid:{type:Number,required:true},
        todos:[{
                text:String,
                done:Boolean,
        }]
})


const USER = mongoose.model('USER',USERSchema)

module.exports = USER









































