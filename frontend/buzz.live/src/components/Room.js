
import "../styles/room.css"
import axios from "axios"

function Room(props){

    function enterRoom(){
        const uid = localStorage.getItem("id");
        axios.post(process.env.REACT_APP_BACKEND_API+"/add-room-user",{uid:uid,roomID:props.roomID}).then((res)=>{
            if(res.data.msg==="202"){
                props.toast({state:true,msg:"Sorry that room is full but don't worry there are plenty of other rooms for you 😊"})
            }else{
                window.open(`http://localhost:3000/room/${props.roomID}`);
            }
            
        })
        
    }

    return (
        <div id="room-container">
            <span className="r-title">
                <h4>{props.title}</h4>
                <p>{props.npeople}</p>

            </span>

            <span className="r-details">
                <p className="r-hostName">{`host.${props.host}`}</p>
                <p>{props.language}</p>
            </span>

            <p className="r-description">{props.description}</p>
            
            
            
            <img width="250" height="250" src={props.img} alt="Just an Imag"/>
            <div> </div>
            <div id="blur-1"> </div>
            <div id="blur-2"> </div>
            <div id="blur-3"> </div>
            <button onClick={enterRoom}>Join</button>
        </div>
    )
}

export default Room;