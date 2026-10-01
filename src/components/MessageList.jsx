import MessageBubble from "./MessageBubble";

const MessageList = ({
  user,
  messages,
  selectedUser,
}) => {
  return (
    <section
      className="relative flex-1 overflow-y-auto px-[6%] py-6"
      style={{
        backgroundColor: "#efeae2",
        backgroundImage: `
          radial-gradient(
            rgba(84, 101, 111, 0.10) 1px,
            transparent 1px
          )
        `,
        backgroundSize: "22px 22px",
      }}
    >

      <div
        className="
          pointer-events-none absolute inset-0
          bg-white/[0.03]
        "
      />

      {messages.length === 0 ? (

        <div className="relative flex h-full items-center justify-center">

          <div className="max-w-sm text-center">

            <div
              className="
                mx-auto mb-5 flex h-[72px] w-[72px]
                items-center justify-center rounded-full
                bg-[#d9d3ca] text-3xl shadow-sm
              "
            >
              💬
            </div>

            <h3 className="text-[18px] font-medium text-[#41525d]">
              No messages yet
            </h3>

            <p className="mt-2 text-[13px] leading-5 text-[#667781]">
              Start a conversation with{" "}
              <span className="font-medium text-[#41525d]">
                {selectedUser.name}
              </span>
            </p>

          </div>

        </div>

      ) : (

        <div className="relative mx-auto flex max-w-5xl flex-col gap-[3px]">

          {messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              isSent={
                msg.sender.toString() === user.id.toString()
              }
            />
          ))}

        </div>

      )}

    </section>
  );
};

export default MessageList;