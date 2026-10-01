


export default function CallButton({ selectedUser }) {

const handleCall = async () => {
  try {
    // 1. Get microphone
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    console.log("Microphone access granted");
    console.log("Audio stream:", stream);

    // 2. Create WebRTC peer connection
    const peerConnection = new RTCPeerConnection();

    console.log("Peer connection created:", peerConnection);

    // 3. Add microphone tracks to WebRTC
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    }); //Take my microphone audio and make it available to this WebRTC connection.

    console.log("Audio track added to peer connection");
  } catch (error) {
    console.error("Call error:", error);
  }
};

return(

     <button onClick={handleCall}
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-full text-[19px]
          text-[#54656f]
          transition hover:bg-[#dfe5e7]
        "
        title="Voice call"
      >
        📞
      </button>
)

}