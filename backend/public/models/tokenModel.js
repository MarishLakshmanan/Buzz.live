const mongoose = require("mongoose");

const tokenSchema =  new mongoose.Schema({
    rToken:String
});

const Tokens = new mongoose.model("auths",tokenSchema);
module.exports = Tokens;