import { motion } from "framer-motion";
import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { CgClose } from "react-icons/cg";

interface Props {
  setLocationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  messages: any;
}

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.08,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const Chat = forwardRef<HTMLDivElement, Props>((props, ref) => {
  //@ts-ignore
  const { setLocationOpen, messages } = props;
  const { own_messages, other_messages } = messages;

  const renderChat = () => {
    const allMessages = [...own_messages, ...other_messages];

    // Sort the messages by message_id to preserve the order
    allMessages.sort((a, b) => a.message_id - b.message_id);

    return allMessages.map((message) => {
      const { text, message_id } = message;
      const isOwnMessage = own_messages.some(
        (m: any) => m.message_id === message_id
      );

      return (
        <div
          key={message_id}
          style={{ textAlign: isOwnMessage ? "right" : "left" }}
          className="overflow-scroll"
        >
          <div
            style={{
              display: "inline-block",
              background: isOwnMessage ? "#2ea0ff" : "#50cc23",
              color: "white",
              padding: "5px 10px",
              borderRadius: "10px",
              margin: "5px",
            }}
            className="overflow-scroll"
          >
            {text}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full h-full">
      {createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-screen h-full bg-black bg-opacity-30 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] flex justify-center items-center"
        >
          <motion.div
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={ref}
            className="opacity-100 text-black bg-white border h-3/5 w-3/4 lg:w-1/3 rounded-md z-20 overflow-scroll py-5"
          >
            <div className="px-6 py-4 flex flex-col gap-3 h-full">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-black self-center">
                    Диалог с продавцом
                  </p>
                  <div
                    onClick={() => {
                      setLocationOpen(false);
                    }}
                  >
                    <CgClose size={24} />
                  </div>
                </div>
                <hr />
                <div className="flex flex-col gap-1 overflow-scroll">
                  {renderChat()}
                </div>
                <input
                  className="w-full px-3 py-2 rounded-md mb-4"
                  type="text"
                  disabled
                  placeholder="ИИ ведет общение..."
                />
              </div>
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
});

export default Chat;
