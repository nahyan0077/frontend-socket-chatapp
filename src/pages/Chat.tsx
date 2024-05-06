import React, { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Confirm } from "react-admin";
import { axiosInstance } from "../axios";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/features/userSlice";
import PersonIcon from "@mui/icons-material/Person";
import { BsInstagram } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

const Chat: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [openProfile, setOpenProfile] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

    const fetchUsereData = useSelector((state: any)=>state.user.userData)
    
    
	const logout = async () => {
		await axiosInstance
			.get("/log-out")
			.then(() => {
				dispatch(setUserData(null));
				navigate("/");
			})
			.catch((error: any) => {
				console.error("Logout error:", error);
			});
	};

	return (
		<div className="flex flex-col md:flex-row h-screen">
			<Confirm
				className="0"
				isOpen={open}
				title={`Confirmation`}
				content="Are you sure you want to logout?"
				onClose={() => setOpen(false)}
				onConfirm={logout}
				cancel="Cancel"
				confirm="Yes"
				confirmColor="warning"
			/>
			{/* User List Section */}
			<div className="w-full md:w-1/4 flex-shrink-0 bg-green-800 border-r border-gray-300">
				{/* User List Container */}
				<div className="flex flex-col h-full">
					{/* Header */}
					<div className="bg-green-900 text-gray-600 p-3 flex justify-between items-center">
						{/* Search Bar */}
						<input
							type="text"
							placeholder="Search users..."
							className="w-full mt-2 px-2 py-1 border bg-green-800 border-green-800 rounded-3xl focus:outline-none text-gray-200"
						/>
						{/* Logout Button Icon */}
						<div className="flex items-center p-2">
							{/* Person Icon */}
							<div
								onClick={() => setOpenProfile(!openProfile)}
								className="text-white  p-2"
							>
								<PersonIcon />
							</div>
							{/* Logout Icon */}
							<div onClick={() => setOpen(true)} className="text-white  p-2">
								<LogoutIcon />
							</div>
						</div>
					</div>
					{/* Body */}
					{/* User Item (Replace with dynamic data) */}
					<div className="border-t border-gray-400"></div>
					<div className="flex items-center px-5 py-5 bg-green-800 hover:bg-green-900 text-green-200">
						{/* User Profile Image */}
						<img
							src="https://media.istockphoto.com/id/1473780957/vector/default-avatar-profile-user-profile-icon-business-people-profile-picture-portrait-user.jpg?s=1024x1024&w=is&k=20&c=puf1EPY0cx9piSfK1e65kYpZC91_8-QSevdyfGukWvQ="
							alt="User Profile"
							className="w-10 h-10 rounded-full mr-2"
						/>
						<div className="flex-1">User 1</div>{" "}
						{/* User name (Replace with dynamic data) */}
						<div className="w-2 h-2 bg-green-00 rounded-full mr-2"></div>{" "}
						{/* Green mark indicating online status */}
					</div>
					<div className="border-t border-gray-400"></div>;{/* Footer */}
					{/* <div className="bg-green-700 text-white p-9 flex items-center "></div> */}
				</div>
			</div>

			{/* Chat Section */}
			{!openProfile && (
				<div className="flex flex-col flex-1 bg-green-100 dark:bg-green-900">
					{/* Chat Header */}
					<div className="bg-green-700 text-white p-4  flex items-center justify-between">
						<div className="flex items-center space-x-2">
							{/* User Profile Image */}
							<img
								src="https://media.istockphoto.com/id/1473780957/vector/default-avatar-profile-user-profile-icon-business-people-profile-picture-portrait-user.jpg?s=1024x1024&w=is&k=20&c=puf1EPY0cx9piSfK1e65kYpZC91_8-QSevdyfGukWvQ="
								alt="User Profile"
								className="w-8 h-8 rounded-full"
							/>
							{/* User Name */}
							<div className="font-semibold">User Name</div>
						</div>
						{/* Online Status */}
						<div className="text-xs text-green-200">Online</div>
					</div>
					{/* Chat Body */}
					<div
						className="flex-1 bg-white bg-opacity-75 p-4 overflow-y-auto"
						id="chatMessages"
						style={{ backgroundImage: "url(path/to/your/image.jpg)" }}
					>
						<div className="flex flex-col gap-2">
							<div className="flex justify-end">
								<div className="relative bg-green-900 text-white p-2 rounded-lg max-w-xs  flex flex-col items-end">
									<div className="message-content">
										Hello, how can I help you?
									</div>
									<span className="text-xs text-white self-end">10:00 AM</span>
								</div>
							</div>
							<div className="flex">
								<div className="relative bg-white text-black p-2 rounded-lg max-w-xs flex flex-col items-start">
									<div className="message-content">
										Sure, I have some options for you.
									</div>
									<span className="text-xs text-black self-start">
										10:05 AM
									</span>
								</div>
							</div>
						</div>
					</div>
					{/* Chat Footer */}
					<div className="bg-green-700 text-white p-4 flex items-center ">
						<input
							type="text"
							placeholder="Type your message..."
							className="w-full  px-3 py-2 border bg-green-800 border-green-800 rounded-3xl focus:outline-none "
						/>
						<div id="sendMessage" className=" text-white p-2 ml-2 bg-green-700">
							<SendIcon />
						</div>
					</div>
				</div>
			)}

			{openProfile && (
				<div className="flex flex-col flex-1 bg-green-100 dark:bg-green-800 p-40">
					<div className="dark:bg-green-900 shadow-xl rounded-lg text-gray-900 ">
						<div className="rounded-t-lg h-32 overflow-hidden">
							<img
								className="object-cover object-top w-full"
								src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
								alt="Mountain"
							/>
						</div>
						<div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
							<img className="object-cover object-center h-32" src={fetchUsereData.profile} />
						</div>
						<div className="text-center mt-2">
							<h2 className="font-semibold text-white">{fetchUsereData.username}</h2>

							<p className="text-gray-400"> bio </p>
						</div>
						<ul className="py-4 mt-2 text-gray-200 flex items-center justify-around">
							<li className="flex flex-col items-center justify-around">
								<BsInstagram />

								<div>2k</div>
							</li>
							<li className="flex flex-col items-center justify-between">
								<FaGithub />
								<div>10k</div>
							</li>
							<li className="flex flex-col items-center justify-around">
								<FaLinkedin />
								<div>15k</div>
							</li>
						</ul>
						<div className="p-4 border-t mx-8 mt-2">
							<button
								className="w-1/2 block mx-auto rounded-full bg-green-700 hover:shadow-lg font-semibold text-white px-6 py-2"
								//   onClick={handleFollow}
							>
								Follow
							</button>
						</div>
					</div>
				</div>

			)}
		</div>
	);
};

export default Chat;
