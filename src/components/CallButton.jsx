// import { useEffect } from "react";
// import socket from "../socket";


// export default function CallButton({ selectedUser }) {

//   useEffect(() => {
//   const handleIncomingCall = (data) => {
//     console.log("📞 Incoming call received:", data);
//   };

//   socket.on("incoming-call", handleIncomingCall);

//   return () => {
//     socket.off("incoming-call", handleIncomingCall);
//   };
// }, []);

//  const handleCall = async () => {
//     try {
//       // 1. Get microphone
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: false,
//       });

//       console.log("Microphone access granted");

//       // 2. Create WebRTC peer connection
//       const peerConnection = new RTCPeerConnection();

//       console.log("Peer connection created");

//       // 3. Add microphone tracks
//       stream.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, stream);
//       });

//       console.log("Audio track added");

//       // 4. Create WebRTC offer
//       const offer = await peerConnection.createOffer();

//       console.log("Offer created:", offer);

//       // 5. Set offer as local description
//       await peerConnection.setLocalDescription(offer);

//       console.log("Local description set");

//       // 6. Send offer through Socket.IO
//       socket.emit("call-user", {
//         to: selectedUser._id,
//         offer: offer,
//       });

//       console.log("Call request sent to:", selectedUser._id);
//     } catch (error) {
//       console.error("Call error:", error);
//     }
//   };


// return(

//      <button onClick={handleCall}
//         className="
//           flex h-10 w-10 shrink-0
//           items-center justify-center
//           rounded-full text-[19px]
//           text-[#54656f]
//           transition hover:bg-[#dfe5e7]
//         "
//         title="Voice call"
//       >
//         📞
//       </button>
// )

// }


// step 5-->B  emit a new even answer-call to the caller with the answer. 
// This will allow the caller to set the answer as their remote description and 
// establish the WebRTC connection.





// import { useEffect, useRef } from "react";
// import socket from "../socket";

// export default function CallButton({ selectedUser }) {
// console.log("📞 CallButton rendered", selectedUser);
//   const peerConnectionRef = useRef(null);

//   // useEffect(() => {
//   //   const handleCallAnswered = async ({ answer }) => {
//   //     try {
//   //       console.log("📞 Call answered:", answer);

//   //       const peerConnection = peerConnectionRef.current;

//   //       if (!peerConnection) {
//   //         console.error("Peer connection not found");
//   //         return;
//   //       }

//   //       await peerConnection.setRemoteDescription(
//   //         new RTCSessionDescription(answer)
//   //       );

//   //       console.log("✅ Remote answer set");
//   //     } catch (error) {
//   //       console.error("Error setting remote answer:", error);
//   //     }
//   //   };

//   //   socket.on("call-answered", handleCallAnswered);

//   //   return () => {
//   //     socket.off("call-answered", handleCallAnswered);
//   //   };
//   // }, []);

// // call listenr
//   useEffect(() => {
//   const handleCallAnswered = async ({ answer }) => {
//     try {
//       console.log("📞 Call answered:", answer);

//       const peerConnection = peerConnectionRef.current;

//       if (!peerConnection) {
//         console.error("Peer connection not found");
//         return;
//       }

//       await peerConnection.setRemoteDescription(
//         new RTCSessionDescription(answer)
//       );

//       console.log("✅ Remote answer set");
//     } catch (error) {
//       console.error("Error setting remote answer:", error);
//     }
//   };

//   socket.on("call-answered", handleCallAnswered);

//   return () => {
//     socket.off("call-answered", handleCallAnswered);
//   };
// }, []);




//   const handleCall = async () => {
//     try {
//       // 1. Get microphone
//       const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: false,
//       });

//       console.log("Microphone access granted");

//       // 2. Create WebRTC peer connection
//       const peerConnection = new RTCPeerConnection();

    
//       // 2.1 Store the peer connection in a ref for later use:So now the connection is stored in the component.
//       peerConnectionRef.current = peerConnection;

//       console.log("Peer connection created");

//       // 3. Add microphone tracks
//       stream.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, stream);
//       });

//       console.log("Audio track added");

//       // 4. Create WebRTC offer
//       const offer = await peerConnection.createOffer();

//       console.log("Offer created:", offer);

//       // 5. Set offer as local description
//       await peerConnection.setLocalDescription(offer);
      

//       console.log("Local description set");

//       // 6. Send offer through Socket.IO
//       socket.emit("call-user", {
//         to: selectedUser._id,
//         offer: offer,
//       });

//       console.log("Call request sent to:", selectedUser._id);
//     } catch (error) {
//       console.error("Call error:", error);
//     }
//   };

//   return (
//     <button
//       onClick={handleCall}
//       disabled={!selectedUser}
//       className="
//         flex h-10 w-10 shrink-0
//         items-center justify-center
//         rounded-full text-[19px]
//         text-[#54656f]
//         transition hover:bg-[#dfe5e7]
//         disabled:cursor-not-allowed disabled:opacity-50
//       "
//       title="Voice call"
//     >
//       📞
//     </button>
//   );
// }




// now socket connection works want audio we want to impmment WEBRTC


import { useEffect, useRef } from "react";
import socket from "../socket";

export default function CallButton({ selectedUser }) {
console.log("📞 CallButton rendered", selectedUser);
  const peerConnectionRef = useRef(null);




// call listenr
  useEffect(() => {
  const handleCallAnswered = async ({ answer }) => {
    try {
      console.log("📞 Call answered:", answer);

      const peerConnection = peerConnectionRef.current;

      if (!peerConnection) {
        console.error("Peer connection not found");
        return;
      }

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );

      console.log("✅ Remote answer set");
    } catch (error) {
      console.error("Error setting remote answer:", error);
    }
  };

  socket.on("call-answered", handleCallAnswered);

  return () => {
    socket.off("call-answered", handleCallAnswered);
  };
}, []);





const handleCall = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    console.log("Microphone access granted");

    const peerConnection = new RTCPeerConnection();
    peerConnectionRef.current = peerConnection;

    console.log("Peer connection created");
    peerConnection.onconnectionstatechange = () => {
  console.log(
    "🔗 Caller WebRTC connection state:",
    peerConnection.connectionState
  );
};

    // 🧊 ICE candidate handler
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("🧊 ICE candidate generated:", event.candidate);

        socket.emit("ice-candidate", {
          to: selectedUser._id,
          candidate: event.candidate,
        });
      }
    };

    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    console.log("Audio track added");

    const offer = await peerConnection.createOffer();

    console.log("Offer created:", offer);

    await peerConnection.setLocalDescription(offer);

    console.log("Local description set");

    socket.emit("call-user", {
      to: selectedUser._id,
      offer: offer,
    });

    console.log("Call request sent to:", selectedUser._id);

  } catch (error) {
    console.error("Call error:", error);
  }
};

  return (
    <button
      onClick={handleCall}
      disabled={!selectedUser}
      className="
        flex h-10 w-10 shrink-0
        items-center justify-center
        rounded-full text-[19px]
        text-[#54656f]
        transition hover:bg-[#dfe5e7]
        disabled:cursor-not-allowed disabled:opacity-50
      "
      title="Voice call"
    >
      📞
    </button>
  );
}