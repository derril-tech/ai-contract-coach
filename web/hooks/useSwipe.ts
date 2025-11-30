// Created automatically by Cursor AI (2025-11-30)
// Custom hook for detecting swipe gestures on mobile

import { useState, useRef, useCallback, TouchEvent } from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  threshold?: number; // Minimum distance for swipe (default: 50px)
  allowedTime?: number; // Maximum time for swipe (default: 300ms)
}

interface SwipeState {
  isSwiping: boolean;
  direction: "left" | "right" | "up" | "down" | null;
}

export function useSwipe(
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) {
  const { threshold = 50, allowedTime = 300 } = config;
  
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
  });
  
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const onTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    setSwipeState({ isSwiping: true, direction: null });
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Determine primary direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeState({
        isSwiping: true,
        direction: deltaX > 0 ? "right" : "left",
      });
    } else {
      setSwipeState({
        isSwiping: true,
        direction: deltaY > 0 ? "down" : "up",
      });
    }
  }, []);

  const onTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const elapsedTime = Date.now() - touchStartRef.current.time;
    
    // Reset state
    touchStartRef.current = null;
    setSwipeState({ isSwiping: false, direction: null });
    
    // Check if it's a valid swipe
    if (elapsedTime > allowedTime) return;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    // Horizontal swipe
    if (absX > threshold && absX > absY) {
      if (deltaX > 0) {
        handlers.onSwipeRight?.();
      } else {
        handlers.onSwipeLeft?.();
      }
    }
    // Vertical swipe
    else if (absY > threshold && absY > absX) {
      if (deltaY > 0) {
        handlers.onSwipeDown?.();
      } else {
        handlers.onSwipeUp?.();
      }
    }
  }, [handlers, threshold, allowedTime]);

  return {
    swipeState,
    swipeHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
}

export default useSwipe;

