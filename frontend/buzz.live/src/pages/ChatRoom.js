
import { useNavigate , useParams } from "react-router-dom";
import { checkAuth } from "../functions/Authorization";
import {initSocketConnection,sendBoard} from "../functions/roomConnection"
import YoutubePlayer from "../components/YoutubePlayer";
import {useState,useRef,useEffect} from "react"
import ChatBox from "../components/ChatBox"



function ChatRoom(){

    

    const navigate = useNavigate();
    const roomID = useParams().params;

    
    const[clientUrl,setClientUrl] = useState("");
    const[clientState,setClinetState] = useState(true);
    const[boardVisibility,setBoardVisibility] = useState("none")
    const clientPlayerRef  = useRef();

    useEffect(()=>{
        checkAuth(navigate);
        initSocketConnection(roomID,setClientUrl,setClinetState,clientPlayerRef,createMessage,setBoardVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    

    function createMessage(msg){
        const container = document.getElementById("chat-message-container");
        const p = document.createElement("p");
        p.innerText = localStorage.getItem("uname") +": "+ msg;
        container.appendChild(p);
    }

   function openBoard(){
       toggleBoardVisibility();
   }

   async function toggleBoardVisibility(){
       setBoardVisibility((pre)=>{
           if(pre==="none"){
                sendBoard("inline");
                return "inline";
           }
           sendBoard("none")
           return "none";
       })
   }

   const boardStyle = {
       display:boardVisibility,
       height:"400px"
   }
    return(
        <div>
            <div id = "r-video-container" ></div>
            <YoutubePlayer clientUrl={clientUrl} setClientUrl={setClientUrl} clientState={clientState} setClinetState={setClinetState} clientPlayerRef={clientPlayerRef}/>
            <ChatBox createMessage={createMessage}/>
            <div id="room-whiteBoard"></div>
            <button onClick={openBoard}>Open board</button>
            <iframe id="room-whiteboard" src={`https://witeboard.com/${roomID}`} title="W3Schools Free Online Web Tutorials" style={boardStyle}></iframe>
        </div>
    )
}

export default ChatRoom;