import {sendMessageToOthers} from "../functions/roomConnection"
import "../styles/chatBox.css"
import sendIcon from "../resources/send.png"

function ChatBox(props){


    function sendMessage(e){
        e.preventDefault();
        const msg = document.getElementById("chat-message-i").value;
        
        if(msg==null || msg===""){
            props.toast({state:true,msg:"Please enter something 😊"})
        }else{
            document.getElementById("chat-message-i").value = "";
            props.createMessage(msg)
            sendMessageToOthers(msg);
        }
    }
    return(
        <div className="chatBox-container">
        <div id="chat-message-container" ></div>
        <form>
            <input type="text" name="chatMessage" id="chat-message-i"/>
            <button onClick={sendMessage}><img src={sendIcon} alt="sendIcon" /></button>
        </form>
        </div>
    )
}
export default ChatBox;