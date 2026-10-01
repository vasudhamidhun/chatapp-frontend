import UserListItem from "./UserListItem";

const UserList = ({
  users,
  selectedUser,
  setSelectedUser,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">

      {users.map((item) => (
        <UserListItem
          key={item._id}
          user={item}
          isSelected={selectedUser?._id === item._id}
          onClick={() => setSelectedUser(item)}
        />
      ))}

    </div>
  );
};

export default UserList;