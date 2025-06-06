// CommandInput.tsx
import { useState, useRef, useEffect } from "react";
import { Mic, Send, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandInputProps {
  onSendMessage: (content: string, method?: "text" | "voice") => void;
  isProcessing: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export function CommandInput({
  onSendMessage,
  isProcessing,
  soundEnabled,
  onToggleSound,
}: CommandInputProps) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Setup Speech Recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        onSendMessage(transcript, "voice");
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Voice error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("🎤 Web Speech API isn't supported in this browser.");
    }
  }, [onSendMessage]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInput("");
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "24px";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-end group">
        <div className="relative flex-1">
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-50 blur-sm group-focus-within:opacity-100 transition-opacity"></div>
          <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 animate-scanner"></div>

          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing || isListening}
            placeholder={isListening ? "Listening..." : "Enter command..."}
            className={cn(
              "resize-none py-3 px-4 bg-black/80 backdrop-blur-md text-cyan-50 w-full rounded-md",
              "border-0 outline-none focus:ring-0 focus:outline-none",
              "font-mono text-sm min-h-[48px] max-h-[120px] overflow-y-auto",
              "placeholder:text-cyan-500/50 relative z-10",
              isListening && "animate-pulse text-fuchsia-500"
            )}
            rows={1}
          />
        </div>

        <div className="flex gap-2 ml-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={cn(
              "p-3 rounded-full bg-black/80 backdrop-blur-md border-0",
              "text-cyan-400 hover:text-cyan-200 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
              !soundEnabled && "text-muted-foreground hover:text-cyan-400"
            )}
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Voice Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            disabled={isProcessing}
            className={cn(
              "p-3 rounded-full border-0 transition-all duration-300",
              "focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50",
              isListening
                ? "bg-fuchsia-500 text-white animate-pulse"
                : "bg-black/80 backdrop-blur-md text-fuchsia-400 hover:text-fuchsia-200"
            )}
            aria-label={isListening ? "Stop listening" : "Start voice input"}
          >
            <Mic className="w-5 h-5" />
            {isListening && (
              <span className="absolute inset-0 rounded-full bg-fuchsia-500/50 animate-ping"></span>
            )}
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className={cn(
              "p-3 rounded-full bg-black/80 backdrop-blur-md border-0",
              "text-cyan-400 hover:text-cyan-200 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-cyan-500/50",
              (!input.trim() || isProcessing) && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
