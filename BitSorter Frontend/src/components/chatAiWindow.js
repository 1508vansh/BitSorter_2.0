import axiosClient from "../utils/axiosClient";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import Loader from "../Ui/Loader";
import CodeBlock from "../Ui/copyBlock";
import { useSelector } from "react-redux";
const AiLogo = new URL("../assets/AiLogo.jpg", import.meta.url).href;
const UserLogo = new URL("../assets/UserLogo.png", import.meta.url).href;

export default function ChatAiWindow({ problem }) {
  const isDark = useSelector((state) => state?.isDark?.isDark);
  const User = useSelector((state)=>state?.auth.user);
  const [message, setMessage] = useState([
    { role: "model", content: `Hey, I'm here to assist you!` },
  ]);
  console.log("UserName : ",User);
  const [loading, setLoading] = useState(false);

  if (!problem) return <div>Loading...</div>;

  const messageEndRef = useRef(null);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    if (data.message.length <= 2) return;
    setMessage((prev) => [
      ...prev,
      { role: "user", content: data.message },
      { role: "model", isLoading: true },
    ]);
    setLoading(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        message: data.message,
        problem: problem,
      });

      setMessage((prev) => {
        const newMessages = [...prev];
        if (
          newMessages.length &&
          newMessages[newMessages.length - 1].isLoading
        ) {
          newMessages.pop();
        }
        const reply =
          typeof response?.data?.message === "string"
            ? response.data.message
            : "";
        return [...newMessages, { role: "model", content: reply }];
      });
    } catch (err) {
      setMessage((prev) => {
        const newMessages = [...prev];
        if (
          newMessages.length &&
          newMessages[newMessages.length - 1].isLoading
        ) {
          newMessages.pop();
        }
        return [
          ...newMessages,
          { role: "model", content: "Sorry, facing issue!" },
        ];
      });
    }

    setLoading(false);
    reset();
  };

  useEffect(() => {
    messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      className={`${isDark ? "bg-gray-900" : ""} h-full flex-col items-start`}
    >
      <div className="h-[85%] overflow-scroll p-2">
        {message?.map((mess, idx) => {
          if (mess.role === "model" && mess.isLoading) {
            return (
              <div key={idx} className={`chat chat-start`}>
                <div className="chat-bubble flex justify-center items-center min-h-[40px]">
                  <Loader />
                </div>
              </div>
            );
          } else
            return (
              <div
                key={idx}
                className={`chat ${
                  mess.role === "model" ? `chat-start` : `chat-end`
                }`}
              >
                {/* Avatar/Logo */}
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src={mess?.role==='model'?AiLogo:User?.avatarUrl?User.avatarUrl:UserLogo}
                    />
                  </div>
                </div>

                {/* Chat Header */}
                <div className="chat-header">

                  <time className="text-xs opacity-50 ml-2">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                </div>

                <div
                  className={`chat-bubble ${
                    mess.role === "model"
                      ? "chat-bubble-primary"
                      : "chat-bubble-info"
                  } max-w-[80%] whitespace-pre-wrap`}
                >
                  <pre className="whitespace-pre-wrap">
                    <code>{mess.content}</code>
                  </pre>
                </div>
                <div className="chat-footer opacity-50">{mess?.role === 'model'?'Ai':User?.firstName}</div>
              </div>
            );
        })}
        <div ref={messageEndRef}></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="sticky bottom-0 flex">
        <textarea
          placeholder="Type your message..."
          className={`textarea textarea-primary w-full`}
          {...register("message")}
        ></textarea>
        <button
          type="submit"
          className={`absolute outline-1 outline-blue-500 bg-indigo-400 p-2 rounded-sm right-3 top-6`}
        >
          <Send />
        </button>
      </form>
    </div>
  );
}
