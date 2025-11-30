// Created automatically by Cursor AI (2025-11-30)
// Custom hook for pull-to-refresh functionality on mobile

import { useState, useRef, useCallback, useEffect } from "react";

interface PullToRefreshConfig {
  threshold?: number; // Pull distance to trigger refresh (default: 80px)
  resistance?: number; // Resistance factor (default: 2.5)
  onRefresh: () => Promise<void>;
}

interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  canRefresh: boolean;
}

export function usePullToRefresh({
  threshold = 80,
  resistance = 2.5,
  onRefresh,
}: PullToRefreshConfig) {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    canRefresh: false,
  });

  const startYRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only enable if scrolled to top
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      setState(prev => ({ ...prev, isPulling: true }));
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!state.isPulling || state.isRefreshing) return;
    if (!containerRef.current || containerRef.current.scrollTop > 0) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;

    if (diff > 0) {
      // Apply resistance
      const pullDistance = Math.min(diff / resistance, threshold * 1.5);
      const canRefresh = pullDistance >= threshold;

      setState(prev => ({
        ...prev,
        pullDistance,
        canRefresh,
      }));

      // Prevent default scrolling when pulling
      if (pullDistance > 10) {
        e.preventDefault();
      }
    }
  }, [state.isPulling, state.isRefreshing, resistance, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!state.isPulling) return;

    if (state.canRefresh && !state.isRefreshing) {
      setState(prev => ({
        ...prev,
        isPulling: false,
        isRefreshing: true,
        pullDistance: threshold / 2, // Keep a smaller distance during refresh
      }));

      try {
        await onRefresh();
      } finally {
        setState({
          isPulling: false,
          isRefreshing: false,
          pullDistance: 0,
          canRefresh: false,
        });
      }
    } else {
      setState({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        canRefresh: false,
      });
    }
  }, [state.isPulling, state.canRefresh, state.isRefreshing, onRefresh, threshold]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add passive: false to allow preventDefault
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    containerRef,
    ...state,
  };
}

export default usePullToRefresh;

