

function YouResult(props){

    return (
        <div>
            <img src={props.img} alt="Thumbnail" onClick={props.cb.bind(this,props.videoId)} />
        </div>
    )
}

export default YouResult;