import React, { useState } from "react";
import { Plus, Coffee, Salad, Moon, Apple, Info, Trash2, ShieldAlert } from "lucide-react";
import { Meal, MealType } from "../types";

interface NutritionViewProps {
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  calorieGoal: number;
  proteinGoal: number;
  onLogMealCalories: (kcal: number) => void;
}

export default function NutritionView({
  meals,
  setMeals,
  calorieGoal,
  proteinGoal,
  onLogMealCalories,
}: NutritionViewProps) {
  const [showLogModal, setShowLogModal] = useState(false);
  const [mealName, setMealName] = useState("");
  const [mealKcal, setMealKcal] = useState("");
  const [mealProtein, setMealProtein] = useState("");
  const [mealType, setMealType] = useState<MealType>(MealType.BREAKFAST);

  const totalKcal = meals.reduce((sum, m) => sum + m.kCal, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.protein, 0);

  const kcalPercent = Math.min((totalKcal / calorieGoal) * 100, 100);
  const proteinPercent = Math.min((totalProtein / proteinGoal) * 100, 100);

  const handleLogMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kcal = parseInt(mealKcal);
    const protein = parseInt(mealProtein);

    if (mealName.trim() && !isNaN(kcal) && !isNaN(protein)) {
      // Pick a suitable high-quality fit-pro hotlink image based on meal type or name
      let image = "https://lh3.googleusercontent.com/aida-public/AB6AXuBAxEYO3LVbykOMVdOc3viMf414OaeEXKzcUd2I6tWmlzXcZUFbKEga-ZKcKTpxOZazX_nGAIrNdDUH0GYsJfDIW-_OlM7a3PipN3dG_0tdFJDICMV0mWuLI7N19qYZHssuWMWjDHBfFf_YA7oLWXwFsjNeFlwkRcGqwbn8FVVebwjiJK42-7-yapt1fFSRxWM29ihtvG3vP6CR2yf2xlyXJ3Z_DjHyzt0QLfq3RLlTSmwojAvRhL83"; // breakfast bowl default

      if (mealType === MealType.LUNCH) {
        image = "https://lh3.googleusercontent.com/aida-public/AB6AXuDu1uQFd4kft5Gr1nPO3h1-f69uIEH7N2Q5Ck_EL_pMYLNb0RDerV37ftlZwUzwgDQrYQu4y95I-EkhYw130Td_eyNpt-fo3qPcvvlNa8zc-o72F3YnGKE4QdpeqYtD2TpDHhz_d9VDG_2TRI7hTFZvYpuKQHkWuDvLGSS80UsKOtPN_512JcbakI4aMTmS7zc4BKcHAb2zVtsb8m1BMDv5W2pZMpjl9zFripviynPZ-dw71dEPHr7z"; // chicken salad
      } else if (mealType === MealType.DINNER) {
        image = "https://lh3.googleusercontent.com/aida-public/AB6AXuDu1uQFd4kft5Gr1nPO3h1-f69uIEH7N2Q5Ck_EL_pMYLNb0RDerV37ftlZwUzwgDQrYQu4y95I-EkhYw130Td_eyNpt-fo3qPcvvlNa8zc-o72F3YnGKE4QdpeqYtD2TpDHhz_d9VDG_2TRI7hTFZvYpuKQHkWuDvLGSS80UsKOtPN_512JcbakI4aMTmS7zc4BKcHAb2zVtsb8m1BMDv5W2pZMpjl9zFripviynPZ-dw71dEPHr7z";
      }

      const newMeal: Meal = {
        id: `meal-${Date.now()}`,
        name: mealName.trim(),
        kCal: kcal,
        protein,
        type: mealType,
        image,
      };

      setMeals((prev) => [...prev, newMeal]);
      onLogMealCalories(kcal);

      // Clean form
      setMealName("");
      setMealKcal("");
      setMealProtein("");
      setShowLogModal(false);
    }
  };

  const handleDeleteMeal = (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-10">
      {/* Target Tracker Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calories Progress Card */}
        <div className="glass-card rounded-2xl p-6 bg-[#1E1E1E]">
          <h4 className="font-mono text-xs text-[#c4c9ac] tracking-widest uppercase mb-4">CALORIC PERFORMANCE</h4>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              {/* Custom SVG ring progress */}
              <svg className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" r="48" fill="transparent" stroke="#2c2c2e" strokeWidth="8" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="transparent"
                  stroke="#c3f400"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - kcalPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <span className="font-display text-xl font-black text-[#ffffff]">{Math.round(kcalPercent)}%</span>
                <span className="font-mono text-[8px] text-[#c4c9ac] tracking-widest uppercase font-bold">ENERGY</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-black text-[#ffffff]">{totalKcal}</span>
                <span className="font-mono text-xs text-[#c4c9ac]">/ {calorieGoal} kcal</span>
              </div>
              <p className="text-xs text-[#c4c9ac] leading-relaxed">
                You have <span className="text-[#c3f400] font-bold">{Math.max(0, calorieGoal - totalKcal)} kcal</span> remaining to hit your target before deep sleep synthesis starts.
              </p>
            </div>
          </div>
        </div>

        {/* Protein Progress Card */}
        <div className="glass-card rounded-2xl p-6 bg-[#1E1E1E]">
          <h4 className="font-mono text-xs text-[#c4c9ac] tracking-widest uppercase mb-4">MACRO PROTEIN TARGET</h4>
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" r="48" fill="transparent" stroke="#2c2c2e" strokeWidth="8" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="transparent"
                  stroke="#4b8eff"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - proteinPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col justify-center items-center">
                <span className="font-display text-xl font-black text-[#ffffff]">{Math.round(proteinPercent)}%</span>
                <span className="font-mono text-[8px] text-[#c4c9ac] tracking-widest uppercase font-bold">PROTEIN</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-3xl font-black text-[#ffffff]">{totalProtein}g</span>
                <span className="font-mono text-xs text-[#c4c9ac]">/ {proteinGoal}g target</span>
              </div>
              <p className="text-xs text-[#c4c9ac] leading-relaxed">
                Anabolic threshold is active. Log high protein meals to maintain cellular structural repair after high-intensity training.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logged Meals Breakdown */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-extrabold text-[#ffffff] text-2xl tracking-tight">Today's Nutrition log</h3>
          <button
            onClick={() => setShowLogModal(true)}
            className="bg-[#c3f400] text-[#161e00] font-display font-black hover:bg-[#abd600] px-5 py-3 rounded-xl neon-glow transition-all flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <Plus size={16} /> LOG ACTIVE MEAL
          </button>
        </div>

        {meals.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center max-w-md mx-auto bg-[#1E1E1E]">
            <Apple size={32} className="text-[#c4c9ac] mx-auto opacity-50 mb-3 animate-bounce" />
            <h4 className="font-display font-bold text-[#ffffff] text-sm">No meals logged for today</h4>
            <p className="text-xs text-[#c4c9ac] mt-2">Log breakfast, lunch, or custom macros to start charting metrics.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meals.map((m) => {
              const TypeIcon = m.type === MealType.BREAKFAST ? Coffee : m.type === MealType.LUNCH ? Salad : m.type === MealType.DINNER ? Moon : Apple;
              return (
                <div
                  key={m.id}
                  className="bg-[#1e1e1e] hover:bg-[#252525] border border-[#2c2c2e] p-4 rounded-xl flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#2c2c2e]">
                      {m.image ? (
                        <img className="w-full h-full object-cover" alt={m.name} referrerPolicy="no-referrer" src={m.image} />
                      ) : (
                        <div className="w-full h-full bg-[#131313] flex items-center justify-center text-[#c3f400]">
                          <TypeIcon size={18} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#e5e2e1] truncate max-w-[160px] md:max-w-xs">{m.name}</h4>
                      <p className="font-mono text-[9px] text-[#c3f400] uppercase font-bold tracking-wider">{m.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right font-mono">
                      <p className="text-xs font-bold text-[#ffffff]">{m.kCal} kCal</p>
                      <p className="text-[8px] text-[#c4c9ac] uppercase tracking-wider">{m.protein}g Protein</p>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteMeal(m.id)}
                      className="text-[#c4c9ac] hover:text-red-400 p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Log Meal Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] border border-[#2c2c2e] p-6 rounded-2xl w-full max-w-sm">
            <h4 className="font-display font-bold text-[#ffffff] text-lg mb-4">Log Macro Meal</h4>
            <form onSubmit={handleLogMealSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">MEAL CLASSIFICATION</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
                >
                  <option value={MealType.BREAKFAST}>BREAKFAST</option>
                  <option value={MealType.LUNCH}>LUNCH</option>
                  <option value={MealType.DINNER}>DINNER</option>
                  <option value={MealType.SNACK}>SNACK / SHAKE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">MEAL NAME</label>
                <input
                  type="text"
                  required
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="e.g. Avocado Toast with Salmon"
                  className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">ENERGY (KCAL)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="3000"
                    value={mealKcal}
                    onChange={(e) => setMealKcal(e.target.value)}
                    placeholder="450"
                    className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400] text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">PROTEIN (G)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="200"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(e.target.value)}
                    placeholder="30"
                    className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400] text-center"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="text-xs font-mono font-semibold text-[#c4c9ac] hover:text-[#e5e2e1] px-4 py-2 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="text-xs font-mono font-bold bg-[#c3f400] text-[#161e00] px-5 py-2.5 rounded-xl hover:bg-[#abd600] cursor-pointer"
                >
                  LOG MEAL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
