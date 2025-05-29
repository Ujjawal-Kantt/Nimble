import { useState, useRef, useEffect } from "react";
import { AgentStatus } from "@/components/agent-status";
import { ParticleBackground } from "@/components/particle-background";
import { CommandInput } from "@/components/command-input";
import { ResponseArea } from "@/components/response-area";
import { AudioFeedback } from "@/components/audio-feedback";
import { Message } from "./ui/message";

export function AgentInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello, I am Nimble. How can I assist you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioFeedbackRef = useRef<AudioFeedback>(null);

  const handleSendMessage = async (
    content: string,
    method: "text" | "voice" = "text"
  ) => {
    if (!content.trim()) return;

    if (soundEnabled && audioFeedbackRef.current) {
      audioFeedbackRef.current.playSendSound();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      method,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(content),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);

      if (soundEnabled && audioFeedbackRef.current) {
        audioFeedbackRef.current.playReceiveSound();
      }
    }, 1500 + Math.random() * 1500);
  };

  const generateResponse = (input: string): string => {
    const responses = [
      `I've analyzed your request: "${input}". Here's what I found...`,
      `Processing complete. Based on "${input}", I recommend considering...`,
      `Interesting query. After examining "${input}", I believe...`,
      `I've computed several responses to "${input}". The optimal answer appears to be...`,
      `According to my analysis of "${input}", the most relevant information is...`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <AudioFeedback ref={audioFeedbackRef} />
      <ParticleBackground />

      <div className="absolute inset-0 flex flex-col">
        <div className="absolute top-0 left-0 z-20 p-4">
          <AgentStatus isOnline={true} />
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto pt-16">
            <div className="max-w-6xl w-full mx-auto px-4">
              <ResponseArea messages={messages} isProcessing={isProcessing} />
            </div>
          </div>

          <div className="flex-shrink-0 w-full bg-black/20 backdrop-blur-sm py-8 px-4 z-20">
            <div className="max-w-6xl mx-auto">
              <CommandInput
                onSendMessage={handleSendMessage}
                isProcessing={isProcessing}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
