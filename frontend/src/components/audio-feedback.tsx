import React, { forwardRef, useImperativeHandle } from 'react';

export interface AudioFeedbackRef {
  playSendSound: () => void;
  playReceiveSound: () => void;
}

export const AudioFeedback = forwardRef<AudioFeedbackRef, {}>((_, ref) => {
  // Audio context for creating sounds programmatically
  const createAudioContext = () => {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  };
  
  // Create a beep sound with given parameters
  const createBeep = (
    frequency: number,
    duration: number,
    volume: number,
    type: OscillatorType = 'sine'
  ) => {
    try {
      const audioContext = createAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      
      gainNode.connect(audioContext.destination);
      gainNode.gain.value = volume;
      
      // Add fade out
      gainNode.gain.exponentialRampToValueAtTime(
        0.01, 
        audioContext.currentTime + duration
      );
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.error('Audio error:', error);
    }
  };
  
  // Send message sound (higher pitch)
  const playSendSound = () => {
    createBeep(880, 0.1, 0.1, 'sine'); // A5 note
  };
  
  // Receive message sound (lower pitch)
  const playReceiveSound = () => {
    createBeep(440, 0.15, 0.1, 'sine'); // A4 note
  };
  
  // Expose functions through ref
  useImperativeHandle(ref, () => ({
    playSendSound,
    playReceiveSound
  }));
  
  return null; // No visible component
});