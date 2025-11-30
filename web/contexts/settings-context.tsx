// Created automatically by Cursor AI (2025-11-30)
// Feature #12: Settings Context for Custom Risk Thresholds

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface RiskThresholds {
  // Score thresholds (0-100)
  lowMax: number;      // Below this = Low risk
  mediumMax: number;   // Below this = Medium, above = High
  
  // Clause count thresholds
  highRiskClauseWarning: number;  // Warn if more than X high-risk clauses
  
  // Custom weights per clause type
  clauseWeights: {
    payment: number;
    ip: number;
    confidentiality: number;
    termination: number;
    liability: number;
    other: number;
  };
}

export interface UserSettings {
  riskThresholds: RiskThresholds;
  displayPreferences: {
    showConfidenceScores: boolean;
    autoExpandTips: boolean;
    animationsEnabled: boolean;
    compactMode: boolean;
  };
  notifications: {
    emailOnHighRisk: boolean;
    emailAddress: string;
  };
}

const defaultSettings: UserSettings = {
  riskThresholds: {
    lowMax: 35,
    mediumMax: 65,
    highRiskClauseWarning: 3,
    clauseWeights: {
      payment: 1.0,
      ip: 1.2,
      confidentiality: 0.8,
      termination: 1.0,
      liability: 1.5,
      other: 0.5,
    },
  },
  displayPreferences: {
    showConfidenceScores: true,
    autoExpandTips: false,
    animationsEnabled: true,
    compactMode: false,
  },
  notifications: {
    emailOnHighRisk: false,
    emailAddress: "",
  },
};

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  updateRiskThresholds: (thresholds: Partial<RiskThresholds>) => void;
  resetToDefaults: () => void;
  calculateRiskLevel: (score: number) => "low" | "medium" | "high";
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEY = "contractcoach_settings";

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (e) {
      console.error("Failed to load settings:", e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (e) {
        console.error("Failed to save settings:", e);
      }
    }
  }, [settings, isHydrated]);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const updateRiskThresholds = useCallback((thresholds: Partial<RiskThresholds>) => {
    setSettings(prev => ({
      ...prev,
      riskThresholds: { ...prev.riskThresholds, ...thresholds },
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const calculateRiskLevel = useCallback((score: number): "low" | "medium" | "high" => {
    if (score <= settings.riskThresholds.lowMax) return "low";
    if (score <= settings.riskThresholds.mediumMax) return "medium";
    return "high";
  }, [settings.riskThresholds]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        updateRiskThresholds,
        resetToDefaults,
        calculateRiskLevel,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

