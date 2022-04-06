import {io} from "socket.io-client";
import Peer from "peerjs";

const activePeers ={};
var socket
let myStream;
const uid = localStorage.getItem("id")

function initSocketConnection(roomID,playVideoClient,setClinetState,clientRef,createMessage,setView,getRoomUsers){
    
    socket = io(process.env.REACT_APP_BACKEND_API)

    const peer = new Peer(uid, {
        host: 'localhost',
        port: '3001',
        path: '/'
    })

    peer.on("open",(id)=>{
        const uID = localStorage.getItem("id");
        socket.emit("join-room",roomID,id,uID)
    })

    socket.on("user-leaved",userID=>{
        if(activePeers[userID]){
            activePeers[userID].close();
            getRoomUsers();
            console.log("user removed");
        }else{
            console.log("user is not here");
        }
    })

    navigator.mediaDevices.getUserMedia({
        video:true,
        audio:false,
    }).then((yourStream)=>{
        myStream = yourStream;

        peer.on("call",(call)=>{
            call.answer(yourStream);
            console.log("answering the call");
            const video2 = document.createElement("video")
            video2.classList.add("user-video")
            call.on("stream",(anotherStream,)=>{
                console.log(anotherStream.getVideoTracks()[0].enabled);
                console.log("adding the other user video",call.peer);
                addVideoStream(video2,anotherStream,call.peer);
            })
        })

        const myVideo = document.createElement("video")
        myVideo.classList.add("user-video")
        addVideoStream(myVideo,yourStream,uid);

        socket.on("user-joined",(userID)=>{
            console.log(userID);
            getRoomUsers();
            setTimeout(connectToNewUser,3000,userID,yourStream,peer);
        })
    })

    socket.on("play-video",(url)=>{
        playVideoClient(url);
    })

    socket.on("state-changed",(state,seconds)=>{
        if(state){
            clientRef.current.seekTo(seconds,"seconds");
        }
        setClinetState(state) 
    })

    socket.on("recieve-message",(msg)=>{
        console.log(msg);
        createMessage(msg);
    })

    socket.on("user-choice",(choice)=>{
        setView(choice)
    })

    socket.on("video-mute",(muted,userID)=>{
        console.log();
        document.getElementById(userID+"img").style.opacity=(muted)?1:0;
    })

}



function addVideoStream(video,stream,id){
    const container = document.getElementById(id);
    video.srcObject = stream;
    video.addEventListener("loadedmetadata",()=>{
        video.play();
    })
    container.appendChild(video);
}

function connectToNewUser(userID,yourStream,peer){
    
    console.log("calling new user");
    const call = peer.call(userID,yourStream);
    const video = document.createElement("video");
    video.classList.add("user-video")
    call.on("stream",(anotherUserstream)=>{
        
        console.log("I am setting your video",userID);
        addVideoStream(video,anotherUserstream,userID);
    })

    call.on("close",()=>{
        video.remove();
    })

    activePeers[userID]=call;
    
}

function toggleMic(){
    const enabled = myStream.getAudioTracks()[0].enabled;
    if(enabled){
        myStream.getAudioTracks()[0].enabled = false;
    }else{
        myStream.getAudioTracks()[0].enabled = true;
    }
}

function toggleVideo(){
    const enabled = myStream.getVideoTracks()[0].enabled;
    if(enabled){
        myStream.getVideoTracks()[0].enabled = false;
    }else{
        myStream.getVideoTracks()[0].enabled = true;
    }
}

function userVideoMuted(muted,userID){
    socket.emit("video-mute",muted,userID);
}

function playVideoToOthers(videoID){
    socket.emit("video-playing",videoID);
}

function userChoice(choice){
    socket.emit("user-choice",choice);
}

function videoStateChanged(state,seconds){
    socket.emit("video-state",state,seconds);
}

function sendMessageToOthers(msg){
    socket.emit("send-message",msg);
}

export {initSocketConnection,playVideoToOthers,videoStateChanged,sendMessageToOthers,userChoice,toggleMic,toggleVideo,userVideoMuted};