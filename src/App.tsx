import "./App.css";
import { axiosInstance } from "./axios";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./redux/features/userSlice";

axiosInstance.defaults.withCredentials = true;

function App() {
  const [loading, setLoading] = useState(true); 
  const userData = useSelector((state: any) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axiosInstance.get("/fetch-user-data");
        dispatch(setUserData(response.data.user));
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [dispatch]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={userData ? <Chat /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
