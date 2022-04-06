const bcrypt = require('bcrypt');
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const Tokens = require("../models/tokenModel")

function signUp(req,res){
    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.pass;

    User.find({$or:[{username:name},{email:email}]},(err,data)=>{
        if(err) return console.log(err);
        if(data.length>0){
            res.json({msg:"already"})
        }else{
            bcrypt.hash(pass,parseInt(process.env.SALT_ROUNDS)).then((hash)=>{
                const user = new User({
                    username:req.body.name,
                    password:hash,
                    email:req.body.email,
                    img:req.body.img
                })
                user.save((err)=>{
                    if(err){
                        console.log(err);
                        res.json({msg:"error"})
                    }else{
                        console.log("Saved");
                        res.json({msg:"success"});
                    }
                })
            })
        }
    })

    
}




function login(req,res){
    const uname = req.body.uname;
    const pass = req.body.pass;

    User.findOne({username:uname},(err,data)=>{
        if(data){
            bcrypt.compare(pass,data.password).then((result)=>{
                if(result){
                    console.log("logged in");
                    const atoken = generateAccessToken(data);
                    const rtoken = generateRefreshToken(data);
                    res.json({msg:"Logged",atoken:atoken,rtoken:rtoken,uname:data.username,img:data.img,_id:data._id,email:data.email})
                }else{
                    console.log("Password is wrong");
                    res.json({msg:"Wrong password"});
                }
            })
        }else{
            console.log("User not exist");
            res.json({msg:"user not exist"})
        }
    })
}

function logout(req,res){
    const authHeader = req.headers["authorization"];
    const rtoken = authHeader.slice(7);
    Tokens.deleteOne({rToken:rtoken}).then(()=>{
        console.log("User Deleted");
        res.json({msg:"Deleted"})
    })
}


function authenticateJWT(req,res,next){
    const authHeader = req.headers["authorization"];
    const token = authHeader.slice(7);
    if(token==null) return res.json({msg:"Token empty"});
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
        if(err) {
            return res.json({msg:"Token expired"})
        }
       
        req.user=user
        next();
    })
}


function checkToken(req,res){
    const authHeader = req.headers["authorization"];
    const rtoken = authHeader.slice(7);
    if(rtoken==null)return res.json({msg:"Login first"});

    Tokens.findOne({rToken:rtoken},(err,data)=>{
        if(data){
            jwt.verify(rtoken,process.env.REFRESH_TOKEN,(err,user)=>{
                const payload = {
                    username:user.username,
                    email:user.email
                }
                const atoken = jwt.sign(payload,process.env.ACCESS_TOKEN,{expiresIn:"30m"});
                console.log("DOne");
                res.json({msg:"Done",atoken:atoken})
            })
            
        }
    })
}



function generateAccessToken(user){
    const accessToken = jwt.sign({
        username:user.username,
        email:user.email
    },process.env.ACCESS_TOKEN,{expiresIn:"30m"})

    return accessToken;
}

function generateRefreshToken(user){
    const refershToken = jwt.sign({
        username:user.username,
        email:user.email
    },process.env.REFRESH_TOKEN);

    const token = new Tokens({
        rToken:refershToken
    })
    token.save();
    return refershToken;
}


module.exports = {signUp,login,authenticateJWT,checkToken,logout}