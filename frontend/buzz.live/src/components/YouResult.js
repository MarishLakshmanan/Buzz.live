

const imgStyle = {
    width:"100%",
    marginTop:"10px",
    cursor:"pointer",
}

function YouResult(props){

    return (
        <div>
            <img src={props.img} style={imgStyle} alt="Thumbnail" onClick={props.cb.bind(this,props.videoId)} />
        </div>
    )
}

export default YouResult;