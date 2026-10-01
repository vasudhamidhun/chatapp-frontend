
import { useEffect, useState,useRef } from "react";
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

  const peerConnectionRef = useRef(null);
  const pendingIceCandidatesRef = useRef([]);

  const remoteAudioRef = useRef(null);

  // for ICE candidate handling

// ICE candidate handling
useEffect(() => {
  const handleIceCandidate = async ({ candidate }) => {
    try {
      console.log("🧊 ICE candidate received:", candidate);

      const peerConnection = peerConnectionRef.current;

      if (!peerConnection) {
        console.log(
          "⏳ Peer connection not ready, storing ICE candidate"
        );

        pendingIceCandidatesRef.current.push(candidate);
        return;
      }

      await peerConnection.addIceCandidate(
        new RTCIceCandidate(candidate)
      );

      console.log("✅ ICE candidate added");
    } catch (error) {
      console.error("❌ Error adding ICE candidate:", error);
    }
  };

  socket.on("ice-candidate", handleIceCandidate);

  return () => {
    socket.off("ice-candidate", handleIceCandidate);
  };
}, []);

  //Listen For New real time incoing call
  useEffect(() => {
  const handleIncomingCall = async (data) => {
    try {
      console.log("📞 Incoming call received:", data);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      console.log("🎤 Receiver microphone access granted");

      
      const peerConnection = new RTCPeerConnection();

peerConnectionRef.current = peerConnection;

console.log("🔗 Receiver peer connection created");

//for audio track
peerConnection.ontrack = (event) => {
  console.log("🎧 Remote audio track received");

  const remoteStream = event.streams[0];

  if (remoteAudioRef.current) {
    remoteAudioRef.current.srcObject = remoteStream;
  }
};

peerConnection.onconnectionstatechange = () => {
  console.log(
    "🔗 Receiver WebRTC connection state:",
    peerConnection.connectionState
  );
};

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      console.log("🎵 Receiver audio track added");

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      console.log("✅ Remote offer set");

      for (const candidate of pendingIceCandidatesRef.current) {
  await peerConnection.addIceCandidate(
    new RTCIceCandidate(candidate)
  );

  console.log("✅ Pending ICE candidate added");
}

pendingIceCandidatesRef.current = [];

      const answer = await peerConnection.createAnswer();

      console.log("📄 Answer created:", answer);

      await peerConnection.setLocalDescription(answer);

      console.log("✅ Local answer set");

      socket.emit("answer-call", {
        to: data.from,
        answer: answer,
      });

      console.log("📤 Answer sent to caller");
    } catch (error) {
      console.error("❌ Incoming call error:", error);
    }
  };

  socket.on("incoming-call", handleIncomingCall);

  console.log("🌐 Incoming-call listener registered");

  return () => {
    socket.off("incoming-call", handleIncomingCall);
  };
}, []);

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

    <div>

<audio
  ref={remoteAudioRef}
  autoPlay
/>

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

    </div>
  );
}

export default Chat;