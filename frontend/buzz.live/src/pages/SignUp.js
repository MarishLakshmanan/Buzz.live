import {useState} from "react";
import axios from "axios"
import { useNavigate } from 'react-router-dom'


var counter = 0;
var socialArray = [];
function SignUp(){

    const navigate = useNavigate();

    const [src,setSrc] = useState("https://miro.medium.com/max/1400/1*Nm4_WwWrQT2eveqwpr6d9g.jpeg");
    
    function showImage(){
        let file = document.getElementById("s-Img").files[0];
        if(file){
            var reader = new FileReader();
            reader.onload = function(e) {
                setSrc(reader.result);
            }

            reader.readAsDataURL(file);
        }
           
    }

    function signUp(e){
        e.preventDefault();

        
        for(var i=0;i<counter;i++){
            socialArray[i]=document.getElementById("social"+(i+1)).value;
        }
        
        const User = {
            name:document.getElementById("s-Uname").value,
            email:document.getElementById("s-Email").value,
            pass:document.getElementById("s-Pass").value,
            img:src,
            mediaLinks:socialArray
        }
        axios.post("http://localhost:5000/signUp",User).then((res)=>{
            if(res.data.msg==="success") {
                navigate("/login")
            }else{
                alert("Sry something went wrong please try again")
            }
        });
        
    }

    function getMedias(e){
        e.preventDefault();
        counter++;
        const input = document.createElement("input")
        const div = document.getElementById("s-social-div");
        div.appendChild(input);
        input.type = "text";
        input.placeholder = "paste your Id link here";
        input.name = "social"+counter;
        input.id = "social"+counter;
    }

    return(
        <div>
            <form action="http://localhost:5000/signUp" method="POST">
                <input placeholder="Name" id="s-Uname" name="uname" type="text" />
                <input placeholder="E-mail" id="s-Email" name="email" type="email" />
                <input placeholder="Password" id="s-Pass" name="pass" type="password" />
                <input onChange={showImage} type="file" name="userImage" id="s-Img" accept="image/*"></input>
                <div id="s-social-div">
                <label>Link your other social media applications</label><br />
                <button onClick={getMedias}>+</button>
                </div>
                
                
                <button onClick={signUp}>Submit</button>
            </form>
            <img width="500px" height="500px" src={src} alt="" id="s-dis-img" />
        </div>
    )
}

export default SignUp;