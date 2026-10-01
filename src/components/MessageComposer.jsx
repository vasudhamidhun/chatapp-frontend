// const MessageComposer = ({
//   message,
//   setMessage,
//   sendMessage,
// }) => {
//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   return (
//     <div
//       className="
//         flex min-h-[64px] shrink-0 items-center
//         gap-2 border-t border-[#d1d7db]
//         bg-[#f0f2f5] px-3 py-2
//       "
//     >

//       {/* Emoji */}
//       <button
//         className="
//           flex h-10 w-10 shrink-0
//           items-center justify-center
//           rounded-full text-[21px]
//           text-[#54656f]
//           transition hover:bg-[#dfe5e7]
//         "
//         title="Emoji"
//       >
//         🙂
//       </button>

//       {/* Attachment / Call */}
//       <button
//         className="
//           flex h-10 w-10 shrink-0
//           items-center justify-center
//           rounded-full text-[19px]
//           text-[#54656f]
//           transition hover:bg-[#dfe5e7]
//         "
//         title="Attach"
//       >
//         📞
//       </button>

//       {/* Input */}
//       <div
//         className="
//           flex min-w-0 flex-1
//           items-center rounded-lg
//           bg-white px-4 shadow-sm
//         "
//       >

//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Type a message"
//           className="
//             h-11 w-full
//             bg-transparent
//             text-[13px] text-[#111b21]
//             outline-none
//             placeholder:text-[#8696a0]
//           "
//         />

//       </div>

//       {/* Send */}
//       <button
//         onClick={sendMessage}
//         disabled={!message.trim()}
//         className={`
//           flex h-10 w-10 shrink-0
//           items-center justify-center
//           rounded-full transition-all duration-200

//           ${
//             message.trim()
//               ? "bg-[#00a884] text-white shadow-sm hover:scale-105 hover:bg-[#008f72]"
//               : "bg-transparent text-[#8696a0]"
//           }
//         `}
//         title="Send"
//       >
//         ➤
//       </button>

//     </div>
//   );
// };

// export default MessageComposer;



import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const MessageComposer = ({
  message,
  setMessage,
  sendMessage,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div
      className="
        relative flex min-h-[64px] shrink-0 items-center
        gap-2 border-t border-[#d1d7db]
        bg-[#f0f2f5] px-3 py-2
      "
    >

      {/* Emoji */}
      <div className="relative shrink-0">

        <button
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full text-[21px]
            text-[#54656f]
            transition hover:bg-[#dfe5e7]
          "
          title="Emoji"
        >
          🙂
        </button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div
            className="
              absolute bottom-12 left-0 z-50
            "
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width={320}
              height={400}
              searchDisabled={false}
              previewConfig={{
                showPreview: false,
              }}
            />
          </div>
        )}

      </div>

      {/* Attachment / Call */}
      <button
        className="
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-full text-[19px]
          text-[#54656f]
          transition hover:bg-[#dfe5e7]
        "
        title="Attach"
      >
        📞
      </button>

      {/* Input */}
      <div
        className="
          flex min-w-0 flex-1
          items-center rounded-lg
          bg-white px-4 shadow-sm
        "
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="
            h-11 w-full
            bg-transparent
            text-[13px] text-[#111b21]
            outline-none
            placeholder:text-[#8696a0]
          "
        />
      </div>

      {/* Send */}
      <button
        onClick={sendMessage}
        disabled={!message.trim()}
        className={`
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-full transition-all duration-200

          ${
            message.trim()
              ? "bg-[#00a884] text-white shadow-sm hover:scale-105 hover:bg-[#008f72]"
              : "bg-transparent text-[#8696a0]"
          }
        `}
        title="Send"
      >
        ➤
      </button>

    </div>
  );
};

export default MessageComposer;

