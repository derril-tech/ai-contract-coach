// Created automatically by Cursor AI (2025-11-30)
// Feature #4: Voice Question Input with Web Speech API

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, X } from "lucide-react";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onSubmit?: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

// Check for browser support
const isSpeechRecognitionSupported = () => {
  if (typeof window === "undefined") return false;
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
};

export function VoiceInput({
  onTranscript,
  onSubmit,
  disabled = false,
  className,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const startListening = useCallback(() => {
    if (!isSpeechRecognitionSupported()) {
      setIsSupported(false);
      return;
    }

    // Create recognition instance
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      setInterimTranscript("");
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (final) {
        setTranscript((prev) => prev + final);
        onTranscript(transcript + final);
      }
      setInterimTranscript(interim);

      // Auto-stop after 2 seconds of silence (for final results)
      if (final) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          stopListening();
          if (onSubmit && (transcript + final).trim()) {
            onSubmit((transcript + final).trim());
          }
        }, 2000);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        setIsSupported(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onTranscript, onSubmit, transcript]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsListening(false);
  }, []);

  const cancelListening = useCallback(() => {
    stopListening();
    setTranscript("");
    setInterimTranscript("");
    onTranscript("");
  }, [stopListening, onTranscript]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
      // Submit if we have a transcript
      if (onSubmit && transcript.trim()) {
        onSubmit(transcript.trim());
      }
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening, onSubmit, transcript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isSupported) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className={cn("h-8 w-8 opacity-50", className)}
        title="Voice input not supported in this browser"
      >
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {/* Main button */}
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="icon"
        onClick={toggleListening}
        disabled={disabled}
        className={cn(
          "h-8 w-8 transition-all",
          isListening && "animate-pulse bg-red-500 hover:bg-red-600"
        )}
        title={isListening ? "Stop listening" : "Start voice input"}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="h-4 w-4" />
          </motion.div>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {/* Listening indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-bg-elevated border border-border-subtle rounded-lg shadow-lg p-3 min-w-[200px] max-w-[300px]">
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-red-500"
                  />
                  <span className="text-xs font-medium text-text-primary">Listening...</span>
                </div>
                <button
                  onClick={cancelListening}
                  className="p-1 rounded hover:bg-bg-subtle transition-colors"
                >
                  <X className="h-3 w-3 text-text-muted" />
                </button>
              </div>

              {/* Transcript preview */}
              <div className="text-xs text-text-secondary min-h-[20px]">
                {transcript && <span>{transcript}</span>}
                {interimTranscript && (
                  <span className="text-text-muted italic">{interimTranscript}</span>
                )}
                {!transcript && !interimTranscript && (
                  <span className="text-text-muted">Speak now...</span>
                )}
              </div>

              {/* Waveform animation */}
              <div className="flex items-center justify-center gap-1 mt-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [4, 16, 4],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className="w-1 bg-primary rounded-full"
                  />
                ))}
              </div>

              {/* Tip */}
              <p className="text-[9px] text-text-muted mt-2 text-center">
                Click mic or wait 2s to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Compact inline voice button
export function VoiceInputInline({
  onTranscript,
  disabled = false,
  className,
}: Omit<VoiceInputProps, "onSubmit">) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const toggleListening = useCallback(() => {
    if (!isSpeechRecognitionSupported()) return;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      onTranscript(result);
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, onTranscript]);

  if (!isSupported) return null;

  return (
    <button
      onClick={toggleListening}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded-full transition-all",
        isListening 
          ? "bg-red-500 text-white animate-pulse" 
          : "hover:bg-bg-subtle text-text-muted hover:text-text-primary",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      title={isListening ? "Listening..." : "Voice input"}
    >
      <Mic className="h-3.5 w-3.5" />
    </button>
  );
}

