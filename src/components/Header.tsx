import React, { useState } from "react";
import { Bell, Menu, ShieldAlert, Award, UserCheck } from "lucide-react";

interface HeaderProps {
  activeView: string;
  level: number;
  experience: number;
  setMobileOpen: (open: boolean) => void;
}

export default function Header({ activeView, level, experience, setMobileOpen }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: "1", text: "Resting Heart Rate is 5% higher this morning.", type: "warning" },
    { id: "2", text: "You completed 2/4 daily tasks. Keep it up!", type: "info" },
    { id: "3", text: "Coach AI generated a new nutrition plan.", type: "ai" },
  ]);

  const viewNames: Record<string, string> = {
    dashboard: "Overview",
    coach: "Coach AI",
    workouts: "Workouts",
    nutrition: "Nutrition Diet",
    settings: "System Settings",
    support: "Help & Support",
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <header className="md:ml-64 bg-[#121212]/95 border-b border-[#444933] sticky top-0 z-30 backdrop-blur-md">
      <div className="flex justify-between items-center w-full px-6 md:px-10 py-4 max-w-[1280px] mx-auto">
        
        {/* Mobile menu + App Logo */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-[#c4c9ac] hover:text-[#e5e2e1] p-1 cursor-pointer"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-display font-black text-[#c3f400] tracking-tighter text-2xl">AIFit</h1>
        </div>

        {/* Desktop View Name */}
        <div className="hidden md:block">
          <h2 className="font-display text-2xl font-black text-[#ffffff] tracking-tight">
            {viewNames[activeView] || "Overview"}
          </h2>
        </div>

        {/* User Badge and Notification Actions */}
        <div className="flex items-center gap-6">
          {/* Notifications dropdown anchor */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-[#c4c9ac] hover:text-[#c3f400] transition-colors relative p-1 cursor-pointer"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#c3f400] text-[#161e00] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-[#1e1e1e] border border-[#2c2c2e] rounded-xl shadow-2xl z-50 p-4">
                <div className="flex justify-between items-center pb-2 border-b border-[#2c2c2e] mb-2">
                  <h4 className="text-xs font-mono font-bold text-[#e5e2e1] tracking-wider">NOTIFICATIONS</h4>
                  {notifications.length > 0 && (
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[10px] text-[#c3f400] hover:underline cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#c4c9ac] py-4 text-center">No new notifications</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="flex items-start justify-between gap-2 p-2 rounded bg-[#131313] hover:bg-[#2a2a2a] transition-all"
                      >
                        <div className="flex gap-2">
                          <span className="text-xs mt-0.5">
                            {n.type === "warning" ? "⚠️" : n.type === "ai" ? "✨" : "💪"}
                          </span>
                          <p className="text-xs text-[#e5e2e1] leading-relaxed">{n.text}</p>
                        </div>
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="text-[10px] text-[#c4c9ac] hover:text-[#e5e2e1] ml-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User profile details */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="font-sans text-sm font-bold text-[#e5e2e1]">Alex Rivera</p>
              <div className="flex items-center gap-1.5 justify-end">
                <Award size={12} className="text-[#c3f400]" />
                <p className="font-mono text-[10px] text-[#c4c9ac] tracking-widest uppercase">
                  LVL {level} STRENGTH
                </p>
              </div>
              {/* Micro-Progress Bar for next level */}
              <div className="w-24 bg-[#2c2c2e] h-1 rounded-full mt-1 overflow-hidden ml-auto">
                <div
                  className="bg-gradient-to-r from-[#4b8eff] to-[#c3f400] h-full transition-all duration-500"
                  style={{ width: `${experience}%` }}
                />
              </div>
            </div>

            <div className="relative group cursor-pointer flex items-center justify-center w-10 h-10 rounded-full border border-[#444933] bg-[#2a2a2a]">
              <UserCheck size={20} className="text-[#c3f400]" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-[#121212] rounded-full" />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
