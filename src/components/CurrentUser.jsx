const CurrentUser = ({ user }) => {
  return (
    <div
      className="
        flex shrink-0 items-center gap-3
        border-t border-[#d1d7db]
        bg-[#f0f2f5] px-4 py-3
      "
    >

      <div
        className="
          flex h-9 w-9 items-center justify-center
          rounded-full
          bg-gradient-to-br from-[#00a884] to-[#008f72]
          text-xs font-semibold text-white
        "
      >
        {user?.name?.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0">

        <p className="truncate text-sm font-semibold text-[#111b21]">
          {user?.name}
        </p>

        <p className="text-[11px] text-[#667781]">
          Your account
        </p>

      </div>

    </div>
  );
};

export default CurrentUser;