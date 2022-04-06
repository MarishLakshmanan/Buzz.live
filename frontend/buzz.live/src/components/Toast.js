import "../styles/toast.css"
import ReactDOM from "react-dom"

function Toast(props){

    if(!props.option.state) return null;
    

    console.log("Toast is called");

    function setToast(){
        props.cb({state:false,msg:""})
    }

    setInterval(setToast,5000)

    return ReactDOM.createPortal(
        <div className="toast-container" >
            <h3>Warning</h3>
            <p>{props.option.msg}</p>
            
        </div>,document.getElementById("toast")
    )
}

export default Toast;

