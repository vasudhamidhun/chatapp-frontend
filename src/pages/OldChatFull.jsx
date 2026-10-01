// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import socket from "../socket";


//  const API_URL = import.meta.env.VITE_API_URL;
// function Chat() {
//   const { user, logout } = useAuth();

//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");

 
//   // Listen for new real-time messages
//   useEffect(() => {
//     const handleNewMessage = (newMessage) => {
//       if (!selectedUser) return;

//       const isCurrentChat =
//         (newMessage.sender === selectedUser._id &&
//           newMessage.receiver === user.id) ||
//         (newMessage.sender === user.id &&
//           newMessage.receiver === selectedUser._id);

//       if (isCurrentChat) {
//         setMessages((prev) => [...prev, newMessage]);
//       }
//     };

//     socket.on("new_message", handleNewMessage);

//     return () => {
//       socket.off("new_message", handleNewMessage);
//       //Because selectedUser changed, React runs the effect again.
//       // Before registering the new listener, React performs the 
//       // previous cleanup:
//     };
//   }, [selectedUser, user]);

//   // Fetch users
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/users`
//         );

//         const otherUsers = response.data.filter(
//           (item) => item._id !== user.id
//         );

//         setUsers(otherUsers);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };

//     if (user) {
//       fetchUsers();
//     }
//   }, [user]);

//   // Fetch conversation
//   useEffect(() => {
//     if (!selectedUser || !user) return;

//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get(
//           `${API_URL}/api/messages/${selectedUser._id}?currentUserId=${user.id}`
//         );

//         setMessages(response.data);
//       } catch (error) {
//         console.error("Failed to fetch messages:", error);
//       }
//     };

//     fetchMessages();
//   }, [selectedUser, user]);

//   // Send message through Socket.IO
//   const sendMessage = () => {
//     if (!message.trim() || !selectedUser) return;

//     socket.emit("send_message", {
//       receiver: selectedUser._id,
//       content: message.trim(),
//     });// this will move to socket.js--->backend server.js

//     setMessage("");
//   };

//   return (

// <div className="flex h-screen w-full overflow-hidden bg-[#d1d7db]">

//   {/* =====================================================
//       LEFT SIDEBAR
//   ====================================================== */}
//   <aside className="flex w-[380px] shrink-0 flex-col border-r border-[#d1d7db] bg-white">

//     {/* ================= HEADER ================= */}
//     <div className="flex h-[64px] shrink-0 items-center justify-between bg-[#f0f2f5] px-4">

//       <div className="flex items-center gap-3">

//         {/* Profile */}
//         <div className="flex h-10 w-10 items-center justify-center rounded-full
//                         bg-gradient-to-br from-[#00a884] to-[#008f72]
//                         text-sm font-semibold text-white shadow-sm">
//           {user?.name?.charAt(0).toUpperCase()}
//         </div>

//         <div className="min-w-0">
//           <p className="truncate text-[15px] font-semibold text-[#111b21]">
//             {user?.name}
//           </p>

//           <p className="text-[11px] text-[#667781]">
//             Online
//           </p>
//         </div>

//       </div>

//       {/* Header Actions */}
//       <div className="flex items-center gap-1">

//         <button
//           className="flex h-9 w-9 items-center justify-center rounded-full
//                      text-[#54656f] transition hover:bg-[#dfe5e7]"
//           title="New chat"
//         >
//           ✎
//         </button>

//         <button
//           onClick={logout}
//           className="flex h-9 w-9 items-center justify-center rounded-full
//                      text-[#54656f] transition hover:bg-[#dfe5e7]"
//           title="Logout"
//         >
//           ↪
//         </button>

//       </div>

//     </div>


//     {/* ================= SEARCH ================= */}
//     <div className="border-b border-[#f0f2f5] bg-white px-3 py-2">

//       <div className="flex h-[40px] items-center rounded-lg bg-[#f0f2f5] px-3
//                       transition focus-within:ring-1 focus-within:ring-[#00a884]">

//         <span className="mr-3 text-[15px] text-[#54656f]">
//           🔍
//         </span>

//         <input
//           type="text"
//           placeholder="Search or start new chat"
//           className="w-full bg-transparent text-[13px] text-[#111b21]
//                      outline-none placeholder:text-[#667781]"
//         />

//       </div>

//     </div>


//     {/* ================= CHAT LIST ================= */}
//     <div className="flex-1 overflow-y-auto">

//       {users.map((item) => {

//         const isSelected =
//           selectedUser?._id === item._id;

//         return (
//           <button
//             key={item._id}
//             onClick={() => setSelectedUser(item)}
//             className={`group flex w-full items-center gap-3 px-4 py-3
//                         text-left transition
//               ${
//                 isSelected
//                   ? "bg-[#f0f2f5]"
//                   : "bg-white hover:bg-[#f5f6f6]"
//               }`}
//           >

