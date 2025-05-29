// AudioFeedback.tsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";

export interface AudioFeedbackHandle {
  playSendSound: () => void;
  playReceiveSound: () => void;
}

export const AudioFeedback = forwardRef<AudioFeedbackHandle>((props, ref) => {
  const sendAudioRef = useRef<HTMLAudioElement>(null);
  const receiveAudioRef = useRef<HTMLAudioElement>(null);

  useImperativeHandle(ref, () => ({
    playSendSound() {
      if (sendAudioRef.current) {
        sendAudioRef.current.currentTime = 0;
        sendAudioRef.current.play().catch(() => {
          // Handle play errors silently
        });
      }
    },
    playReceiveSound() {
      if (receiveAudioRef.current) {
        receiveAudioRef.current.currentTime = 0;
        receiveAudioRef.current.play().catch(() => {
          // Handle play errors silently
        });
      }
    },
  }));

  return (
    <>
      {/* You can replace these with your preferred sound files */}
      <audio ref={sendAudioRef} src="/sounds/send.mp3" preload="auto" />
      <audio ref={receiveAudioRef} src="/sounds/receive.mp3" preload="auto" />
    </>
  );
});
