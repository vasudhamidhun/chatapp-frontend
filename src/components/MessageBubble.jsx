const MessageBubble = ({ message, isSent }) => {
  return (
    <div
      className={`
        flex w-full py-[2px]
        ${isSent ? "justify-end" : "justify-start"}
      `}
    >

      <div
        className={`
          relative max-w-[70%]
          px-3 py-[7px]
          shadow-sm

          ${
            isSent
              ? "rounded-lg rounded-tr-none bg-[#d9fdd3]"
              : "rounded-lg rounded-tl-none bg-white"
          }
        `}
      >

        <div className="flex items-end gap-2">

          <p
            className="
              min-w-0 break-words
              whitespace-pre-wrap
              text-[13.5px]
              leading-[19px]
              text-[#111b21]
            "
          >
            {message.content}
          </p>

          <div
            className="
              flex shrink-0 items-center
              gap-1 self-end pb-[1px]
            "
          >

            <span className="text-[9px] text-[#667781]">
              {new Date(message.createdAt).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>

            {isSent && (
              <span className="text-[11px] font-medium text-[#53bdeb]">
                ✓✓
              </span>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default MessageBubble;