//             {/* Avatar */}
//             <div className="relative flex h-[50px] w-[50px] shrink-0
//                             items-center justify-center rounded-full
//                             bg-gradient-to-br from-[#d9fdd3] to-[#b7ebc6]
//                             text-[16px] font-semibold text-[#008069]">

//               {item.name?.charAt(0).toUpperCase()}

//               {/* Online indicator */}
//               <span className="absolute bottom-0 right-0
//                                h-[13px] w-[13px]
//                                rounded-full border-[2px] border-white
//                                bg-[#25d366]" />

//             </div>


//             {/* User Information */}
//             <div className="min-w-0 flex-1 border-b border-[#f0f2f5] py-1">

//               <div className="flex items-center justify-between">

//                 <p className="truncate text-[15px] font-medium text-[#111b21]">
//                   {item.name}
//                 </p>

//                 <span className="ml-2 text-[10px] text-[#667781]">
//                   {isSelected ? "Online" : ""}
//                 </span>

//               </div>

//               <div className="mt-1 flex items-center justify-between">

//                 <p className="truncate pr-3 text-[12px] text-[#667781]">
//                   {item.email}
//                 </p>

//               </div>

//             </div>

//           </button>
//         );
//       })}

//     </div>


//     {/* ================= CURRENT USER ================= */}
//     <div className="flex shrink-0 items-center gap-3
//                     border-t border-[#d1d7db]
//                     bg-[#f0f2f5] px-4 py-3">

//       <div className="flex h-9 w-9 items-center justify-center rounded-full
//                       bg-gradient-to-br from-[#00a884] to-[#008f72]
//                       text-xs font-semibold text-white">

//         {user?.name?.charAt(0).toUpperCase()}

//       </div>

//       <div className="min-w-0">

//         <p className="truncate text-sm font-semibold text-[#111b21]">
//           {user?.name}
//         </p>

//         <p className="text-[11px] text-[#667781]">
//           Your account
//         </p>

//       </div>

//     </div>

//   </aside>


//   {/* =====================================================
//       RIGHT CHAT AREA
//   ====================================================== */}
//   <main className="flex min-w-0 flex-1 flex-col">

//     {selectedUser ? (
//       <>

//         {/* =================================================
//             CHAT HEADER
//         ================================================== */}
//         <header className="flex h-[64px] shrink-0 items-center
//                            border-b border-[#d1d7db]
//                            bg-[#f0f2f5] px-4">

//           {/* Avatar */}
//           <div className="relative flex h-10 w-10 shrink-0
//                           items-center justify-center rounded-full
//                           bg-gradient-to-br from-[#d9fdd3] to-[#b7ebc6]
//                           text-sm font-semibold text-[#008069]">

//             {selectedUser.name?.charAt(0).toUpperCase()}

//             <span className="absolute bottom-0 right-0
//                              h-3 w-3 rounded-full
//                              border-2 border-[#f0f2f5]
//                              bg-[#25d366]" />

//           </div>


//           {/* User Details */}
//           <div className="ml-3 min-w-0 flex-1">

//             <p className="truncate text-[15px] font-semibold text-[#111b21]">
//               {selectedUser.name}
//             </p>

//             <p className="truncate text-[11px] text-[#667781]">
//               online
//             </p>

//           </div>


//           {/* Header Actions */}
//           <div className="flex items-center gap-1">

//             <button
//               className="flex h-9 w-9 items-center justify-center
//                          rounded-full text-[#54656f]
//                          transition hover:bg-[#dfe5e7]"
//               title="Search"
//             >
//               🔍
//             </button>

//             <button
//               className="flex h-9 w-9 items-center justify-center
//                          rounded-full text-[#54656f]
//                          transition hover:bg-[#dfe5e7]"
//               title="More"
//             >
//               ⋮
//             </button>

//           </div>

//         </header>


//         {/* =================================================
//             CHAT MESSAGES
//         ================================================== */}
//         <section
//           className="relative flex-1 overflow-y-auto px-[6%] py-6"
//           style={{
//             backgroundColor: "#efeae2",
//             backgroundImage: `
//               radial-gradient(
//                 rgba(84, 101, 111, 0.10) 1px,
//                 transparent 1px
//               )
//             `,
//             backgroundSize: "22px 22px",
//           }}
//         >

//           {/* Subtle overlay */}
//           <div className="pointer-events-none absolute inset-0
//                           bg-white/[0.03]" />

//           {messages.length === 0 ? (

//             <div className="relative flex h-full items-center justify-center">

//               <div className="max-w-sm text-center">

//                 <div className="mx-auto mb-5 flex h-[72px] w-[72px]
//                                 items-center justify-center rounded-full
//                                 bg-[#d9d3ca] text-3xl shadow-sm">
//                   💬
//                 </div>

//                 <h3 className="text-[18px] font-medium text-[#41525d]">
//                   No messages yet
//                 </h3>

//                 <p className="mt-2 text-[13px] leading-5 text-[#667781]">
//                   Start a conversation with{" "}
//                   <span className="font-medium text-[#41525d]">
//                     {selectedUser.name}
//                   </span>
//                 </p>

