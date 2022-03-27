const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    googleID:String,
    history:[String],
    profileImg:String,
    mediaLinks:[String],
    img:String
})

const User = new mongoose.model("User",userSchema);

module.exports=User;