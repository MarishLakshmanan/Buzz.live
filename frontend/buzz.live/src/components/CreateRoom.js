import axios from "axios"

function CreateRoom(props){

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

        const room = {
            title:title,
            description:description,
            npeople:npeople,
            lang:lang,
            img:img,
            roomID:roomID
        }


        axios.post("http://localhost:5000/createRoom",room).then((res)=>{
            if(res.data.msg="Created"){
                console.log("Sucess");
                props.getRooms(props.setRooms)
            }else{
                console.log(res.data.err);
            }
        })
    }

    return(
        <div>
            <form>
                <input name="title" type="text" palceholder="Title" id="r-title"></input>
                <input name="description" type="text" palceholder="Description" id="r-des"></input>
                <select name="npeople" id="r-npeople">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="Unlimited">Unlimited</option>
                </select>
                <input name="lang" type="text" palceholder="language" id="r-lang" list="r-lang-list"/>
                <datalist id="r-lang-list">
                    <option value="English" />
                    <option value="Tamil" />
                    <option value="Hindi" />
                    <option value="Telugu" />
                    <option value="Malayalam" />
                </datalist>
                <input onChange={storeImage} type="file" name="roomImg" id="r-img" accept="image/*"></input>
                <button onClick={createRoom}>Create</button>
            </form>
        </div>
    )
}

export default CreateRoom;

