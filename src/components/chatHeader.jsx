const ChatHeader = ({ selectedUser }) => {
  return (
    <header
      className="
        flex h-[64px] shrink-0 items-center
        border-b border-[#d1d7db]
        bg-[#f0f2f5] px-4
      "
    >

      <div
        className="
          relative flex h-10 w-10 shrink-0
          items-center justify-center rounded-full
          bg-gradient-to-br from-[#d9fdd3] to-[#b7ebc6]
          text-sm font-semibold text-[#008069]
        "
      >

        {selectedUser.name?.charAt(0).toUpperCase()}

        <span
          className="
            absolute bottom-0 right-0
            h-3 w-3 rounded-full
            border-2 border-[#f0f2f5]
            bg-[#25d366]
          "
        />

      </div>

      <div className="ml-3 min-w-0 flex-1">

        <p className="truncate text-[15px] font-semibold text-[#111b21]">
          {selectedUser.name}
        </p>

        <p className="truncate text-[11px] text-[#667781]">
          online
        </p>

      </div>

      <div className="flex items-center gap-1">

        <button
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full text-[#54656f]
            transition hover:bg-[#dfe5e7]
          "
          title="Search"
        >
          🔍
        </button>

        <button
          className="
            flex h-9 w-9 items-center justify-center
            rounded-full text-[#54656f]
            transition hover:bg-[#dfe5e7]
          "
          title="More"
        >
          ⋮
        </button>

      </div>

    </header>
  );
};

export default ChatHeader;