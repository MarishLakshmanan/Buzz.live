const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    img:String
})

const User = new mongoose.model("User",userSchema);

module.exports=User;