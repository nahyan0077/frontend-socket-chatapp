import "./index.css";
import {axiosInstance} from './axios'
import Login from "./pages/Login";
import Signup from "./pages/Signup";

axiosInstance.defaults.withCredentials = true;

function App() {
	return (
		<>
			{/* <Login /> */}
      <Signup/>
		</>
	);
}

export default App;
