import { useState, useRef, useEffect } from "react";
import { AgentStatus } from "@/components/agent-status";
import { ParticleBackground } from "@/components/particle-background";
import { CommandInput } from "@/components/command-input";
import { ResponseArea } from "@/components/response-area";
import {
  AudioFeedback,
  AudioFeedbackHandles,
} from "@/components/audio-feedback";
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
  const audioFeedbackRef = useRef<AudioFeedbackHandles>(null);

  // -- Text to Speech helper --
  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech Synthesis not supported");
      return;
    }
    // Cancel any ongoing speech to avoid overlaps
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    // Pick a preferred voice (optional)
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.name.includes("Google") || v.default);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  };

  // Format AI response as you already have
  const formatAIResponse = (result: any): string => {
    if (!result) return "Sorry, no response from the backend.";

    if (typeof result === "string") return result;

    if (typeof result === "object") {
      const { type } = result;

      switch (type) {
        case "weather": {
          const info = result.weatherInfo;
          return (
            `🌤️ Weather Update for ${info.location}\n` +
            `Temperature: ${info.temperature}\n` +
            `Feels Like: ${info.feelsLike}\n` +
            `Condition: ${info.description}\n` +
            `Humidity: ${info.humidity}\n` +
            `Wind Speed: ${info.windSpeed}`
          );
        }

        case "advice": {
          const { topic, advice } = result.ans;
          return `🧠 Advice on "${topic}"\n${advice}`;
        }

        case "news": {
          return `📰 Top News Headlines on ${result.topic}\n${result.news}`;
        }

        case "email": {
          return `📧 ${result.message}`;
        }

        default: {
          return Object.entries(result)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        }
      }
    }

    return "Sorry, I couldn't understand the response format.";
  };

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

    try {
      const response = await fetch("http://localhost:5000/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content }),
      });

      const data = await response.json();

      let aiContent = formatAIResponse(data?.result);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiResponse]);

      if (soundEnabled && audioFeedbackRef.current) {
        audioFeedbackRef.current.playReceiveSound();
      }

      // Speak the assistant response aloud
      if (soundEnabled) {
        speak(aiContent);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "There was an error connecting to the backend.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
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
