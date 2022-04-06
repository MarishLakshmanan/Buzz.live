import "../styles/userProfile.css"

function UserProfile(props){

    

    const videoStyle={
        width:"100%",
        height:"100%",
    }

    return(
        <div className="user-profile-container">
            <img src={props.src} alt="user profile" id={props.id+"img"} />
            <p>{props.username}</p>
            
            <div style={videoStyle} id={props.id}>

            </div>
        </div>
        

    )
}

export default UserProfile;