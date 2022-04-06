import axios from "axios"
import {useEffect,useState} from "react"
import { useNavigate } from "react-router-dom";
import { checkAuth,logout } from "../functions/Authorization";
import Room from "../components/Room"
import CreateRoom from "../components/CreateRoom"
import liveIcon from "../resources/live.png"
import logOutIcon from "../resources/stand-by.png"
import aboutIcon from "../resources/info-button.png"
import profileIcon from "../resources/profile.png"
import "../styles/main.css"
import Profile from "../components/Profile";
import Toast from "../components/Toast"
import emptyVideo from "../resources/empty.mp4"
import Login from "./Login"

function Home(){

    const [nav,setNav] = useState(true);
    const [rooms,setRooms] = useState([]);
    const [roomModal,setRoomModal] = useState(false);
    const [profileModal,setProfileModal] = useState(false);
    const navigate = useNavigate();
    const [toast,setToast]=useState({state:false,msg:""});
    const[authenticated,setAuthenticated] = useState(false);

    useEffect(()=>{
        checkAuth(navigate,setAuthenticated)
        getRooms(setRooms);  

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    function toggleRoomModal(){
        setRoomModal((pre)=>!pre);
    }

    function toggleProfileModal(e){
        if(e){
            e.preventDefault();
        }
        document.documentElement.scrollTop=0;
        setProfileModal((pre)=>!pre);
    }


    function toggleNav(e){
        e.preventDefault()
        setNav((pre)=>!pre)
    }

    const navProfile = {
        display:(nav)?"flex":"none"
    }

    const navAbout = {
        display:(nav)?"none":"flex"
    }
    

    return(
        <div>
            <header>
                <div id="header">
                    <span>
                        <h1>Buzzz.live</h1>
                        <span><hr /> <span>.</span></span>
                    </span>
                </div>
            </header>
            
             <button id="logout-btn" onClick={logout.bind(this,navigate,setAuthenticated)}><img src={logOutIcon} alt="logout"/></button>
             
             <section>
                <ul className="nav" >
                    <li onClick={toggleNav}><a href="/"><img src={liveIcon} alt="live-icon" name="home"/></a></li>
                    <li onClick={toggleProfileModal}><a href="/"><img src={profileIcon} alt="live-icon" name="profile"/></a></li>
                    <li onClick={toggleNav}><a href="/"><img src={aboutIcon} width="35px" alt="about-icon" name="about"/></a></li>
                </ul>

                <div className="main-rooms-container">
                    <button onClick={toggleRoomModal} className="create-btn">Create +</button>


                    {(rooms.length!==0)?
                    <div id="rooms-container" style={navProfile}>

                        {rooms.map((room,index)=>{
                            return(<Room key={room._id} title={room.title} description={room.description} npeople={room.npeople} language={room.lang} img={room.img} roomID={room.roomID} host={room.host} toast={setToast} />)
                        })}
                    </div>:
                    <div className="illustrator-container">
                        <video src={emptyVideo} autoPlay={true} loop />
                        <p>Sorry no live rooms are currently available now😭,hey but you can be the one first one to create a room just create one and come back later maybe there will be users in your room your room will be deleted only after 24hrs 😊</p>
                    </div>
                    }

                    <div className="about-container" style={navAbout}>
                        <p>nullam non nisi est sit amet facilisis magna etiam tempor orci eu lobortis elementum nibh tellus molestie nunc non blandit massa enim nec dui nunc mattis enim ut tellus elementum sagittis vitae et leo duis ut diam quam nulla porttitor massa id neque aliquam vestibulum morbi blandit cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies leo integer malesuada nunc vel risus commodo viverra maecenas accumsan lacus vel facilisis volutpat est velit egestas dui id ornare arcu odio ut sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor elit sed vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc consequat interdum varius sit amet mattis vulputate enim nulla aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat semper viverra nam libero justo laoreet sit amet cursus sit amet dictum sit amet justo donec enim diam vulputate ut pharetra sit amet aliquam id diam maecenas ultricies mi eget mauris pharetra et ultrices neque ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae proin</p>
                        <div>
                            <span>
                            <img src="https://picsum.photos/200" alt="host-icon" width="150px" />
                            <h1>Marish laskhmanan</h1>
                            </span>
                            <span>
                            <img src="https://picsum.photos/200" alt="host-icon" width="150px" />
                            <h1>Mohammed Zuhaib</h1>
                            </span>
                            <span>
                            <img src="https://picsum.photos/200" alt="host-icon" width="150px" />
                            <h1>Navin sai reddy</h1>
                            </span>
                            
                        </div>
                        
                    </div>

                </div>
                 
             </section>

{/* Modals */}
             <Profile open={profileModal} onClose={toggleProfileModal} toast={setToast}/>
             <CreateRoom getRooms={getRooms} setRooms={setRooms} onClose={toggleRoomModal} open={roomModal} toast={setToast}/>
             <Toast option={toast} cb={setToast}/>
             {authenticated?"":<Login cb={setAuthenticated}/>}
        </div>
    )
}






function getRooms(setRooms){
    axios.get(process.env.REACT_APP_BACKEND_API+"/getRoom").then((res)=>{
        setRooms(res.data)
    })
}

export default Home;