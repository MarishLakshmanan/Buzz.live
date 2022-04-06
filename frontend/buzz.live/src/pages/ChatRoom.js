
import { useNavigate , useParams } from "react-router-dom";
import { checkAuth } from "../functions/Authorization";
import {initSocketConnection,userChoice} from "../functions/roomConnection"
import YoutubeSearch from "../components/YoutubeSearch";
import {useState,useRef,useEffect} from "react"
import ChatBox from "../components/ChatBox"
import "../styles/chatRoom.css"
import axios from "axios"
import UserProfile from "../components/UserProfile";
import Toast from "../components/Toast";


// importing Icons

import chatIcon from "../resources/chat.png"
import applicationIcon from "../resources/application.png"
import youtubeIcon from "../resources/youtube.png"
import boardIcon from "../resources/white-board.png"
import YoutubePlayer from "../components/YoutubePlayer";
import videoChatIcon from "../resources/video-chat.png"
import videoIcon from "../resources/video.png"
import micIcon from "../resources/microphone.png"
import openMoreIcon from "../resources/more.png"
import closeIcon from "../resources/cross.png"

// importing functions

import {createMessage,switchTab,showYoutube,openMore,closeMore,toggleUserVideo,toggleUserMic} from "../functions/chatRoomfunctions"


function ChatRoom(){

    
    const [view,setView] = useState("videochat");
    const navigate = useNavigate();
    const roomID = useParams().params;
    const [videoMedia,setvideoMedia] = useState(videoIcon);
    const [micMedia,setMicMedia] = useState(micIcon);
    const [userArr,setUserArr] = useState([]);
    const[url,setUrl] = useState("");
    const[client,setClient] = useState(false);
    const [clientState,setClientState] = useState(true);
    const clientRef  = useRef();
    const currentUserID = localStorage.getItem("id");
    const [toast,setToast]=useState({state:false,msg:""});

    
    useEffect(()=>{
        checkAuth(navigate);
        getRoomUsers().then((msg)=>{
            initSocketConnection(roomID,playVideoClient,setClientState,clientRef,createMessage,setView,getRoomUsers)
        });
        ;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    

    function getRoomUsers(){

        return new Promise((resolve,reject)=>{
            axios.post(process.env.REACT_APP_BACKEND_API+"/get-room-users/",{roomID:roomID}).then((res)=>{
            setUserArr((pre)=>{
                console.log(res.data);
                resolve("User added");
                return res.data;
            })
        })
        })   
    }
   function playVideo(vURL){
       setView("youtube")
       setUrl(vURL);
       setClient(false);
   }

   function playVideoClient(vURL){
        setView("youtube")
        setUrl(vURL);
        setClient(true);
   }

   function hostChoice(choice){
       userChoice(choice)
       setView(choice);
   }


    return(
        <div className="chatRoom-container">

            <div className="content-container">
                <div className="main-content-container">
                    {(view==="youtube")?<YoutubePlayer url={url} client={client} clientState={clientState} clientRef={clientRef}/>:"" }
                    {(view==="whiteboard"?<iframe id="room-whiteboard" src={`https://witeboard.com/${roomID}`} title="justexplore"></iframe>:"")}
                    <div id = "r-video-container" >
                        {userArr.map((data)=>{
                            return <UserProfile key={data._id} id={data._id} src={data.img} username={data.username} />
                        })}
                    </div>
                    
                </div>
                <div className="media-controls">
                    <button onClick={toggleUserVideo.bind(this,setvideoMedia,currentUserID)} ><img src={videoMedia} alt="videoICon"/></button>
                    <button onClick={toggleUserMic.bind(this,setMicMedia)} ><img src={micMedia} alt="micIcon"/></button>
                    <button onClick={openMore} ><img src={openMoreIcon} alt="moreIcon"/></button>
                </div>
            </div>

            <div className="tools-container">
                <div className="tab-container">
                    <button id="chat-btn" className="active" onClick={switchTab.bind(this,"chat")} ><img src={chatIcon} alt="chatIcon"/></button>
                    <button id="more-btn" onClick={switchTab.bind(this,"more")} ><img src={applicationIcon} alt="appIcon" /></button>
                    <button id="close-more-btn" onClick={closeMore} ><img src={closeIcon} alt="moreIcon"/></button>
                </div>
                <div className="chat-container activeTab">
                    <ChatBox createMessage={createMessage} toast={setToast}/>
                </div>
                <div className="more-container">
                    <button onClick={hostChoice.bind(this,"videochat")} ><img width="50px"  src={videoChatIcon} alt="youtubeIcon"/></button>
                    <button onClick={showYoutube}><img  width="50px"  src={youtubeIcon} alt="youtubeIcon"/></button>
                    <button onClick={hostChoice.bind(this,"whiteboard")} ><img width="50px"  src={boardIcon} alt="youtubeIcon"/></button>
                </div>
                <div className="youtube-result-container">
                    <YoutubeSearch cb={playVideo} toast={setToast}/>
                </div>
            </div>

            <Toast option={toast} cb={setToast}/>
        </div>
    )
}

export default ChatRoom;