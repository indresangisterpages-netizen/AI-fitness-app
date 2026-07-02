import React from "react";
import { LayoutDashboard, Bot, Dumbbell, Utensils, Settings, HelpCircle, Flame, Menu, X } from "lucide-react";

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onStartWorkout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  onStartWorkout,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard },
    { id: "coach", label: "COACH AI", icon: Bot },
    { id: "workouts", label: "WORKOUTS", icon: Dumbbell },
    { id: "nutrition", label: "NUTRITION", icon: Utensils },
  ];

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className="fixed left-0 top-0 h-full z-40 flex flex-col py-8 bg-[#1c1b1b] border-r border-[#444933] w-64 hidden md:flex">
        <div className="px-6 mb-10">
          <h1 className="font-display text-2xl font-black text-[#c3f400] tracking-tighter">AIFit Elite</h1>
          <p className="font-mono text-[10px] text-[#c4c9ac] mt-1 tracking-wider">PRO ATHLETE · ELITE TIER</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-4 rounded-lg px-4 py-3 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)] scale-[1.02]"
                    : "text-[#c4c9ac] hover:text-[#e5e2e1] hover:bg-[#2a2a2a]"
                }`}
              >
                <Icon size={20} />
                <span className="font-mono text-xs font-semibold tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 mt-auto space-y-2">
          <button
            onClick={onStartWorkout}
            className="w-full bg-[#c3f400] text-[#161e00] font-display font-black py-3 rounded-xl hover:bg-[#abd600] transition-all duration-300 neon-glow hover:shadow-[0_0_20px_rgba(195,244,0,0.45)] cursor-pointer flex items-center justify-center gap-2 mb-6"
          >
            <Flame size={18} className="fill-current" />
            START WORKOUT
          </button>

          <button
            onClick={() => setActiveView("settings")}
            className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeView === "settings" ? "text-[#c3f400]" : "text-[#c4c9ac] hover:text-[#e5e2e1]"
            }`}
          >
            <Settings size={18} />
            <span className="font-mono text-xs font-semibold tracking-wider">SETTINGS</span>
          </button>

          <button
            onClick={() => setActiveView("support")}
            className={`w-full flex items-center gap-4 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeView === "support" ? "text-[#c3f400]" : "text-[#c4c9ac] hover:text-[#e5e2e1]"
            }`}
          >
            <HelpCircle size={18} />
            <span className="font-mono text-xs font-semibold tracking-wider">SUPPORT</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Overlay and Menu) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full z-50 flex flex-col py-8 bg-[#1c1b1b] border-r border-[#444933] w-64 md:hidden transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-6 mb-10">
          <div>
            <h1 className="font-display text-2xl font-black text-[#c3f400] tracking-tighter">AIFit Elite</h1>
            <p className="font-mono text-[9px] text-[#c4c9ac] tracking-wider">PRO ATHLETE · ELITE TIER</p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-[#c4c9ac] hover:text-[#e5e2e1] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-4 rounded-lg px-4 py-3 transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_15px_rgba(195,244,0,0.3)]"
                    : "text-[#c4c9ac] hover:text-[#e5e2e1] hover:bg-[#2a2a2a]"
                }`}
              >
                <Icon size={20} />
                <span className="font-mono text-xs font-semibold tracking-wider">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 mt-auto space-y-2">
          <button
            onClick={() => {
              onStartWorkout();
              setMobileOpen(false);
            }}
            className="w-full bg-[#c3f400] text-[#161e00] font-display font-black py-3 rounded-xl hover:bg-[#abd600] transition-all neon-glow flex items-center justify-center gap-2 mb-6 cursor-pointer"
          >
            <Flame size={18} className="fill-current" />
            START WORKOUT
          </button>

          <button
            onClick={() => {
              setActiveView("settings");
              setMobileOpen(false);
            }}
            className="w-full flex items-center gap-4 px-4 py-2 text-[#c4c9ac] hover:text-[#e5e2e1] cursor-pointer"
          >
            <Settings size={18} />
            <span className="font-mono text-xs font-semibold tracking-wider">SETTINGS</span>
          </button>

          <button
            onClick={() => {
              setActiveView("support");
              setMobileOpen(false);
            }}
            className="w-full flex items-center gap-4 px-4 py-2 text-[#c4c9ac] hover:text-[#e5e2e1] cursor-pointer"
          >
            <HelpCircle size={18} />
            <span className="font-mono text-xs font-semibold tracking-wider">SUPPORT</span>
          </button>
        </div>
      </aside>
    </>
  );
}
