import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home"
import ChatRoom from "./pages/ChatRoom"
import {BrowserRouter,Route,Routes} from "react-router-dom";



function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/room/:params" element={<ChatRoom />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
