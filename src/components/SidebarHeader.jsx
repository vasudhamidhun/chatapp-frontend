const SidebarHeader = ({ user, logout }) => {
  return (
    <div className="flex h-[64px] shrink-0 items-center justify-between bg-[#f0f2f5] px-4">

      <div className="flex items-center gap-3">

        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full
            bg-gradient-to-br from-[#00a884] to-[#008f72]
            text-sm font-semibold text-white shadow-sm
          "
        >
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-[#111b21]">
            {user?.name}
          </p>

          <p className="text-[11px] text-[#667781]">
            Online
          </p>
        </div>

      </div>

      <div className="flex items-center gap-1">

        <button
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full text-[#54656f]
            transition hover:bg-[#dfe5e7]
          "
          title="New chat"
        >
          ✎
        </button>

        <button
          onClick={logout}
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full text-[#54656f]
            transition hover:bg-[#dfe5e7]
          "
          title="Logout"
        >
          ↪
        </button>

      </div>

    </div>
  );
};

export default SidebarHeader;