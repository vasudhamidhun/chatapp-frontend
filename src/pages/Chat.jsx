
import { useEffect, useState, useRef } from "react";
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

  // =========================
  // WebRTC refs
  // =========================

  const peerConnectionRef = useRef(null);

  const localStreamRef = useRef(null);

  const remoteAudioRef = useRef(null);

  const pendingIceCandidatesRef = useRef([]);

  // Store caller's user ID after accepting
  const remoteUserIdRef = useRef(null);

  // =========================
  // Call state
  // =========================

  const [incomingCall, setIncomingCall] = useState(null);

  const [callStatus, setCallStatus] = useState("idle");

  /*
    idle
    incoming
    connecting
    connected
  */

  // =========================================================
  // CLEANUP CALL
  // =========================================================

  const cleanupCall = () => {
    console.log("🧹 Cleaning up call");

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;

      console.log("🔌 Peer connection closed");
    }

    // Stop local microphone
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      localStreamRef.current = null;

      console.log("🎤 Local microphone stopped");
    }

    // Remove remote audio
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;

      console.log("🔇 Remote audio cleared");
    }

    // Clear pending ICE
    pendingIceCandidatesRef.current = [];

    // Clear caller ID
    remoteUserIdRef.current = null;

    // Reset state
    setIncomingCall(null);
    setCallStatus("idle");

    console.log("✅ Call cleanup completed");
  };

  // =========================================================
  // RECEIVE INCOMING CALL
  // =========================================================

  useEffect(() => {
    const handleIncomingCall = (data) => {
      console.log("📞 Incoming call received:", data);

      // Store call information
      setIncomingCall(data);

      // Show incoming call UI
      setCallStatus("incoming");
    };

    socket.on("incoming-call", handleIncomingCall);

    console.log("🌐 Incoming-call listener registered");

    return () => {
      socket.off("incoming-call", handleIncomingCall);
    };
  }, []);

  // =========================================================
  // RECEIVE ICE CANDIDATES
  // =========================================================

  useEffect(() => {
    const handleIceCandidate = async ({ candidate }) => {
      try {
        console.log("🧊 Receiver got ICE candidate:", candidate);

        const peerConnection = peerConnectionRef.current;

        // If peer connection isn't ready yet,
        // store the candidate
        if (!peerConnection) {
          console.log(
            "⏳ Peer connection not ready. Storing ICE candidate."
          );

          pendingIceCandidatesRef.current.push(candidate);

          return;
        }

        // If remote description is not set yet,
        // store the candidate
        if (!peerConnection.remoteDescription) {
          console.log(
            "⏳ Remote description not ready. Storing ICE candidate."
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

  // =========================================================
  // ACCEPT CALL
  // =========================================================

  const acceptCall = async () => {
    try {
      if (!incomingCall) {
        console.log("⚠️ No incoming call");
        return;
      }

      console.log("✅ Call accepted");

      setCallStatus("connecting");

      // Store caller's user ID
      remoteUserIdRef.current = incomingCall.from;

      // =====================================================
      // Get microphone
      // =====================================================

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      localStreamRef.current = stream;

      console.log("🎤 Receiver microphone access granted");

      // =====================================================
      // Create peer connection
      // =====================================================

      // const peerConnection = new RTCPeerConnection();

      // for stun implementation
      const peerConnection = new RTCPeerConnection({
                iceServers: [
                  {
                    urls: "stun:stun.l.google.com:19302",
                  },
                ],
              });

      peerConnectionRef.current = peerConnection;

      console.log("🔗 Receiver peer connection created");

      // =====================================================
      // ICE candidate handler
      // =====================================================

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(
            "🧊 Receiver ICE candidate generated:",
            event.candidate
          );

          socket.emit("ice-candidate", {
            to: incomingCall.from,
            candidate: event.candidate,
          });
        }
      };

      // =====================================================
      // Remote audio
      // =====================================================

      peerConnection.ontrack = (event) => {
        console.log("🎧 Remote audio track received");

        const remoteStream = event.streams[0];

        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStream;
        }
      };

      // =====================================================
      // Connection state
      // =====================================================

      peerConnection.onconnectionstatechange = () => {
        console.log(
          "🔗 Receiver WebRTC connection state:",
          peerConnection.connectionState
        );

        if (peerConnection.connectionState === "connected") {
          console.log("📞 Receiver connected");

          setCallStatus("connected");
        }

        if (
          peerConnection.connectionState === "failed" ||
          peerConnection.connectionState === "closed"
        ) {
          cleanupCall();
        }
      };

      // =====================================================
      // Add microphone track
      // =====================================================

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      console.log("🎵 Receiver audio track added");

      // =====================================================
      // Set remote offer
      // =====================================================

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(incomingCall.offer)
      );

      console.log("✅ Remote offer set");

      // =====================================================
      // Add pending ICE candidates
      // =====================================================

      for (const candidate of pendingIceCandidatesRef.current) {
        try {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(candidate)
          );

          console.log("✅ Pending ICE candidate added");
        } catch (error) {
          console.error(
            "❌ Error adding pending ICE candidate:",
            error
          );
        }
      }

      pendingIceCandidatesRef.current = [];

      // =====================================================
      // Create answer
      // =====================================================

      const answer = await peerConnection.createAnswer();

      console.log("📄 Answer created");

      // =====================================================
      // Set local description
      // =====================================================

      await peerConnection.setLocalDescription(answer);

      console.log("✅ Local answer set");

      // =====================================================
      // Send answer to caller
      // =====================================================

      socket.emit("answer-call", {
        to: incomingCall.from,
        answer,
      });

      console.log("📤 Answer sent to caller");

      // Remove popup
      setIncomingCall(null);
    } catch (error) {
      console.error("❌ Error accepting call:", error);

      cleanupCall();
    }
  };

  // =========================================================
  // REJECT CALL
  // =========================================================

  const rejectCall = () => {
    if (!incomingCall) return;

    console.log("❌ Call rejected");

    socket.emit("reject-call", {
      to: incomingCall.from,
    });

    cleanupCall();
  };

  // =========================================================
  // END CALL
  // =========================================================

  const endCall = () => {
    const remoteUserId = remoteUserIdRef.current;

    if (!remoteUserId) {
      console.log("⚠️ Remote user not found");
      cleanupCall();
      return;
    }

    console.log("📴 Receiver ending call");

    socket.emit("end-call", {
      to: remoteUserId,
    });

    cleanupCall();
  };

  // =========================================================
  // LISTEN WHEN OTHER USER ENDS CALL
  // =========================================================

  useEffect(() => {
    const handleCallEnded = () => {
      console.log("📴 Other user ended the call");

      cleanupCall();
    };

    socket.on("call-ended", handleCallEnded);

    return () => {
      socket.off("call-ended", handleCallEnded);
    };
  }, []);

  // =========================================================
  // REAL-TIME MESSAGES
  // =========================================================

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

  // =========================================================
  // FETCH USERS
  // =========================================================

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

  // =========================================================
  // FETCH CONVERSATION
  // =========================================================

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

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const sendMessage = () => {
    if (!message.trim() || !selectedUser) return;

    socket.emit("send_message", {
      receiver: selectedUser._id,
      content: message.trim(),
    });

    setMessage("");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div>
      {/* =========================================
          REMOTE AUDIO
      ========================================= */}

      <audio
        ref={remoteAudioRef}
        autoPlay
      />

      {/* =========================================
          INCOMING CALL POPUP
      ========================================= */}

      {incomingCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mb-4 text-4xl">
              📞
            </div>

            <h2 className="text-xl font-semibold">
              Incoming Call
            </h2>

            <p className="mt-2 text-gray-500">
              Someone is calling you...
            </p>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={rejectCall}
                className="rounded-full bg-red-500 px-6 py-3 text-white transition hover:bg-red-600"
              >
                Reject
              </button>

              <button
                onClick={acceptCall}
                className="rounded-full bg-green-500 px-6 py-3 text-white transition hover:bg-green-600"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          CONNECTED CALL UI
      ========================================= */}

      {callStatus === "connected" && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <button
            onClick={endCall}
            className="rounded-full bg-red-500 px-6 py-3 font-medium text-white shadow-lg transition hover:bg-red-600"
          >
            End Call
          </button>
        </div>
      )}

      {/* =========================================
          CHAT PAGE
      ========================================= */}

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