import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/authSlice";
import { IoChatbubbleOutline } from "react-icons/io5";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../configuration";
import { getData } from "../global/server";

export default function Chat() {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const [userChats, setUserChats] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedChatName, setSelectedChatName] = useState<string | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [users, setUsers] = useState([]);
  const getUsers = async () => {
    try {
      const response = await getData("/api/user", auth.token);

      console.log("response ", response);
      // Filter out users where isAdmin is false
      // const filteredUsers = response?.filter((user) => user.isAdmin === false);
      setUsers(response);

      setUserChats(response);

      //   setUsers(response);
    } catch (err) {
      console.log(err);
    }
  };

  // get all products
  useEffect(() => {
    getUsers();
  }, [location]);

  console.log(users);

  // useEffect(() => {
  //   const fetchUserChats = async () => {
  //     try {
  //       const chatsRef = collection(db, "chats");

  //       // Subscribe to real-time updates using onSnapshot
  //       const unsubscribe = onSnapshot(chatsRef, (querySnapshot) => {
  //         console.log(querySnapshot.docs);
  //         const chats = querySnapshot.docs.map((doc) => ({
  //           id: doc.id,
  //         }));
  //         console.log(chats);

  //         setUserChats(chats);
  //       });

  //       // No need to return unsubscribe here
  //       return unsubscribe;
  //     } catch (error) {
  //       console.error("Error fetching user chats:", error);
  //     }
  //   };

  //   fetchUserChats();

  //   // No need for the cleanup function as unsubscribe will be handled internally
  // }, []);

  useEffect(() => {
    if (!selectedChat) return;

    const messagesRef = collection(db, "chats", selectedChat, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        createdAt: doc.data().createdAt.toDate(),
        user: doc.data().user,
      }));
      setMessages(loadedMessages.reverse());
    });

    return () => unsubscribe();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: {
        _id: user?._id,
        name: "Admin",
      },
    };

    try {
      const messagesRef = collection(db, "chats", selectedChat, "messages");
      await addDoc(messagesRef, message);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!user?.isAdmin || !user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link
              className="flex items-center gap-2 font-semibold"
              to="/product"
            >
              <Package2Icon className="h-6 w-6" />
              <span className="">GSB Dashboard</span>
            </Link>
            <button
              className="ml-auto h-8 w-8"
              onClick={() => dispatch(logout())}
            >
              <span className="sr-only">Logout</span>
            </button>
          </div>
          <div className="flex-1 overflow-x-hidden py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
              {userChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedChat(chat._id);
                    setSelectedChatName(chat.name);
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-all ${
                    selectedChat === chat.id
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <IoChatbubbleOutline className="h-10 w-10" />
                  {chat.name}
                  {chat._id}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-4">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <div className="w-full flex-1">{selectedChatName}</div>
          <button
            onClick={() => {
              dispatch(logout());
              navigate("/");
            }}
          >
            Logout
          </button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          {selectedChat ? (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.user.name === "Admin"
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`p-2 rounded-md ${
                        message.user._id === user.uid
                          ? "bg-gray-200 dark:bg-gray-700"
                          : "bg-blue-200 dark:bg-blue-700"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs text-gray-500">
                        {message.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex gap-5">
                <input
                  className="w-full p-2 border border-gray-300 rounded-md"
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <button
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function Package2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}
