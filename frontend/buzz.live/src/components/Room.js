import { useNavigate } from "react-router-dom";


function Room(props){

    const navigate = useNavigate();

    function enterRoom(){
        navigate(`/room/${props.roomID}`)
    }

    return (
        <div>
            <h3>{props.title}</h3>
            <p>{props.description}</p>
            <p>{props.npeople}</p>
            <p>{props.language}</p>
            <img width="250" height="250" src={props.img} alt="Just an Imag"/>
            <button onClick={enterRoom}>Enter room</button>
        </div>
    )
}

export default Room;