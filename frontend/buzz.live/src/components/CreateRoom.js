import axios from "axios"
import "../styles/createRoom.css"
import  ReactDOM  from "react-dom";

function CreateRoom(props){


    if(!props.open) return null;

    var img = "https://picsum.photos/200";



    function storeImage(){
        const file = document.getElementById("r-img").files[0];
        if(file){
            console.log("here");
            var reader = new FileReader();
            reader.onload = function(e){
                img = reader.result;
            }

            reader.readAsDataURL(file);
        }
    }

    function createRoom(e){
        e.preventDefault()
        const title = document.getElementById("r-title").value
        const description = document.getElementById("r-des").value
        const npeople = document.getElementById("r-npeople").value
        const lang = document.getElementById("r-lang").value    
        const roomID = Math.random().toString(16).slice(-4);

        if(title==null || title==="" || description==null || description==="" ||npeople==null || npeople==="" || lang==null || lang===""){
            props.toast({state:true,msg:"Do not let any fields empty!"})
            return;
        }

        const room = {
            title:title,
            description:description,
            npeople:npeople,
            lang:lang,
            img:img,
            roomID:roomID,
            host:localStorage.getItem("uname")
        }

        axios.post(process.env.REACT_APP_BACKEND_API+"/createRoom",room).then((res)=>{
            if(res.data.msg="Created"){
                console.log("Sucess");
                props.getRooms(props.setRooms)
                props.onClose();
            }else{
                console.log(res.data.err);
            }
        })
    }

    return ReactDOM.createPortal(
        <div className="modal-container">
            <form>
                <p onClick={props.onClose}>X</p>
                <h1>Enter details</h1>
                <input name="title" type="text" placeholder="Title" id="r-title"></input>
                <div>
                    <input name="npeople" type="text" placeholder="people" id="r-npeople" list="r-people-list"/>
                    <datalist id="r-people-list">
                        <option value="1" />
                        <option value="2" />
                        <option value="3" />
                        <option value="4" />
                        <option value="unlimited" />
                    </datalist>
                    <input name="lang" type="text" placeholder="language" id="r-lang" list="r-lang-list"/>
                    <datalist id="r-lang-list">
                        <option value="English" />
                        <option value="Tamil" />
                        <option value="Hindi" />
                        <option value="Telugu" />
                        <option value="Malayalam" />
                    </datalist>
                </div>

                
                <textarea name="description" rows="7" placeholder="Description" id="r-des"></textarea>
                <label>Add Image +
                <input onChange={storeImage} type="file" name="roomImg" id="r-img" accept="image/*"></input>
                </label>
                <button onClick={createRoom}>Create</button>
            </form>
        </div>,document.getElementById("portal")
    )
}

export default CreateRoom;

