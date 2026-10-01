const ChatSearch = () => {
  return (
    <div className="border-b border-[#f0f2f5] bg-white px-3 py-2">

      <div
        className="
          flex h-[40px] items-center rounded-lg
          bg-[#f0f2f5] px-3
          transition
          focus-within:ring-1
          focus-within:ring-[#00a884]
        "
      >

        <span className="mr-3 text-[15px] text-[#54656f]">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search or start new chat"
          className="
            w-full bg-transparent
            text-[13px] text-[#111b21]
            outline-none
            placeholder:text-[#667781]
          "
        />

      </div>

    </div>
  );
};

export default ChatSearch;