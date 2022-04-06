import axios from "axios"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import profileIcon from "../resources/profile.png"
import "../styles/authorization.css"
import Toast from "../components/Toast";
import ReactDOM from "react-dom"


function Login(props){

    const navigate = useNavigate();

    const [src,setSrc] = useState(profileIcon);
    const [lFormVis,setlFormVis] = useState(true);
    const [toast,setToast]=useState({state:false,msg:""});
    
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

    function logUsers(e){
        e.preventDefault();
        const username = document.querySelector("#uname").value;
        const pass =  document.querySelector("#pass").value;
        const cred = {
            uname:username,
            pass:pass
        }
    
        if(username==null || username==="" || pass==null || pass===""){
            setToast({state:true,msg:"Please enter all the fields"})
            return;
        }else{
            axios.post(process.env.REACT_APP_BACKEND_API+"/login",cred).then((res)=>{
                if(res.data.msg==="Logged"){
                    localStorage.setItem("atoken",res.data.atoken);
                    localStorage.setItem("rtoken",res.data.rtoken);
                    localStorage.setItem("uname",res.data.uname);
                    localStorage.setItem("img",res.data.img);
                    localStorage.setItem("id",res.data._id);
                    localStorage.setItem("email",res.data.email);
                    props.cb(true);
                }else{
                    setToast({state:true,msg:"Please check your username and password"})
                }
                
            })
        }
       
    }

    function signUp(e){
        e.preventDefault();

        
        const User = {
            name:document.getElementById("s-Uname").value,
            email:document.getElementById("s-Email").value,
            pass:document.getElementById("s-Pass").value,
            img:src,
        }

        if(User.name==null || User.name==="" || User.email==null || User.email==="" || User.pass==null || User.pass===""){
            setToast({state:true,msg:"Please enter all the fields"})
            return;
        }else{
            axios.post(process.env.REACT_APP_BACKEND_API+"/signUp",User).then((res)=>{
                if(res.data.msg==="success") {
                    navigate("/")
                    document.getElementById("s-Uname").value =""
                    document.getElementById("s-Email").value =""
                    document.getElementById("s-Pass").value = ""
                    setToast({state:true,msg:"You are successfully registered now try logging in"})
                }else{
                    setToast({state:true,msg:"That username or E-mail is already present please try something else"})
                }
            });
        }
        
    }

    function toggleForm(){
        if(lFormVis){
            document.querySelector(".login-container").style.display="block";
            document.querySelector(".signup-container").style.display="none";
            document.querySelector("#l-signup-btn").style.display="block";
            document.querySelector("#s-login-btn").style.display="none";
            setlFormVis(false)
        }else{
            document.querySelector(".login-container").style.display="none";
            document.querySelector(".signup-container").style.display="block";
            document.querySelector("#l-signup-btn").style.display="none";
            document.querySelector("#s-login-btn").style.display="block";
            setlFormVis(true)
        }
    }

    return ReactDOM.createPortal(
        <div className="auth-container">
            <div className="auth-back">
                <div className="login-container">
                <h1>Login.</h1>
                    <form autoComplete="off">
                        <span>
                        <label>Username</label>
                        <input id="uname" type="text" name="username"/>
                        </span>
                        <span>
                        <label>Password</label>
                        <input id="pass" type="password" name="password" />
                        </span>
                    
                        <button type="submit" onClick={logUsers}>Login</button>
                        <p id="l-signup-btn" style={{marginBottom:"0",display:"block"}} onClick={toggleForm}>Don't have an account ?</p>
                    </form>
                </div>

                

                <div className="signup-container">
                <h1>SignUp.</h1>
                    <form autoComplete="off" method="POST">
                        
                        
                        <img src={src} onClick={()=>{document.getElementById("s-Img").click()}} alt="" id="s-dis-img" />
                        <input onChange={showImage} type="file" name="userImage" id="s-Img" accept="image/*" style={{display:"none"}}></input>
                        <span>
                            <label>Username</label>
                            <input id="s-Uname" name="uname" type="text" />
                        </span>

                        <span>
                            <label>E-mail</label>
                            <input id="s-Email" name="email" type="email" />
                        </span>
                        
                        <span>
                            <label>Password</label>
                            <input id="s-Pass" name="pass" type="password" />
                        </span>

                        <button onClick={signUp}>Sign Up</button>
                        <p id="s-login-btn" style={{display:"none"}}  onClick={toggleForm}>Already have an account ?</p>
                    </form>
                </div>
            </div>
            <Toast option={toast} cb={setToast}/>
        </div>,document.getElementById("portal")
        
    )
}

export default Login;