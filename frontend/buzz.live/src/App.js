import Login from "./pages/Login";
import Home from "./pages/Home"
import ChatRoom from "./pages/ChatRoom"
import {BrowserRouter,Route,Routes} from "react-router-dom";



function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/room/:params" target="_blank" element={<ChatRoom />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
