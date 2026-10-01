
import MessageList from "./MessageList";
import ChatHeader from "./ChatHeader";
import MessageComposer from "./MessageComposer";
import EmptyChat from "./EmptyChat";

const ChatWindow = ({
  user,
  selectedUser,
  messages,
  message,
  setMessage,
  sendMessage,
}) => {
  if (!selectedUser) {
    return <EmptyChat />;
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col">

      <ChatHeader selectedUser={selectedUser} />

      <MessageList
        user={user}
        messages={messages}
        selectedUser={selectedUser}
      />

      <MessageComposer
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />

    </main>
  );
};

export default ChatWindow;