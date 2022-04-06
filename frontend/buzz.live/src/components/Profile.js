import axios from "axios";
import profileIcon from "../resources/user.png"
import "../styles/profile.css"
import {useState} from "react";
import ReactDOM from "react-dom"



function Profile(props){
    const [edit,setEdit] = useState(false);

    if(!props.open) return null;

    const username = localStorage.getItem("uname");
    var userImg = localStorage.getItem("img");
    const useremail = localStorage.getItem("email");
    


    function showImage(){
        let file = document.getElementById("p-Img").files[0];
        if(file){
            var reader = new FileReader();
            reader.onload = function(e) {
                document.querySelector(".profile-container form img").src=reader.result;
                userImg = reader.result;
            }

            reader.readAsDataURL(file);
        }
           
    }

    function setImage(){
        if(edit){
            document.querySelector(".profile-container input[type='file']").click();
        }
    }

    function editUser(e){
        if(!edit){
            e.preventDefault();
            const btn = document.getElementById("p-edit-btn");
            document.querySelectorAll(".profile-container input").forEach((element)=>{
                element.removeAttribute('readonly');
                element.classList.add("active");
            })
            btn.innerHTML = "Update";
            setEdit(true);
        }else{
            e.preventDefault();
            setEdit(false);
            const name  = document.getElementById("p-username").value;
            const email = document.getElementById("p-email").value;
            userImg = document.querySelector(".profile-container form img").src;
            if(name==null || name==="" || email==null || email===""){
                props.toast({state:true,msg:"Do not let any field empty!"})
            }else{
                updateUser(name,email,userImg);
                props.onClose();
            }
            
        }
        
    }
    return ReactDOM.createPortal(
        <div className="profile-container">
            <form>
                <div>
                    <img onClick={setImage} src={(userImg)?userImg:profileIcon} alt="userimage" />
                    <input onChange={showImage} type="file" name="userImage" id="p-Img" accept="image/*"></input>
                </div>
                <h3 onClick={()=>{setEdit(false);props.onClose()}}>X</h3>
                <input id="p-username" spellCheck="false" autoComplete="off" type="text" name="userName" defaultValue={username} readOnly />
                <input id="p-email" type="email" name="userEmail" defaultValue={useremail} readOnly/>
                <button id="p-edit-btn" onClick={editUser}>Edit</button>
            </form>
        </div>,document.getElementById("portal")
    )
}




function updateUser(name,email,img){
    const uID = localStorage.getItem("id");
    localStorage.setItem("uname",name);
    localStorage.setItem("email",email);
    localStorage.setItem("img",img);
    axios.post(process.env.REACT_APP_BACKEND_API+"/updateUser",{uID:uID,name:name,email:email,img:img}).then((res)=>{
        console.log(res.data);
    })
}

export default Profile;