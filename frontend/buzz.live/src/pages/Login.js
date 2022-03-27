import axios from "axios"
import {useNavigate} from "react-router-dom";

var navigate
function logUsers(e){
    e.preventDefault();
    const username = document.querySelector("#uname").value;
    const pass =  document.querySelector("#pass").value;
    const cred = {
        uname:username,
        pass:pass
    }

    axios.post("http://localhost:5000/login",cred).then((res)=>{
        localStorage.setItem("atoken",res.data.atoken);
        localStorage.setItem("rtoken",res.data.rtoken);
        localStorage.setItem("uname",res.data.uname);
        localStorage.setItem("img",res.data.img);
        navigate("/")
    })
}

function Login(){

    navigate = useNavigate();

    return(
        <form>
           <input id="uname" type="text" name="username"/>
           <input id="pass" type="password" name="password"/>
           <button type="submit" onClick={logUsers}>Login</button>
        </form>
    )
}

export default Login;