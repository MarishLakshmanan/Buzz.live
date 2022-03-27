import axios from "axios";
import ReactPlayer from "react-player";
import YouResult from "./YouResult";
import {playVideoToOthers,videoStateChanged} from "../functions/roomConnection";
import {useState,useRef} from "react"

function YoutubePlayer(props){

    const[videos,setVideos] = useState([]);
    const[url,setUrl] = useState("");
    const playerRef = useRef();
    const[state,setState] = useState(true);

    function searchVideo(e){
        e.preventDefault();
        const query =  document.getElementById("you-video").value;
        const url  = `https://www.googleapis.com/youtube/v3/search?key=AIzaSyDg5qXORRGImzmPysBcIWI5f09avJ8U-3E&part=snippet&q=${query}&maxResults=${10}&type=video`
        axios.get(url).then((res)=>{
            setVideos(res.data.items);
        })
    }

    function playVideo(id){
        setVideos([]);
        setUrl(`https://www.youtube.com/watch?v=${id}`)
        playVideoToOthers(id,props.setClientUrl)
    }

    function videoState(){
        setState(true);
        videoStateChanged(true,playerRef.current.getCurrentTime());
    }

    function videoPaused(){
        setState(false);
        videoStateChanged(false,playerRef.current.getCurrentTime());
    }

    return(
        <div>
            <form>
            <input type="text" placeholder="Search video" id="you-video" name="youtube-video" />
            <button onClick={searchVideo}>Search</button>
            </form>
            <div id="searchResults">
                {videos.map((data)=>{
                    const url = `https://img.youtube.com/vi/${data.id.videoId}/0.jpg`
                    return (<YouResult key={data.id.videoId} img={url} cb={playVideo} videoId={data.id.videoId} />)
                })}
            </div>
            <div>
                <ReactPlayer ref={playerRef} url={url} onPlay={videoState} playing={state} onPause={videoPaused} controls={true} />
                <ReactPlayer ref={props.clientPlayerRef} url={props.clientUrl} playing={props.clientState} onClick={()=>(props.setClinetState(true))}/>
            </div>
        </div>
    )
}

export default YoutubePlayer;