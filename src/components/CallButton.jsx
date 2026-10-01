




import { useEffect, useRef, useState } from "react";
import socket from "../socket";

export default function CallButton({ selectedUser }) {
  // =========================================================
  // WebRTC refs
  // =========================================================

  const localStreamRef = useRef(null);

  const peerConnectionRef = useRef(null);

  // ICE candidates received before remote description
  const pendingIceCandidatesRef = useRef([]);

  // =========================================================
  // Call state
  // =========================================================

  const [callStatus, setCallStatus] = useState("idle");

  /*
    idle
    calling
    connecting
    connected
  */

  console.log("📞 CallButton rendered", selectedUser);

  // =========================================================
  // CLEANUP CALL
  // =========================================================

  const cleanupCall = () => {
    console.log("🧹 Cleaning up caller call");

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();

      peerConnectionRef.current = null;

      console.log("🔌 Caller peer connection closed");
    }

    // Stop microphone
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      localStreamRef.current = null;

      console.log("🎤 Caller microphone stopped");
    }

    // Clear pending ICE
    pendingIceCandidatesRef.current = [];

    // Reset call status
    setCallStatus("idle");

    console.log("✅ Caller cleanup completed");
  };

  // =========================================================
  // CALLER RECEIVES ANSWER
  // =========================================================

  useEffect(() => {
    const handleCallAnswered = async ({ answer }) => {
      try {
        console.log("📞 Call answered:", answer);

        const peerConnection = peerConnectionRef.current;

        if (!peerConnection) {
          console.error("❌ Peer connection not found");
          return;
        }

        // Prevent duplicate answer
        if (
          peerConnection.signalingState !==
          "have-local-offer"
        ) {
          console.log(
            "⚠️ Ignoring duplicate/late answer. Current state:",
            peerConnection.signalingState
          );

          return;
        }

        await peerConnection.setRemoteDescription(
          new RTCSessionDescription(answer)
        );

        console.log("✅ Remote answer set");

        // =====================================================
        // Add ICE candidates that arrived before answer
        // =====================================================

        for (const candidate of pendingIceCandidatesRef.current) {
          try {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(candidate)
            );

            console.log("✅ Pending caller ICE candidate added");
          } catch (error) {
            console.error(
              "❌ Error adding pending caller ICE:",
              error
            );
          }
        }

        pendingIceCandidatesRef.current = [];

        setCallStatus("connecting");
      } catch (error) {
        console.error(
          "❌ Error setting remote answer:",
          error
        );
      }
    };

    socket.on("call-answered", handleCallAnswered);

    return () => {
      socket.off("call-answered", handleCallAnswered);
    };
  }, []);

  // =========================================================
  // CALLER RECEIVES ICE CANDIDATE
  // =========================================================

  useEffect(() => {
    const handleIceCandidate = async ({ candidate }) => {
      try {
        console.log(
          "🧊 Caller received ICE candidate:",
          candidate
        );

        const peerConnection =
          peerConnectionRef.current;

        if (!peerConnection) {
          console.log(
            "⏳ Caller peer connection not ready. Storing ICE."
          );

          pendingIceCandidatesRef.current.push(candidate);

          return;
        }

        // Remote answer hasn't arrived yet
        if (!peerConnection.remoteDescription) {
          console.log(
            "⏳ Caller remote description not ready. Storing ICE."
          );

          pendingIceCandidatesRef.current.push(candidate);

          return;
        }

        await peerConnection.addIceCandidate(
          new RTCIceCandidate(candidate)
        );

        console.log("✅ Caller ICE candidate added");
      } catch (error) {
        console.error(
          "❌ Error adding caller ICE candidate:",
          error
        );
      }
    };

    socket.on("ice-candidate", handleIceCandidate);

    return () => {
      socket.off("ice-candidate", handleIceCandidate);
    };
  }, []);

  // =========================================================
  // START CALL
  // =========================================================

  const handleCall = async () => {
    try {
      if (!selectedUser) {
        console.log("⚠️ No user selected");
        return;
      }

      console.log(
        "📞 Starting call to:",
        selectedUser._id
      );

      setCallStatus("calling");

      // =====================================================
      // Get microphone
      // =====================================================

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

      localStreamRef.current = stream;

      console.log("🎤 Microphone access granted");

      // =====================================================
      // Create peer connection
      // =====================================================

      const peerConnection =
        new RTCPeerConnection();

      peerConnectionRef.current =
        peerConnection;

      console.log(
        "🔗 Caller peer connection created"
      );

      // =====================================================
      // Connection state
      // =====================================================

      peerConnection.onconnectionstatechange =
        () => {
          console.log(
            "🔗 Caller WebRTC connection state:",
            peerConnection.connectionState
          );

          if (
            peerConnection.connectionState ===
            "connected"
          ) {
            console.log("📞 Caller connected");

            setCallStatus("connected");
          }

          if (
            peerConnection.connectionState ===
              "failed" ||
            peerConnection.connectionState ===
              "closed"
          ) {
            cleanupCall();
          }
        };

      // =====================================================
      // ICE candidate
      // =====================================================

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(
            "🧊 ICE candidate generated:",
            event.candidate
          );

          socket.emit("ice-candidate", {
            to: selectedUser._id,
            candidate: event.candidate,
          });
        }
      };

      // =====================================================
      // Add microphone track
      // =====================================================

      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(
          track,
          stream
        );
      });

      console.log("🎵 Audio track added");

      // =====================================================
      // Create offer
      // =====================================================

      const offer =
        await peerConnection.createOffer();

      console.log(
        "📄 Offer created:",
        offer
      );

      // =====================================================
      // Set local description
      // =====================================================

      await peerConnection.setLocalDescription(
        offer
      );

      console.log(
        "✅ Local description set"
      );

      // =====================================================
      // Send call request
      // =====================================================

      socket.emit("call-user", {
        to: selectedUser._id,
        offer,
      });

      console.log(
        "📤 Call request sent to:",
        selectedUser._id
      );
    } catch (error) {
      console.error(
        "❌ Call error:",
        error
      );

      cleanupCall();
    }
  };

  // =========================================================
  // CALL REJECTED
  // =========================================================

  useEffect(() => {
    const handleCallRejected = () => {
      console.log(
        "❌ Call was rejected"
      );

      cleanupCall();
    };

    socket.on(
      "call-rejected",
      handleCallRejected
    );

    return () => {
      socket.off(
        "call-rejected",
        handleCallRejected
      );
    };
  }, []);

  // =========================================================
  // OTHER USER ENDS CALL
  // =========================================================

  useEffect(() => {
    const handleCallEnded = () => {
      console.log(
        "📴 Other user ended the call"
      );

      cleanupCall();
    };

    socket.on(
      "call-ended",
      handleCallEnded
    );

    return () => {
      socket.off(
        "call-ended",
        handleCallEnded
      );
    };
  }, []);

  // =========================================================
  // END CALL
  // =========================================================

  const endCall = () => {
    if (!selectedUser) {
      cleanupCall();
      return;
    }

    console.log("📴 Ending call");

    socket.emit("end-call", {
      to: selectedUser._id,
    });

    cleanupCall();
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <>
      {/* =========================================
          CALL BUTTON
      ========================================= */}

      {callStatus === "idle" && (
        <button
          onClick={handleCall}
          disabled={!selectedUser}
          className="
            flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-full text-[19px]
            text-[#54656f]
            transition hover:bg-[#dfe5e7]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          title="Voice call"
        >
          📞
        </button>
      )}

      {/* =========================================
          CALLING / CONNECTING
      ========================================= */}

      {(callStatus === "calling" ||
        callStatus === "connecting") && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {callStatus === "calling"
              ? "Calling..."
              : "Connecting..."}
          </span>

          <button
            onClick={endCall}
            className="
              rounded-full
              bg-red-500
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-red-600
            "
          >
            End Call
          </button>
        </div>
      )}

      {/* =========================================
          CONNECTED
      ========================================= */}

      {callStatus === "connected" && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-green-600">
            Connected
          </span>

          <button
            onClick={endCall}
            className="
              rounded-full
              bg-red-500
              px-5
              py-2
              text-sm
              font-medium
              text-white
              shadow
              transition
              hover:bg-red-600
            "
          >
            End Call
          </button>
        </div>
      )}
    </>
  );
}