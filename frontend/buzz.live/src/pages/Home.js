import axios from "axios"
import {useEffect,useState} from "react"
import { useNavigate } from "react-router-dom";
import { checkAuth,logout } from "../functions/Authorization";
import Room from "../components/Room"
import CreateRoom from "../components/CreateRoom"

function Home(){


    const [rooms,setRooms] = useState([]);
    const navigate = useNavigate();
    

    useEffect(()=>{
        checkAuth(navigate)
        getRooms(setRooms);  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    

    return(
        <div>
             <h1>Hello world</h1>
             <button onClick={logout.bind(this,navigate)}>Logout</button>
             <CreateRoom getRooms={getRooms} setRooms={setRooms}/>
             <div>
                 {rooms.map((room,index)=>{
                     return(<Room key={room._id} title={room.title} description={room.description} npeople={room.npeople} language={room.lang} img={room.img} roomID={room.roomID} />)
                 })}
             </div>
        </div>
    )
}


function getRooms(setRooms){
    axios.get("http://localhost:5000/getRoom").then((res)=>{
        setRooms(res.data)
    })
}

export default Home;