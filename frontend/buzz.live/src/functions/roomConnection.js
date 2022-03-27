import {io} from "socket.io-client";
import Peer from "peerjs";

const activePeers = {};
var socket
function initSocketConnection(roomID,setClientUrl,setClinetState,clientPlayerRef,createMessage,setBoardVisibility){
    const peer = new Peer(undefined, {
        host: '/',
        port: '3001'
      })
    socket = io("http://localhost:5000")

    peer.on("open",(id)=>{
        socket.emit("join-room",roomID,id)
    })

    socket.on("user-leaved",userID=>{
        if(activePeers[userID]){
            activePeers[userID].close();
            console.log("user removed");
        }else{
            console.log("user is not here");
        }
    })

    navigator.mediaDevices.getUserMedia({
        video:true,
        audio:false,
    }).then((yourStream)=>{

        peer.on("call",(call)=>{
            call.answer(yourStream);
            const video2 = document.createElement("video")
            call.on("stream",(anotherStream)=>{
                addVideoStream(video2,anotherStream);
            })
        })

        const video = document.createElement("video")
        addVideoStream(video,yourStream);

        socket.on("user-joined",(userID)=>{
            connectToNewUser(userID,yourStream,peer);
        })
    })

    socket.on("play-video",(vID)=>{
        setClientUrl(`https://www.youtube.com/watch?v=${vID}`)
    })

    socket.on("state-changed",(state,seconds)=>{
        if(state){
            clientPlayerRef.current.seekTo(seconds,"seconds");
        }

        setClinetState(state) 
    })

    socket.on("recieve-message",(msg)=>{
        console.log(msg);
        createMessage(msg);
    })

    socket.on("recieve-board",(vis)=>{
        setBoardVisibility(vis)
    })

}



function addVideoStream(video,stream){
    const container = document.getElementById("r-video-container");
    video.srcObject = stream;
    video.addEventListener("loadedmetadata",()=>{
        video.play();
    })
    container.appendChild(video);
}

function connectToNewUser(userID,yourStream,peer){
    const call = peer.call(userID,yourStream);
    const video = document.createElement("video");
    call.on("stream",(anotherUserstream)=>{
        addVideoStream(video,anotherUserstream);
    })

    call.on("close",()=>{
        video.remove();
    })
    
    console.log(activePeers+"peers");
    
}

function playVideoToOthers(videoID){
    socket.emit("video-playing",videoID);
}

function videoStateChanged(state,seconds){
    socket.emit("video-state",state,seconds);
}

function sendMessageToOthers(msg){
    socket.emit("send-message",msg);
}

function sendBoard(vis){
    socket.emit("send-board",vis);
}
export {initSocketConnection,playVideoToOthers,videoStateChanged,sendMessageToOthers,sendBoard};