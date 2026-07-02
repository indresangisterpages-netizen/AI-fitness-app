import React, { useState } from "react";
import { Settings, Shield, User, Bell, Save, KeyRound } from "lucide-react";

interface SettingsViewProps {
  calorieGoal: number;
  setCalorieGoal: (goal: number) => void;
  hydrationGoal: number;
  setHydrationGoal: (goal: number) => void;
  proteinGoal: number;
  setProteinGoal: (goal: number) => void;
}

export default function SettingsView({
  calorieGoal,
  setCalorieGoal,
  hydrationGoal,
  setHydrationGoal,
  proteinGoal,
  setProteinGoal,
}: SettingsViewProps) {
  const [kcal, setKcal] = useState(calorieGoal.toString());
  const [water, setWater] = useState(hydrationGoal.toString());
  const [protein, setProtein] = useState(proteinGoal.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const k = parseInt(kcal);
    const w = parseFloat(water);
    const p = parseInt(protein);

    if (!isNaN(k) && k > 500 && k < 10000) setCalorieGoal(k);
    if (!isNaN(w) && w > 0.5 && w < 10) setHydrationGoal(w);
    if (!isNaN(p) && p > 10 && p < 500) setProteinGoal(p);

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-8">
      <div className="glass-card rounded-2xl p-6 md:p-8 bg-[#1E1E1E]">
        <div className="flex items-center gap-3 border-b border-[#2c2c2e] pb-4 mb-6">
          <Settings size={22} className="text-[#c3f400]" />
          <h3 className="font-display font-extrabold text-[#ffffff] text-xl">System Configurations</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section: Athletic Goals */}
          <div className="space-y-4">
            <h4 className="font-mono text-xs font-bold text-[#c3f400] tracking-widest uppercase">ATHLETIC TARGETS</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">DAILY ENERGY (KCAL)</label>
                <input
                  type="number"
                  required
                  value={kcal}
                  onChange={(e) => setKcal(e.target.value)}
                  className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
                />
              </div>
              
              <div>
                <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">HYDRATION TARGET (L)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                  className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">PROTEIN BARRIER (G)</label>
                <input
                  type="number"
                  required
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
                />
              </div>
            </div>
          </div>

          {/* Section: API configuration info */}
          <div className="p-4 rounded-xl bg-[#131313]/50 border border-[#2c2c2e]/80 space-y-3">
            <div className="flex items-center gap-2 text-[#adc6ff]">
              <KeyRound size={16} />
              <h5 className="font-mono text-xs font-bold uppercase">Secrets & API Integrations</h5>
            </div>
            <p className="text-xs text-[#c4c9ac] leading-relaxed">
              Coach AI utilizes Google's state-of-the-art <span className="font-semibold text-white">Gemini 3.5-flash</span> model. 
              The application looks for the <span className="font-mono bg-black px-1.5 py-0.5 rounded text-white">GEMINI_API_KEY</span> inside 
              the backend environment variables.
            </p>
            <p className="text-xs text-[#c4c9ac] leading-relaxed">
              To configure your keys, navigate to the <span className="text-white font-semibold">{"Settings > Secrets"}</span> panel in the AI Studio sidebar menu. No in-app forms are required—keys are secured completely on the server-side.
            </p>
          </div>

          {/* Alert of completion */}
          {saved && (
            <div className="bg-[#c3f400]/10 border border-[#c3f400]/30 text-[#c3f400] text-xs p-3 rounded-xl flex items-center gap-2">
              <Shield size={14} /> Goals updated successfully. Metrics recalculating in active dashboard.
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="bg-[#c3f400] text-[#161e00] hover:bg-[#abd600] px-6 py-3 rounded-xl font-display font-black text-sm flex items-center gap-2 cursor-pointer transition-all shadow-md"
            >
              <Save size={16} /> SAVE CONFIGURATIONS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
