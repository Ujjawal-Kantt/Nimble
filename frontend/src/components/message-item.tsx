import { useEffect, useState } from "react";
import { Message } from "@/types/message";
import { cn } from "@/lib/utils";
import { MessageSquare, Mic } from "lucide-react";

interface MessageItemProps {
  message: Message;
}

export function MessageItem({ message }: MessageItemProps) {
  const [visible, setVisible] = useState(false);

  // Animate in on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "transition-all duration-500 ease-out",
        "transform max-w-[70%] md:max-w-[60%]",
        !visible && "opacity-0 translate-y-4",
        visible && "opacity-100 translate-y-0",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "rounded-2xl p-4 shadow-md backdrop-blur-sm",
          "border border-gray-800/50",
          isUser
            ? "bg-gradient-to-br from-fuchsia-900/80 to-fuchsia-800/50 text-fuchsia-50"
            : "bg-gradient-to-br from-cyan-900/80 to-cyan-800/50 text-cyan-50"
        )}
      >
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-1 rounded-full p-1.5 flex-shrink-0",
              isUser
                ? "bg-fuchsia-700 text-fuchsia-100"
                : "bg-cyan-700 text-cyan-100"
            )}
          >
            {isUser ? (
              message.method === "voice" ? (
                <Mic className="w-3.5 h-3.5" />
              ) : (
                <MessageSquare className="w-3.5 h-3.5" />
              )
            ) : (
              <div className="w-3.5 h-3.5 flex items-center justify-center font-bold text-xs">
                N
              </div>
            )}
          </div>
          <div className="flex-1 space-y-1.5">
            <p
              className={cn(
                "text-xs font-semibold",
                isUser ? "text-fuchsia-200" : "text-cyan-200"
              )}
            >
              {isUser ? "You" : "Nimble"}
            </p>
            <div className="text-sm font-light leading-relaxed whitespace-pre-wrap">
              {message.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
