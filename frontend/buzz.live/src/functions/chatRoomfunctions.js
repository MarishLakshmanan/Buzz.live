
import novideoIcon from "../resources/no-video.png"
import videoIcon from "../resources/video.png"
import micIcon from "../resources/microphone.png"
import noMicIcon from "../resources/no-microphone.png"
import {toggleMic,toggleVideo,userVideoMuted} from "../functions/roomConnection"

function createMessage(msg){
    const container = document.getElementById("chat-message-container");
    const p = document.createElement("p");
    p.innerText = localStorage.getItem("uname") +": "+ msg;
    container.appendChild(p);
}

function switchTab(e){
    if(e==="more"){
        document.getElementById("chat-btn").classList.remove("active");
        document.querySelector(".chat-container").classList.remove("activeTab")
        document.getElementById("more-btn").classList.add("active");
        document.querySelector(".more-container").classList.add("activeTab")
        
    }else if(e==="chat"){
         document.getElementById("chat-btn").classList.add("active");
         document.querySelector(".chat-container").classList.add("activeTab")
         document.getElementById("more-btn").classList.remove("active");
         document.querySelector(".more-container").classList.remove("activeTab")
    }
    document.querySelector(".youtube-result-container").classList.remove("activeTab")
}

function showYoutube(){
    document.querySelector(".chat-container").classList.remove("activeTab")
    document.querySelector(".more-container").classList.remove("activeTab")
    document.querySelector(".youtube-result-container").classList.add("activeTab")
}

function openMore(){
    document.querySelector(".tools-container").classList.add("active");
}
function closeMore(){
 document.querySelector(".tools-container").classList.remove("active");
}

function toggleUserVideo(setvideoMedia,currentUserID){
    setvideoMedia((pre)=>{
        if(pre===videoIcon){
             document.getElementById(currentUserID+"img").style.opacity=1;
             userVideoMuted(true,currentUserID);
             return novideoIcon
        }else{
             document.getElementById(currentUserID+"img").style.opacity=0;
             userVideoMuted(false,currentUserID);
             return videoIcon
        }
    })
    toggleVideo();  
}

function toggleUserMic(setMicMedia){
    setMicMedia((pre)=>{
        return ((pre===micIcon)?noMicIcon:micIcon)
    })
    toggleMic();
}

export {createMessage,switchTab,showYoutube,openMore,closeMore,toggleUserVideo,toggleUserMic}