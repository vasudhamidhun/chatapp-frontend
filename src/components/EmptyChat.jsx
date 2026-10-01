const EmptyChat = () => {
  return (
    <main
      className="
        relative flex flex-1 flex-col
        items-center justify-center
        border-b-[6px] border-[#25d366]
        bg-[#f0f2f5] text-center
      "
    >

      {/* Background */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(#d8d1c7 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative">

        <div
          className="
            mx-auto mb-6 flex h-[100px] w-[100px]
            items-center justify-center
            rounded-full bg-[#d9d3ca]
            text-4xl shadow-sm
          "
        >
          💬
        </div>

        <h1
          className="
            text-[30px] font-light
            tracking-tight text-[#41525d]
          "
        >
          ChatApp
        </h1>

        <p
          className="
            mt-3 max-w-md
            text-[13px] leading-6
            text-[#667781]
          "
        >
          Send and receive messages in real time.
          <br />
          Select a conversation from the left to start chatting.
        </p>

        <div
          className="
            mx-auto mt-6 flex w-fit
            items-center gap-2
            rounded-full bg-white
            px-4 py-2
            text-[11px]
            text-[#667781]
            shadow-sm
          "
        >
          <span className="text-[#00a884]">
            🔒
          </span>

          Your messages are private and secure
        </div>

      </div>

    </main>
  );
};

export default EmptyChat;