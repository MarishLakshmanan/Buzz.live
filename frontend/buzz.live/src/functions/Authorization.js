import axios from "axios"

function checkAuth(nav){
    const atoken =  localStorage.getItem("atoken");
        const rtoken = localStorage.getItem("rtoken")
        if(atoken){
            axios.get("http://localhost:5000/",{headers : {"authorization" : `Bearer ${atoken}`},crossdomain:true}).then((res)=>{
                if(res.data.msg!=="hola"){
                    if(rtoken){
                        axios.get("http://localhost:5000/token",{headers:{"authorization":`Bearer ${rtoken}`,crossdomain:true}}).then((res)=>{
                            localStorage.setItem("atoken",res.data.atoken);
                            console.log("Stored again");
                        });
                    }else{
                       nav("/login");
                       console.log("Go to login");
                    }
                }else{
                    console.log(res.data.user);
                }
            })
        }else{
           nav("/login");
           console.log("Go to login");
        }
}

function logout(nav){
    const rtoken =  localStorage.getItem("rtoken");
    localStorage.clear();
    axios.get("http://localhost:5000/logout",{headers :{"authorization" : `Bearer ${rtoken}`}}).then((res)=>{
        console.log("Logged out");
        nav("/login",{replace:true});

    })
    
}


export {checkAuth,logout};