const UserListItem = ({
  user,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group flex w-full items-center gap-3
        px-4 py-3 text-left transition

        ${
          isSelected
            ? "bg-[#f0f2f5]"
            : "bg-white hover:bg-[#f5f6f6]"
        }
      `}
    >

      {/* Avatar */}
      <div
        className="
          relative flex h-[50px] w-[50px] shrink-0
          items-center justify-center rounded-full
          bg-gradient-to-br from-[#d9fdd3] to-[#b7ebc6]
          text-[16px] font-semibold text-[#008069]
        "
      >

        {user.name?.charAt(0).toUpperCase()}

        <span
          className="
            absolute bottom-0 right-0
            h-[13px] w-[13px]
            rounded-full border-[2px]
            border-white bg-[#25d366]
          "
        />

      </div>

      {/* User information */}
      <div
        className="
          min-w-0 flex-1
          border-b border-[#f0f2f5]
          py-1
        "
      >

        <div className="flex items-center justify-between">

          <p className="truncate text-[15px] font-medium text-[#111b21]">
            {user.name}
          </p>

          <span className="ml-2 text-[10px] text-[#667781]">
            {isSelected ? "Online" : ""}
          </span>

        </div>

        <div className="mt-1 flex items-center justify-between">

          <p className="truncate pr-3 text-[12px] text-[#667781]">
            {user.email}
          </p>

        </div>

      </div>

    </button>
  );
};

export default UserListItem;