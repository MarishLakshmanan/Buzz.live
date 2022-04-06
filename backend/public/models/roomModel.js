const mongoose = require("mongoose");
const user = require("../models/UserModel")

const roomSchema = new mongoose.Schema({
    title:String,
    description:String,
    npeople:String,
    lang:String,
    img:String,
    roomID:String,
    currentlyIn:[user.schema],
    host:String
})

const Room = new mongoose.model("room",roomSchema);
module.exports = Room;