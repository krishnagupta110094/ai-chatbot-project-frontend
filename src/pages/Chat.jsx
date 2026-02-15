import React, { useEffect, useRef, useState } from "react";
import ProfileMenu from "../components/ProfileMenu";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addChat, setChats } from "../redux/slices/chatSlice";
import { io } from "socket.io-client";
import { addMessage, setMessages } from "../redux/slices/messageSlice";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const { chats } = useSelector((state) => state.chat);
  const { messages } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  // Add inside your Chat component

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  /*Socket Setup */
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  /** Scroll to bottom whenever messages change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChatId]);

  // Function to create new chat
  const handleCreateNewChat = async () => {
    try {
      const res = await axios.post(
        "https://ai-chatbot-backend-oqdi.onrender.com/api/chat",
        { title: newChatTitle },
        { withCredentials: true },
      );

      dispatch(addChat(res.data.chat));
      setActiveChatId(res.data.chat._id);
      setShowNewChatModal(false);
      setNewChatTitle("");
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  // Socket AI Response Listener
  useEffect(() => {
    const socket = io("https://ai-chatbot-backend-oqdi.onrender.com", { withCredentials: true });
    socketRef.current = socket;

    const handleAIResponse = ({ chat, content }) => {
      dispatch(
        addMessage({
          chatId: chat,
          message: { role: "model", content },
        }),
      );
    };

    socket.on("ai-response", handleAIResponse);

    return () => {
      socket.off("ai-response", handleAIResponse);
      socket.disconnect();
    };
  }, [dispatch]);

  /** get all chats */
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("https://ai-chatbot-backend-oqdi.onrender.com/api/chat", {
          withCredentials: true,
        });
        console.log("Fetched chats:", res?.data.chats);
        dispatch(setChats(res?.data.chats));
        // set active chat to top chat
        if (res?.data.chats.length > 0) {
          setActiveChatId(res.data.chats[res.data.chats.length - 1]._id);
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [dispatch]);

  /* ------------------ Fetch messages for active chat ------------------ */
  useEffect(() => {
    if (!activeChatId) return; // active chat na ho toh kuch mat karo

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://ai-chatbot-backend-oqdi.onrender.com/api/chat/${activeChatId}/messages`,
          { withCredentials: true },
        );
        console.log("Active chats messages: ", res?.data.chat.messages);

        // sirf active chat ke messages store karo
        dispatch(
          setMessages({
            chatId: activeChatId,
            messages: res.data.chat.messages,
          }),
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [activeChatId, dispatch]);

  /** Send user message */
  const handleSendMessage = () => {
    if (!input.trim() || !activeChatId) return;

    const userMessage = { role: "user", content: input };
    dispatch(addMessage({ chatId: activeChatId, message: userMessage }));

    socketRef.current.emit("ai-message", {
      chatId: activeChatId,
      content: input,
    });

    setInput("");
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 h-full w-72 bg-white 
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300`}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">🤖 RAGenius</h1>
          <button
            className="md:hidden text-gray-600"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* New Chat */}
        {/* <div className="p-4">
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
            + New Chat
          </button>
        </div> */}
        {/* New Chat */}
        <div className="p-4">
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => setShowNewChatModal(true)}
          >
            + New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {/* reverse chats to show latest on top */}
          {chats.length > 0 &&
            [...chats]?.reverse().map((chat) => {
              return (
                <div
                  key={chat._id}
                  onClick={() => setActiveChatId(chat._id)}
                  className={`px-3 py-2 rounded-lg cursor-pointer transition
          ${
            activeChatId === chat._id
              ? "bg-blue-50 border border-blue-500"
              : "hover:bg-gray-100"
          }
        `}
                >
                  <p
                    className={`text-sm truncate ${
                      activeChatId === chat._id
                        ? "text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {chat.title || "Untitled Chat"}
                  </p>
                </div>
              );
            })}
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="h-15 bg-white border-b border-gray-200 px-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            <button className="md:hidden text-xl" onClick={() => setOpen(true)}>
              ☰{" "}
              <span className="text-xl font-bold text-blue-600">
                🤖 RAGenius
              </span>
            </button>
            <h2 className="font-semibold text-gray-800"></h2>
          </div>

          {/* <span className="text-sm text-gray-600">Profile</span> */}
          <ProfileMenu />
        </nav>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {activeChatId &&
            messages[activeChatId]?.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">
                    🤖
                  </div>
                )}
                <div
                  className={`${msg.role === "user" ? "bg-blue-600 text-white" : "bg-white border border-gray-200"} rounded-xl px-4 py-3 max-w-xl shadow-sm`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-sm">
                    👤
                  </div>
                )}
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input for chat */}

        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              disabled={!input.trim()}
              onClick={handleSendMessage}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition"
            >
              <svg
                className="w-7 h-7 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 4v16" />
                <path d="M5 11l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowNewChatModal(false)}
          />
          <div className="bg-white rounded-xl p-6 w-96 z-50 shadow-lg relative">
            <h2 className="text-lg font-semibold mb-4">Create New Chat</h2>
            <input
              type="text"
              placeholder="Enter chat title..."
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => {
                  setShowNewChatModal(false);
                  setNewChatTitle("");
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleCreateNewChat}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
