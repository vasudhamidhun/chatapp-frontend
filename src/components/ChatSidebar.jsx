import SidebarHeader from "./SidebarHeader";
import ChatSearch from "./ChatSearch";
import UserList from "./UserList";
import CurrentUser from "./CurrentUser";

const ChatSidebar = ({
  user,
  users,
  selectedUser,
  setSelectedUser,
  logout,
}) => {

    console.log("user ",users)
  return (
    <aside className="flex w-[380px] shrink-0 flex-col border-r border-[#d1d7db] bg-white">

      <SidebarHeader
        user={user}
        logout={logout}
      />

      <ChatSearch />

      <UserList
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      <CurrentUser user={user} />

    </aside>
  );
};

export default ChatSidebar;