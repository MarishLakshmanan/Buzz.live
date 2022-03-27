const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    title:String,
    description:String,
    npeople:String,
    lang:String,
    img:String,
    roomID:String,
    currentlyIn:[String]
})

const Room = new mongoose.model("room",roomSchema);
module.exports = Room;