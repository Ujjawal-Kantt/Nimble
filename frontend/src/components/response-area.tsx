import { useRef, useEffect } from "react";
import { Message } from "@/types/message";
import { MessageItem } from "@/components/message-item";
import { LoadingIndicator } from "@/components/loading-indicator";

interface ResponseAreaProps {
  messages: Message[];
  isProcessing: boolean;
}

export function ResponseArea({ messages, isProcessing }: ResponseAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-6 py-4 pb-8">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      {isProcessing && (
        <div className="flex justify-center items-center py-8">
          <LoadingIndicator />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
