
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";
import ChatPage from "./ChatPage";

const API_URL = import.meta.env.VITE_API_URL;

function Chat() {
  const { user, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  // Listen for new real-time messages
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      if (!selectedUser) return;

      const isCurrentChat =
        (newMessage.sender === selectedUser._id &&
          newMessage.receiver === user.id) ||
        (newMessage.sender === user.id &&
          newMessage.receiver === selectedUser._id);

      if (isCurrentChat) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [selectedUser, user]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/users`
        );

        const otherUsers = response.data.filter(
          (item) => item._id !== user.id
        );

        setUsers(otherUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  // Fetch conversation
  useEffect(() => {
    if (!selectedUser || !user) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/messages/${selectedUser._id}?currentUserId=${user.id}`
        );

        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, user]);

  // Send message
  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socket.emit("send_message", {
      receiver: selectedUser._id,
      content: message.trim(),
    });

    setMessage("");
  };

  return (
    <ChatPage
      user={user}
      users={users}
      selectedUser={selectedUser}
      setSelectedUser={setSelectedUser}
      messages={messages}
      message={message}
      setMessage={setMessage}
      sendMessage={sendMessage}
      logout={logout}
    />
  );
}

export default Chat;