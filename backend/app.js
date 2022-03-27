require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server,{
    cors:{
        origin:["http://localhost:3000"]
    }
});



const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
app.use(express.static("public"));
const bcrypt = require('bcrypt');
const cors = require("cors");
const jwt = require("jsonwebtoken");


//Database Models
const User = require("./public/models/UserModel");
const Tokens = require("./public/models/tokenModel")
const Rooms = require("./public/models/roomModel");
const { Socket } = require("socket.io");

//connecting Database
mongoose.connect("mongodb://localhost:27017/test")


//Using plugins for express
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    next();
  });
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const obj = {
    name:"Marish",
    age:20
}


//Routes
app.get("/",authenticateJWT,(req,res)=>{
    res.json({msg:"hola",user:req.user})
});

app.get("/check",(req,res)=>{
    res.send("Hello world");
})

app.post("/login",login)

app.post("/signUp",signUp)

app.get("/token",(req,res)=>{
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

})

app.get("/logout",(req,res)=>{
    const authHeader = req.headers["authorization"];
    const rtoken = authHeader.slice(7);
    Tokens.deleteOne({rToken:rtoken}).then(()=>{
        console.log("User Deleted");
        res.json({msg:"Deleted"})
    })
})

app.get("/getRoom",(req,res)=>{
    Rooms.find({},(err,data)=>{
        res.json(data);
    })
})

app.post("/createRoom",(req,res)=>{
    const room = new Rooms(req.body);
    room.save((err)=>{
        if(err){
            console.log(err);
            res.json({msg:err});
        }else{
            console.log("Success");
            res.json({msg:"Success"})
        }
    })
})

//socket.io connections

io.on("connection",(socket)=>{
    socket.on("join-room",(roomID,userID)=>{
        socket.join(roomID);
        socket.to(roomID).emit("user-joined",userID);

        socket.on("video-playing",(videoID)=>{
            console.log("trying to play")
            socket.to(roomID).emit("play-video",videoID);
        })

        socket.on("video-state",(state,seconds)=>{
            socket.to(roomID).emit("state-changed",state,seconds);
        })

        socket.on("send-message",(msg)=>{
            socket.to(roomID).emit("recieve-message",msg);
        })

        socket.on("send-board",(vis)=>{
            socket.to(roomID).emit("recieve-board",vis);
        })
        socket.on("disconnect",()=>{
            socket.to(roomID).emit("user-leaved",userID);
        })
    })
})


//listening to port
server.listen(PORT,()=>{
    console.log("Server stated on port 5000");
})


//User signUp and Login functions

function signUp(req,res){
    const pass = req.body.pass;
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
                    res.json({msg:"Logged",atoken:atoken,rtoken:rtoken,uname:data.username,img:data.img})
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

//JWT generate

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

function authenticateJWT(req,res,next){
    const authHeader = req.headers["authorization"];
    const token = authHeader.slice(7);
    if(token==null) return res.json({msg:"Token empty"});
    jwt.verify(token,process.env.ACCESS_TOKEN,(err,user)=>{
        if(err) {
            console.log(err);
            return res.json({msg:"Token expired"})
        }
       
        req.user=user
        console.log("auth success");
        next();
    })
}