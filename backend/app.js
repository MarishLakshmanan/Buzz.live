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
const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 3001, path: '/' });
const nodemailer = require("nodemailer");


const bodyParser = require("body-parser");
const PORT = process.env.PORT || 5000;
app.use(express.static("public"));

const cors = require("cors");

const ip="192.168.100.143"


//Database Models
const User = require("./public/models/UserModel");
const Tokens = require("./public/models/tokenModel")
const Rooms = require("./public/models/roomModel");
const { Socket } = require("socket.io");


// Importing functions

const {signUp,login,authenticateJWT,checkToken,logout} = require("./public/functions/authorizationFunctions")


//connecting Database
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.pcaad.mongodb.net/Buzz?retryWrites=true&w=majority`)


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



//Routes



app.get("/",(req,res)=>{
    res.send("Hello there")
})
app.post("/login",login)

app.post("/signUp",signUp)

app.get("/token",authenticateJWT,(req,res)=>{
    res.json({msg:"hola",user:req.user})
});

app.get("/checkToken",checkToken)

app.get("/logout",logout)

app.get("/getRoom",(req,res)=>{
    Rooms.find({},(err,data)=>{
        res.json(data);
    })
})

app.post("/get-room-users/",(req,res)=>{
    const roomID = req.body.roomID;
    Rooms.findOne({roomID:roomID},(err,data)=>{
        if(err) return console.log(err);
        if(data.currentlyIn){
            res.json(data.currentlyIn);
        }else{
            res.json([])
            console.log("Nothing");
        }
    })
})

app.post("/add-room-user",(req,res)=>{
    const uid = req.body.uid;
    const roomID = req.body.roomID;
    addUserToRoom(uid,roomID,res);
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

app.post("/updateUser",(req,res)=>{
    console.log("In here");
    const userID= req.body.uID;
    const name = req.body.name;
    const email = req.body.email;
    const img = req.body.img;

    User.findOne({_id:userID},(err,data)=>{
        if(err) return console.log("User not present");

        if(data){
            data.username = name;
            data.email = email;
            data.img = img;
            data.save();
            res.json({msg:"Success"})
        }
    })
})

//socket.io connections

io.on("connection",(socket)=>{
    socket.on("join-room",(roomID,userID,uID)=>{
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

        socket.on("user-choice",(choice)=>{
            socket.to(roomID).emit("user-choice",choice);
        })

        socket.on("video-mute",(muted,userID)=>{
            socket.to(roomID).emit("video-mute",muted,userID);
        })

        socket.on("disconnect",()=>{
            console.log("disconnect");
            removeUserId(uID,roomID);
            socket.to(roomID).emit("user-leaved",userID);
        })
    })
})

function addUserToRoom(uID,roomID,res){

    Rooms.findOne({roomID:roomID},(err,data)=>{
        if(err) {
            return res.json({msg:"room-is-not-there"})
        }
        var userIsNotThere = true;
        if(data){
            
            var arr = data.currentlyIn;

            console.log(arr.length,parseInt(data.npeople));

            if(arr.length>=parseInt(data.npeople)){
                return res.json({msg:"202"})
            }

            arr.forEach((user)=>{
                const userID = user._id.toString();
                if(userID===uID){
                    userIsNotThere = false;
                    return;
                }
            })
            if(userIsNotThere){
                User.findOne({_id:uID},"username email img",(err,user)=>{
                    if(err) return console.log(err)
                    if(user){
                        arr.push(user);
                        data.currentlyIn = arr;
                        data.save();
                        res.json({msg:"200"})
                    }
                })
            }else{
                return res.json({msg:"201"})
            }
        }
    })
}

function removeUserId(uID,roomID){
    Rooms.findOne({roomID:roomID},(err,data)=>{
        if(err) return console.log(err);
        
        if(data){
            var arr = data.currentlyIn;
            var tempArr = [];
            arr.forEach((user)=>{
                const userID = user._id.toString();
                console.log(userID);
                if(userID!==uID){
                    tempArr.push(user);
                }
            })
            data.currentlyIn = tempArr;
            data.save();

        }
    })
}





//listening to port
server.listen(PORT,()=>{
    console.log("Server stated on port 5000");
})





