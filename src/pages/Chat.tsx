import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Confirm } from "react-admin";
import { axiosInstance } from "../axios";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/features/userSlice";
// import { setOnlineUsers } from "../redux/features/onlineUserSlice";
import PersonIcon from "@mui/icons-material/Person";
import { BsInstagram } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { Socket, io } from "socket.io-client";
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';

interface ChatMessage {
	_id: string;
	chatId: string;
	content: string;
	senderId: string;
	createdAt: Date;
	updatedAt: Date;
	date: Date;
}

const SOCKET_SERVER_URL = "http://localhost:3000";

const Chat: React.FC = () => {
	const [open, setOpen] = useState(false);
	const [openProfile, setOpenProfile] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [allUsers, setAllUsers] = useState([]);
	const [chatRoom, setChatRoom] = useState({
		senderId: "",
		receiverId: "",
		chatId: "",
	});

	const [message, setMessage] = useState("");
	const [receiverData, setReceiverData] = useState({
		username: "",
		profile: "",
	});

	const fetchUsereData = useSelector((state: any) => state.user.userData);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
	const [typing, setTyping] = useState<{
		msg: string;
		senderId: string;
		receiverId: string;
		status: boolean;
	}>();

	const messagesEndRef1 = useRef<HTMLDivElement>(null);

	useEffect(() => {
		scrollToBottom();
	}, [chatMessages]);

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	const [searchQuery, setSearchQuery] = useState(""); // State for search query

    const messagesEndRef = useRef<HTMLDivElement>(null);

	const logout = async () => {
		await axiosInstance
			.get("/log-out")
			.then(() => {
				navigate("/");
				dispatch(setUserData(null));
			})
			.catch((error: any) => {
				console.error("Logout error:", error);
			});
	};
	useEffect(() => {
		const getAllUser = async () => {
			let response = await axiosInstance.get("/chats/get-all-users");
			const filteredUsers = response.data.data.filter(
				(user: any) => user._id !== fetchUsereData._id
			);
			setAllUsers(filteredUsers);
			if (filteredUsers.length > 0 && !receiverData.username) {
				setReceiverData({
					username: filteredUsers[0].username,
					profile: filteredUsers[0].profile,
				});
			}
		};
		getAllUser();
	}, []);

	useEffect(() => {
		const socket: Socket = io(SOCKET_SERVER_URL);

		socket.on("connect", () => {
			console.log("connected to server");
			socket.emit("add-online-users", fetchUsereData._id);
		});

		socket.on("getOnlineUsers", (data: []) => {
			setOnlineUsers(data);
		});

		socket.on("get-messages", (reseivedData: any) => {
			setChatMessages((prev) => [...prev, reseivedData]);
		});

		let typingTimeout: ReturnType<typeof setTimeout>;

		socket.on("typing", (res: any) => {
			setTyping(res);
			clearTimeout(typingTimeout);

			typingTimeout = setTimeout(() => {
				setTyping(undefined);
			}, 3000);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const chatWithUser = async (reciver_id: string) => {
		const newChatRoom = {
			sender_id: fetchUsereData._id,
			reciver_id,
		};

		const response = await axiosInstance.post(
			"/chats/create-chat-room",
			newChatRoom
		);

		console.log(response, "chat response");
		if (response.data.success) {
			setChatRoom({
				senderId: fetchUsereData._id,
				receiverId: reciver_id,
				chatId: response.data.chatRoom._id,
			});

			setReceiverData({
				username: response.data.reciversData.username,
				profile: response.data.reciversData.profile,
			});

			const allMsgRes = await axiosInstance.get(
				`/message/get-all-messages/${chatRoom.chatId}`
			);

			setChatMessages(allMsgRes.data.allMessages);
		}
	};
	useEffect(() => {
		const fetchMessages = async () => {
			if (chatRoom.chatId) {
				const allMsgRes = await axiosInstance.get(
					`/message/get-all-messages/${chatRoom.chatId}`
				);

				setChatMessages(allMsgRes.data.allMessages);
			}
		};

		fetchMessages();
	}, [chatRoom.chatId]);


	const fetchUsers = async () => {
        try {
            let response = await axiosInstance.get("/chats/get-all-users");
            const filteredUsers = response.data.data.filter(
                (user: any) =>
                    user._id !== fetchUsereData._id &&
                    user.username.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setAllUsers(filteredUsers);
            if (filteredUsers.length > 0 && !receiverData.username) {
                setReceiverData({
                    username: filteredUsers[0].username,
                    profile: filteredUsers[0].profile,
                });
            }
        } catch (error) {
            console.error("Fetch users error:", error);
        }
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    useEffect(() => {
        fetchUsers();
    }, [searchQuery]);


	const sendMessage = async () => {
		console.log(message, "message issss");
		if (message.trim()) {
			let msgBody = {
				chatId: chatRoom.chatId,
				content: message,
				senderId: fetchUsereData._id,
			};

			const socket: Socket = io(SOCKET_SERVER_URL);

			socket.emit("send-message", {
				...msgBody,
				receiverId: chatRoom.receiverId,
			});

			await axiosInstance.post("/message/create-message", msgBody);

			const allMsgRes = await axiosInstance.get(
				`/message/get-all-messages/${chatRoom.chatId}`
			);
			setChatMessages(allMsgRes.data.allMessages);

			scrollToBottom();

			setMessage("");
		}
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setMessage(e.target.value);
		const socket: Socket = io(SOCKET_SERVER_URL);

		socket.emit("typing", {
			msg: "typing",
			senderId: chatRoom.senderId,
			receiverId: chatRoom.receiverId,
			status: true,
		});
	};

	return (
		<div className="min-h-screen flex flex-col md:flex-row  ">
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
					<div ref={messagesEndRef1 } className="bg-green-900 text-gray-600 p-3 flex justify-between items-center">
						{/* Search Bar */}
						<input
							type="text"
							
							onChange={handleSearchChange}
							placeholder="Search users..."
							className="w-full mt-2 px-2 py-1 border bg-green-800 border-green-800 rounded-3xl focus:outline-none text-gray-200"
						/>
						{/* Logout Button Icon */}
						<div className="flex items-center p-2">
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
						<div className="	border-t -mb-5 border-gray-400"></div>;
					{/* Body users list */}

					{allUsers.map((data: any) => (
						<React.Fragment key={data._id}>
							<div
								onClick={() => chatWithUser(data._id)}
								className={`flex items-center px-5 py-5 bg-green-900 hover:bg-green-700 text-green-200`}
								key={data._id}
							>
								<img
									src={data.profile}
									alt="User Profile"
									className="w-10 h-10 rounded-full mr-2"
								/>
								<div className="flex-1 ml-3">{data.username}</div>{" "}
								{onlineUsers.some((user: any) => user.userId === data._id) && (
									<div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
								)}
							</div>
							<div className="border-t -mb-6 border-gray-400"></div>;
						</React.Fragment>
					))}
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
								src={receiverData.profile}
								alt="User Profile"
								className="w-8 h-8 mr-2 rounded-full"
							/>
							{/* User Name */}
							<div className="font-semibold">
								{receiverData.username}
								{typing && typing.status ? (
									<div className="text-sm text-green-200">
										typing<span className="animate-pulse">...</span>
									</div>
								) : (
									<div className="text-sm text-green-200"> {"  "} </div>
								)}
							</div>
						</div>
						{/* Online Status */}
						<div className="flex items-center space-x-4 mr-4" >

						<CallIcon/>
						<VideocamIcon/>
						</div>
					</div>
					{/* Chat Body */}
					<div
						className="flex-1 bg-white bg-opacity-75 p-4 overflow-y-auto"
						id="chatMessages"
						style={{ backgroundImage: "url(path/to/your/image.jpg)" }}
					>
						<div className="flex flex-col gap-2">
							{chatMessages.map((msg: any) => (
								<React.Fragment key={msg._id}>
									{msg.senderId == fetchUsereData._id && (
										<div className="flex justify-end">
											<div className="relative bg-green-900 text-white p-2 rounded-lg max-w-xs  flex flex-col items-end">
												<div className="message-content">{msg.content}</div>
												<span className="text-xs text-white self-end">
													{new Date(msg.createdAt).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
										</div>
									)}

									{msg.senderId == chatRoom.receiverId && (
										<div className="flex">
											<div className="relative bg-white text-black p-2 rounded-lg max-w-xs flex flex-col items-start">
												<div className="message-content" ref={messagesEndRef}>
													{msg.content}
												</div>
												<span className="text-xs text-black self-start">
													{new Date(msg.createdAt).toLocaleTimeString([], {
														hour: "2-digit",
														minute: "2-digit",
													})}
												</span>
											</div>
										</div>
									)}
								</React.Fragment>
							))}
						</div>
					</div>
					{/* Chat Footer */}
					<div className="bg-green-700 text-white p-4 flex items-center ">
						<input
							type="text"
							value={message}
							onChange={handleInputChange}
							placeholder="Type your message..."
							className="w-full  px-3 py-2 border bg-green-800 border-green-800 rounded-3xl focus:outline-none "
						/>
						<div
							onClick={sendMessage}
							id="sendMessage"
							className=" text-white p-2 ml-2 bg-green-700"
						>
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
							<img
								className="object-cover object-center h-32"
								src={fetchUsereData.profile}
							/>
						</div>
						<div className="text-center mt-2">
							<h2 className="font-semibold text-white">
								{fetchUsereData.username}
							</h2>

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
