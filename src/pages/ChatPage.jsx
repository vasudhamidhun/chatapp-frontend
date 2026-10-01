// import ChatSidebar from ".././components/ChatSidebar";
// import ChatWindow from ".././components/ChatWindow";

// const ChatPage = ({
//   user,
//   users,
//   selectedUser,
//   setSelectedUser,
//   messages,
//   message,
//   setMessage,
//   sendMessage,
//   logout,
// }) => {

//     console.log("chatsidebar:",users)
//   return (
//     <div className="flex h-screen w-full overflow-hidden bg-[#d1d7db]">

//       <ChatSidebar
//         user={user}
//         users={users}
//         selectedUser={selectedUser}
//         setSelectedUser={setSelectedUser}
//         logout={logout}
//       />

//       <ChatWindow
//         user={user}
//         selectedUser={selectedUser}
//         messages={messages}
//         message={message}
//         setMessage={setMessage}
//         sendMessage={sendMessage}
//       />

//     </div>
//   );
// };

// export default ChatPage;






import ChatSidebar from ".././components/ChatSidebar";
import ChatWindow from ".././components/ChatWindow";

const ChatPage = ({
  user,
  users,
  selectedUser,
  setSelectedUser,
  messages,
  message,
  setMessage,
  sendMessage,
  logout,
}) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#d1d7db]">

      <ChatSidebar
        user={user}
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        logout={logout}
      />

      <ChatWindow
        user={user}
        selectedUser={selectedUser}
        messages={messages}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />

    </div>
  );
};

export default ChatPage;