import ReactPlayer from "react-player";
import "../styles/youtubePlayer.css"
import {useRef,useState} from "react"
import {videoStateChanged} from "../functions/roomConnection"

function YoutubePlayer(props){

    const [hostState,setHost] = useState(true);
    const clientState = props.clientState;
    const hostRef = useRef();
    const clientRef = props.clientRef;

    

    function videoPaused(){
        setHost(false);
        const seconds =hostRef.current.getCurrentTime();
        videoStateChanged(false,seconds)
    }

    function videoPlay(){
        setHost(true);
        const seconds =hostRef.current.getCurrentTime();
        videoStateChanged(true,seconds)
    }

    if(!props.client){
        return (

            <div id="react-player">
                <ReactPlayer ref={hostRef} width="100%" height="100%" url={props.url} controls={true} playing={hostState} onPause={videoPaused} onPlay={videoPlay} />
            </div>
            
        )
    }else{
        return (

            <div id="react-player">
                <ReactPlayer ref={clientRef} width="100%" height="100%" url={props.url} playing={clientState} />
            </div>
            
        )   
    }
}

export default YoutubePlayer;