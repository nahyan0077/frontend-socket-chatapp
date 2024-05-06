import "./index.css";
import { axiosInstance } from "./axios";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useEffect, useState } from "react";
import { Route,  BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

axiosInstance.defaults.withCredentials = true;


function App() {
	const [userExists, setUserExists] = useState(false);
	const userData = useSelector((state: any) => state.user.userData);
  
	useEffect(() => {
	  if (userData) {
		setUserExists(true);
	  }
	}, [userData]);
	return (
		<>
		<Router>
			<Routes>
				<Route path="/" element={ !userExists ?  <Login/> : <Navigate to="/chat" />  } />
				<Route path="/signup" element={ !userExists ?  <Signup/> : <Navigate to="/chat" /> } />
				<Route path="/chat" element={ userExists ? <Chat/> : <Navigate to='/' /> } />
			</Routes>
		</Router>

		</>
	);
}

export default App;
