import {sendMessageToOthers} from "../functions/roomConnection"
function ChatBox(props){

    const containerStyle = {
        height:"200px",
        overflow:"scroll"
    }

    function sendMessage(e){
        e.preventDefault();
        const msg = document.getElementById("chat-message-i").value;
        document.getElementById("chat-message-i").value = "";
        props.createMessage(msg)
        sendMessageToOthers(msg);
    }
    return(
        <div>
        <div style={containerStyle} id="chat-message-container" ></div>
            <form>
                <input type="text" name="chatMessage" id="chat-message-i"/>
                <button onClick={sendMessage}>Send</button>
            </form>
        </div>
    )
}
export default ChatBox;