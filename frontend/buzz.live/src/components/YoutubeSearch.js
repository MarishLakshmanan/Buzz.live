import axios from "axios";
import YouResult from "./YouResult";
import {useState} from "react"
import "../styles/youtubeSearch.css"
import {playVideoToOthers} from "../functions/roomConnection"

function YoutubeSearch(props){

    const[videos,setVideos] = useState([]);

    function searchVideo(e){
        e.preventDefault();
        const query =  document.getElementById("you-video").value;

        if(query==null || query===""){
            props.toast({state:true,msg:"Please enter somthing"})
        }
        else{
            const url  = `https://www.googleapis.com/youtube/v3/search?key=${process.env.REACT_APP_YOUTUBE}&part=snippet&q=${query}&maxResults=${10}&type=video`
            axios.get(url).then((res)=>{
            setVideos(res.data.items);
        })
        }
    }

    function playVideo(id){
        props.cb(`https://www.youtube.com/watch?v=${id}`)
        playVideoToOthers(`https://www.youtube.com/watch?v=${id}`)
    }

    return(
        <div id="youtube-search">
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
           
        </div>
    )
}

export default YoutubeSearch;