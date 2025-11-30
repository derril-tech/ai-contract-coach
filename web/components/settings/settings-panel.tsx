// Created automatically by Cursor AI (2025-11-30)
// Feature #12: Settings Panel Component

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Sliders,
  Bell,
  Eye,
  RotateCcw,
  Save,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSettings } from "@/contexts/settings-context";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, updateRiskThresholds, resetToDefaults } = useSettings();
  const [expandedSection, setExpandedSection] = useState<string | null>("risk");

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-bg-elevated border-l border-border-subtle shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-bg-elevated border-b border-border-subtle p-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-text-primary">Settings</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToDefaults}
                  className="text-xs text-text-muted hover:text-text-primary"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded hover:bg-bg-subtle transition-colors"
                >
                  <X className="h-5 w-5 text-text-muted" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {/* Risk Thresholds Section */}
              <Card className="border-border-subtle">
                <button
                  onClick={() => toggleSection("risk")}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm">Risk Thresholds</CardTitle>
                    </div>
                    {expandedSection === "risk" ? (
                      <ChevronUp className="h-4 w-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-muted" />
                    )}
                  </CardHeader>
                </button>
                
                <AnimatePresence>
                  {expandedSection === "risk" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="pt-0 space-y-6">
                        {/* Low Risk Threshold */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Low Risk Max Score</Label>
                            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                              {settings.riskThresholds.lowMax}
                            </Badge>
                          </div>
                          <Slider
                            value={[settings.riskThresholds.lowMax]}
                            onValueChange={([val]) => updateRiskThresholds({ lowMax: val })}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <p className="text-[11px] text-text-muted">
                            Scores below this are considered low risk
                          </p>
                        </div>

                        {/* Medium Risk Threshold */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">Medium Risk Max Score</Label>
                            <Badge variant="outline" className="text-amber-500 border-amber-500/30">
                              {settings.riskThresholds.mediumMax}
                            </Badge>
                          </div>
                          <Slider
                            value={[settings.riskThresholds.mediumMax]}
                            onValueChange={([val]) => updateRiskThresholds({ mediumMax: val })}
                            min={settings.riskThresholds.lowMax}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <p className="text-[11px] text-text-muted">
                            Scores above this are high risk
                          </p>
                        </div>

                        {/* High Risk Clause Warning */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-xs">High Risk Clause Warning</Label>
                            <Badge variant="outline" className="text-red-500 border-red-500/30">
                              {settings.riskThresholds.highRiskClauseWarning} clauses
                            </Badge>
                          </div>
                          <Slider
                            value={[settings.riskThresholds.highRiskClauseWarning]}
                            onValueChange={([val]) => updateRiskThresholds({ highRiskClauseWarning: val })}
                            min={1}
                            max={10}
                            step={1}
                            className="w-full"
                          />
                          <p className="text-[11px] text-text-muted">
                            Warn if contract has more than this many high-risk clauses
                          </p>
                        </div>

                        {/* Clause Type Weights */}
                        <div className="space-y-3">
                          <Label className="text-xs font-medium">Clause Type Weights</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {Object.entries(settings.riskThresholds.clauseWeights).map(([type, weight]) => (
                              <div key={type} className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] text-text-muted capitalize">{type}</span>
                                  <span className="text-[11px] font-medium">{weight}x</span>
                                </div>
                                <Slider
                                  value={[weight * 10]}
                                  onValueChange={([val]) => {
                                    updateRiskThresholds({
                                      clauseWeights: {
                                        ...settings.riskThresholds.clauseWeights,
                                        [type]: val / 10,
                                      },
                                    });
                                  }}
                                  min={1}
                                  max={20}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Display Preferences */}
              <Card className="border-border-subtle">
                <button
                  onClick={() => toggleSection("display")}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm">Display Preferences</CardTitle>
                    </div>
                    {expandedSection === "display" ? (
                      <ChevronUp className="h-4 w-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-muted" />
                    )}
                  </CardHeader>
                </button>
                
                <AnimatePresence>
                  {expandedSection === "display" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="pt-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs">Show Confidence Scores</Label>
                            <p className="text-[11px] text-text-muted">Display AI confidence on tips</p>
                          </div>
                          <Switch
                            checked={settings.displayPreferences.showConfidenceScores}
                            onCheckedChange={(checked) =>
                              updateSettings({
                                displayPreferences: {
                                  ...settings.displayPreferences,
                                  showConfidenceScores: checked,
                                },
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs">Auto-expand Tips</Label>
                            <p className="text-[11px] text-text-muted">Show strategy by default</p>
                          </div>
                          <Switch
                            checked={settings.displayPreferences.autoExpandTips}
                            onCheckedChange={(checked) =>
                              updateSettings({
                                displayPreferences: {
                                  ...settings.displayPreferences,
                                  autoExpandTips: checked,
                                },
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs">Animations</Label>
                            <p className="text-[11px] text-text-muted">Enable UI animations</p>
                          </div>
                          <Switch
                            checked={settings.displayPreferences.animationsEnabled}
                            onCheckedChange={(checked) =>
                              updateSettings({
                                displayPreferences: {
                                  ...settings.displayPreferences,
                                  animationsEnabled: checked,
                                },
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs">Compact Mode</Label>
                            <p className="text-[11px] text-text-muted">Reduce spacing and padding</p>
                          </div>
                          <Switch
                            checked={settings.displayPreferences.compactMode}
                            onCheckedChange={(checked) =>
                              updateSettings({
                                displayPreferences: {
                                  ...settings.displayPreferences,
                                  compactMode: checked,
                                },
                              })
                            }
                          />
                        </div>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>

              {/* Notifications */}
              <Card className="border-border-subtle">
                <button
                  onClick={() => toggleSection("notifications")}
                  className="w-full"
                >
                  <CardHeader className="flex flex-row items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm">Notifications</CardTitle>
                    </div>
                    {expandedSection === "notifications" ? (
                      <ChevronUp className="h-4 w-4 text-text-muted" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-muted" />
                    )}
                  </CardHeader>
                </button>
                
                <AnimatePresence>
                  {expandedSection === "notifications" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <CardContent className="pt-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-xs">Email on High Risk</Label>
                            <p className="text-[11px] text-text-muted">Send email when high-risk contract detected</p>
                          </div>
                          <Switch
                            checked={settings.notifications.emailOnHighRisk}
                            onCheckedChange={(checked) =>
                              updateSettings({
                                notifications: {
                                  ...settings.notifications,
                                  emailOnHighRisk: checked,
                                },
                              })
                            }
                          />
                        </div>

                        {settings.notifications.emailOnHighRisk && (
                          <div className="space-y-2">
                            <Label className="text-xs">Email Address</Label>
                            <Input
                              type="email"
                              placeholder="your@email.com"
                              value={settings.notifications.emailAddress}
                              onChange={(e) =>
                                updateSettings({
                                  notifications: {
                                    ...settings.notifications,
                                    emailAddress: e.target.value,
                                  },
                                })
                              }
                              className="text-xs h-8"
                            />
                          </div>
                        )}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Settings button to open the panel
export function SettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-bg-subtle transition-colors"
      title="Settings"
    >
      <Settings className="h-5 w-5 text-text-muted hover:text-text-primary" />
    </button>
  );
}