//               </div>

//             </div>

//           ) : (

//             <div className="relative mx-auto flex max-w-5xl flex-col gap-[3px]">

//               {messages.map((msg) => {

//                 const isSent =
//                   msg.sender.toString() === user.id.toString();

//                 return (
//                   <div
//                     key={msg._id}
//                     className={`flex w-full py-[2px]
//                       ${
//                         isSent
//                           ? "justify-end"
//                           : "justify-start"
//                       }`}
//                   >

//                     <div
//                       className={`relative max-w-[70%] px-3 py-[7px] shadow-sm
//                         ${
//                           isSent
//                             ? "rounded-lg rounded-tr-none bg-[#d9fdd3]"
//                             : "rounded-lg rounded-tl-none bg-white"
//                         }`}
//                     >

//                       {/* Message */}
//                       <div className="flex items-end gap-2">

//                         <p className="min-w-0 break-words whitespace-pre-wrap
//                                       text-[13.5px] leading-[19px]
//                                       text-[#111b21]">
//                           {msg.content}
//                         </p>


//                         {/* Time + Status */}
//                         <div className="flex shrink-0 items-center gap-1
//                                         self-end pb-[1px]">

//                           <span className="text-[9px] text-[#667781]">
//                             {new Date(msg.createdAt).toLocaleTimeString(
//                               [],
//                               {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               }
//                             )}
//                           </span>

//                           {isSent && (
//                             <span className="text-[11px] font-medium text-[#53bdeb]">
//                               ✓✓
//                             </span>
//                           )}

//                         </div>

//                       </div>

//                     </div>

//                   </div>
//                 );
//               })}

//             </div>

//           )}

//         </section>


//         {/* =================================================
//             MESSAGE COMPOSER
//         ================================================== */}
//         <div className="flex min-h-[64px] shrink-0 items-center gap-2
//                         border-t border-[#d1d7db]
//                         bg-[#f0f2f5] px-3 py-2">

//           {/* Emoji */}
//           <button
//             className="flex h-10 w-10 shrink-0 items-center justify-center
//                        rounded-full text-[21px] text-[#54656f]
//                        transition hover:bg-[#dfe5e7]"
//             title="Emoji"
//           >
//             🙂
//           </button>


//           {/* Attachment */}
//           <button
//             className="flex h-10 w-10 shrink-0 items-center justify-center
//                        rounded-full text-[19px] text-[#54656f]
//                        transition hover:bg-[#dfe5e7]"
//             title="Attach"
//           >
//            📞
//           </button>


//           {/* Input */}
//           <div className="flex min-w-0 flex-1 items-center
//                           rounded-lg bg-white px-4
//                           shadow-sm">

//             <input
//               type="text"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   sendMessage();
//                 }
//               }}
//               placeholder="Type a message"
//               className="h-11 w-full bg-transparent
//                          text-[13px] text-[#111b21]
//                          outline-none
//                          placeholder:text-[#8696a0]"
//             />

//           </div>


//           {/* Send */}
//           <button
//             onClick={sendMessage}
//             disabled={!message.trim()}
//             className={`flex h-10 w-10 shrink-0 items-center
//                         justify-center rounded-full
//                         transition-all duration-200
//               ${
//                 message.trim()
//                   ? "bg-[#00a884] text-white shadow-sm hover:bg-[#008f72] hover:scale-105"
//                   : "bg-transparent text-[#8696a0]"
//               }`}
//             title="Send"
//           >
//             ➤
//           </button>

//         </div>

//       </>

//     ) : (

//       /* =================================================
//           EMPTY CHAT STATE
//       ================================================== */

//       <div className="relative flex flex-1 flex-col items-center
//                       justify-center border-b-[6px] border-[#25d366]
//                       bg-[#f0f2f5] text-center">

//         {/* Background decoration */}
//         <div className="absolute inset-0 opacity-30"
//              style={{
//                backgroundImage:
//                  "radial-gradient(#d8d1c7 1px, transparent 1px)",
//                backgroundSize: "22px 22px",
//              }}
//         />

//         <div className="relative">

//           <div className="mx-auto mb-6 flex h-[100px] w-[100px]
//                           items-center justify-center rounded-full
//                           bg-[#d9d3ca] text-4xl shadow-sm">
//             💬
//           </div>

//           <h1 className="text-[30px] font-light tracking-tight text-[#41525d]">
//             ChatApp
//           </h1>

//           <p className="mt-3 max-w-md text-[13px] leading-6 text-[#667781]">
//             Send and receive messages in real time.
//             <br />
//             Select a conversation from the left to start chatting.
//           </p>

//           <div className="mx-auto mt-6 flex w-fit items-center gap-2
//                           rounded-full bg-white px-4 py-2
//                           text-[11px] text-[#667781] shadow-sm">

//             <span className="text-[#00a884]">🔒</span>

//             Your messages are private and secure

//           </div>

//         </div>

//       </div>

//     )}

//   </main>

// </div>


//   );
// }

// export default Chat;