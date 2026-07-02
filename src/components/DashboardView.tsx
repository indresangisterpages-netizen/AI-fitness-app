import React, { useState } from "react";
import { Flame, Droplet, Activity, CheckSquare, Sparkles, LogIn, Plus, Play, Info, Coffee, Salad, Moon } from "lucide-react";
import { Task, Meal, Workout, UserStats, MealType } from "../types";

interface DashboardViewProps {
  stats: UserStats;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  meals: Meal[];
  activeWorkout: Workout;
  onNavigate: (view: string) => void;
  onLogWater: (amount: number) => void;
  onToggleTask: (id: string) => void;
  onLogWeight: (weight: number) => void;
  onStartWorkoutNow: () => void;
}

export default function DashboardView({
  stats,
  tasks,
  setTasks,
  meals,
  activeWorkout,
  onNavigate,
  onLogWater,
  onToggleTask,
  onLogWeight,
  onStartWorkoutNow,
}: DashboardViewProps) {
  const [newWeight, setNewWeight] = useState("");
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(newWeight);
    if (!isNaN(w) && w > 30 && w < 250) {
      onLogWeight(w);
      setNewWeight("");
      setShowWeightModal(false);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle.trim(),
        completed: false,
      };
      setTasks((prev) => [...prev, newTask]);
      setNewTaskTitle("");
    }
  };

  // Find meals of types
  const breakfast = meals.find((m) => m.type === MealType.BREAKFAST);
  const lunch = meals.find((m) => m.type === MealType.LUNCH);
  const dinner = meals.find((m) => m.type === MealType.DINNER);

  // Pre-calculated weight trends
  const maxWeight = Math.max(...stats.weightTrend.map((d) => d.weight), 80);
  const minWeight = Math.min(...stats.weightTrend.map((d) => d.weight), 75);

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl p-8 glass-card border-[#c3f400]/20 bg-[#1e1e1e] border">
        {/* Abstract background ambient mesh */}
        <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#c3f400]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 w-96 h-96 bg-[#4b8eff]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#c3f400] tracking-tight">
            Welcome back, Alex.
          </h2>
          <div className="mt-4 flex items-start gap-3 max-w-2xl">
            <span className="text-3xl text-[#c3f400] leading-none select-none font-serif">“</span>
            <p className="font-sans text-lg text-[#e5e2e1] italic leading-relaxed">
              "The only limit to your physical evolution is the ghost of your past efforts. Today, we recalibrate for peak performance." —{" "}
              <span className="text-[#c3f400] font-bold">Coach AI</span>
            </p>
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bento Column - 8 Wide */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Summary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Calories Card */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-48 bg-[#1E1E1E] hover:border-[#c3f400]/40 transition-all duration-300">
              <div className="flex justify-between items-start">
                <span className="text-[#c3f400] p-2 bg-[#c3f400]/10 rounded-lg">
                  <Flame size={20} className="fill-current" />
                </span>
                <span className="font-mono text-xs text-[#c4c9ac] tracking-wider uppercase">CALORIES</span>
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-black text-[#ffffff]">
                    {stats.calories.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#c4c9ac] font-mono">kcal</span>
                </div>
                {/* Progress track */}
                <div className="w-full bg-[#353534] h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#4b8eff] to-[#c3f400] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((stats.calories / stats.calorieGoal) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="font-mono text-[9px] text-[#c4c9ac]">
                    {Math.round((stats.calories / stats.calorieGoal) * 100)}% CONSUMED
                  </p>
                  <p className="font-mono text-[9px] text-[#c4c9ac] tracking-wider">
                    GOAL: {stats.calorieGoal} KCAL
                  </p>
                </div>
              </div>
            </div>

            {/* Hydration Card */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-48 bg-[#1E1E1E] hover:border-[#4b8eff]/40 transition-all duration-300">
              <div className="flex justify-between items-start">
                <span className="text-[#4b8eff] p-2 bg-[#4b8eff]/10 rounded-lg">
                  <Droplet size={20} className="fill-current" />
                </span>
                <span className="font-mono text-xs text-[#c4c9ac] tracking-wider uppercase">HYDRATION</span>
              </div>
              <div className="mt-2">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-display text-3xl font-black text-[#ffffff]">{stats.hydration.toFixed(1)}</span>
                    <span className="text-sm font-sans text-[#c4c9ac]">L</span>
                  </div>
                  {/* Water Quick Addition */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => onLogWater(0.25)}
                      className="text-[9px] font-mono bg-[#4b8eff]/10 hover:bg-[#4b8eff]/20 text-[#4b8eff] px-1.5 py-1 rounded cursor-pointer transition-colors"
                    >
                      +250ml
                    </button>
                    <button
                      onClick={() => onLogWater(0.5)}
                      className="text-[9px] font-mono bg-[#4b8eff]/10 hover:bg-[#4b8eff]/20 text-[#4b8eff] px-1.5 py-1 rounded cursor-pointer transition-colors"
                    >
                      +500ml
                    </button>
                  </div>
                </div>

                {/* Progress indicators segmented */}
                <div className="flex gap-1.5 mt-3">
                  {[1, 2, 3, 4, 5, 6].map((idx) => {
                    const threshold = idx * 0.5;
                    const filled = stats.hydration >= threshold;
                    return (
                      <div
                        key={idx}
                        className={`h-2 w-full rounded-full transition-all duration-300 ${
                          filled ? "bg-[#4b8eff]" : "bg-[#353534]"
                        }`}
                      />
                    );
                  })}
                </div>
                <p className="font-mono text-[9px] mt-2 text-[#c4c9ac] text-right">
                  GOAL: {stats.hydrationGoal.toFixed(1)}L
                </p>
              </div>
            </div>

            {/* Weight Trend */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-48 bg-[#1E1E1E] hover:border-[#c3f400]/40 transition-all duration-300 relative group">
              <div className="flex justify-between items-start">
                <span className="text-[#adc6ff] p-2 bg-[#adc6ff]/10 rounded-lg">
                  <Activity size={20} />
                </span>
                <span className="font-mono text-xs text-[#c4c9ac] tracking-wider uppercase">WEIGHT TREND</span>
              </div>
              
              {/* Custom SVG/HTML Micro graph */}
              <div className="h-14 w-full flex items-end justify-between gap-1.5 px-1 mt-2">
                {stats.weightTrend.map((d, i) => {
                  // Percentage height relative to peak
                  const range = maxWeight - minWeight || 5;
                  const heightPercent = Math.max(
                    15,
                    Math.round(((d.weight - minWeight) / range) * 80 + 20)
                  );
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center group/bar"
                    >
                      {/* Bar fill */}
                      <div
                        className="bg-[#c3f400]/60 hover:bg-[#c3f400] w-full rounded-t-sm transition-all duration-300 relative"
                        style={{ height: `${heightPercent}%` }}
                      >
                        {/* Tooltip */}
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 bg-black text-[#e5e2e1] font-mono text-[8px] px-1 rounded opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                          {d.weight}kg
                        </span>
                      </div>
                      <span className="text-[7px] font-mono text-[#c4c9ac] mt-1 select-none">
                        {d.date.split("-")[1]}/{d.date.split("-")[2]}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mt-1">
                <p className="font-mono text-[10px] text-[#c3f400] tracking-tight">
                  -2.4kg THIS MONTH
                </p>
                <button
                  onClick={() => setShowWeightModal(true)}
                  className="text-[9px] font-mono text-[#adc6ff] hover:underline hover:text-[#ffffff] cursor-pointer"
                >
                  LOG WEIGHT
                </button>
              </div>
            </div>

          </div>

          {/* Daily Tasks Card */}
          <div className="glass-card rounded-2xl p-6 bg-[#1E1E1E]">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <CheckSquare size={20} className="text-[#c3f400]" />
                <h3 className="font-display font-bold text-[#ffffff] text-xl">Daily Tasks</h3>
              </div>
              <span className="font-mono text-xs text-[#c3f400] px-2 py-0.5 bg-[#c3f400]/10 rounded-full">
                {completedTasksCount} / {tasks.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <label
                  key={task.id}
                  className="flex items-center gap-4 cursor-pointer group p-3 rounded-xl bg-[#131313]/50 border border-[#2c2c2e]/50 hover:border-[#c3f400]/30 transition-all"
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    className="w-5 h-5 rounded bg-[#353534] border-[#444933] text-[#c3f400] focus:ring-[#c3f400] cursor-pointer transition-all"
                  />
                  <span
                    className={`font-sans text-sm transition-all duration-300 ${
                      task.completed
                        ? "text-[#c4c9ac] line-through opacity-60"
                        : "text-[#e5e2e1] group-hover:text-[#c3f400]"
                    }`}
                  >
                    {task.title}
                  </span>
                </label>
              ))}
            </div>

            {/* Simple Add Task Inline Form */}
            <form onSubmit={handleAddTask} className="mt-5 flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Enter custom fitness task..."
                className="flex-1 bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-2 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
              />
              <button
                type="submit"
                className="bg-[#c3f400]/10 hover:bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30 rounded-xl px-4 py-2 text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Plus size={14} /> ADD
              </button>
            </form>
          </div>

          {/* AI Suggestions Card */}
          <div className="glass-card rounded-2xl p-6 ai-insight-glow relative overflow-hidden bg-[#1E1E1E] border border-blue-500/20">
            {/* Ambient psychology icon */}
            <div className="absolute -right-10 -top-10 opacity-5 select-none pointer-events-none text-[#4b8eff]">
              <Sparkles size={160} />
            </div>
            
            <div className="flex items-center gap-2 mb-4 text-[#4b8eff]">
              <Sparkles size={18} className="animate-pulse" />
              <h3 className="font-mono text-xs font-bold tracking-widest">AI INSIGHT</h3>
            </div>
            
            <p className="font-sans text-sm md:text-base text-[#e5e2e1] leading-relaxed">
              Alex, your resting heart rate was <span className="text-[#4b8eff] font-semibold">5% higher</span> this morning. 
              Recovery metrics suggest avoiding 1RM PR attempts today. Focus on{" "}
              <span className="text-[#c3f400] font-bold">form, control and metabolic stress</span> instead of heavy triples.
              I recommend keeping rest blocks down to 75s.
            </p>
            
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => onNavigate("workouts")}
                className="text-xs font-mono font-bold text-[#4b8eff] border border-[#4b8eff]/30 px-4 py-2 rounded-lg hover:bg-[#4b8eff]/10 cursor-pointer transition-colors"
              >
                Adjust Plan
              </button>
              <button
                onClick={() => onNavigate("coach")}
                className="text-xs font-mono text-[#c4c9ac] px-3 py-2 rounded-lg hover:text-[#e5e2e1] cursor-pointer"
              >
                Ask Coach Details
              </button>
            </div>
          </div>

        </div>

        {/* Today's Workout Sidebar (4 Columns) */}
        <div className="lg:col-span-4 glass-card rounded-2xl overflow-hidden flex flex-col bg-[#1E1E1E] border border-[#2c2c2e]">
          <div className="h-48 relative overflow-hidden">
            <img
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              alt="Heavy dumbbell on floor"
              referrerPolicy="no-referrer"
              src={activeWorkout.image}
            />
            {/* Premium moody gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6">
              <span className="bg-[#c3f400]/20 border border-[#c3f400]/40 text-[#c3f400] font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-widest">
                {activeWorkout.intensity}
              </span>
              <h3 className="font-display text-2xl font-black text-[#ffffff] mt-1 tracking-tight">
                {activeWorkout.title}
              </h3>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-mono text-[10px] text-[#c4c9ac] tracking-widest mb-2 uppercase">TODAY'S TARGETS</h4>
              {activeWorkout.exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between border-b border-[#2c2c2e]/80 pb-2 hover:border-[#c3f400]/20 transition-all"
                >
                  <span className="font-sans text-sm text-[#e5e2e1]">{exercise.name}</span>
                  <span className="font-mono text-xs text-[#c3f400] font-bold">
                    {exercise.sets} x {exercise.reps}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onStartWorkoutNow}
              className="mt-8 w-full py-4 bg-[#c3f400] text-[#161e00] font-display font-black rounded-xl hover:bg-[#abd600] active:scale-[0.98] transition-all neon-glow flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play size={16} className="fill-current" />
              START WORKOUT
            </button>
          </div>
        </div>
      </div>

      {/* Today's Meals Section */}
      <section className="glass-card rounded-2xl p-6 bg-[#1E1E1E]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Salad size={20} className="text-[#c3f400]" />
            <h3 className="font-display font-bold text-[#ffffff] text-xl">Today's Meals</h3>
          </div>
          <button
            onClick={() => onNavigate("nutrition")}
            className="font-mono text-xs text-[#4b8eff] hover:underline cursor-pointer"
          >
            + LOG MEAL
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Breakfast */}
          <div className="group rounded-xl border border-[#2c2c2e]/60 bg-[#131313]/40 p-3 hover:border-[#c3f400]/30 transition-all">
            {breakfast ? (
              <>
                <div className="relative rounded-xl overflow-hidden h-36 mb-3">
                  <img
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    alt={breakfast.name}
                    referrerPolicy="no-referrer"
                    src={breakfast.image}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info size={18} className="text-[#ffffff]" />
                  </div>
                </div>
                <p className="font-mono text-[9px] text-[#c3f400] font-bold mb-1">BREAKFAST</p>
                <h4 className="font-sans font-bold text-[#e5e2e1] text-sm truncate">{breakfast.name}</h4>
                <p className="font-mono text-[9px] text-[#c4c9ac] mt-1">
                  {breakfast.kCal} KCAL · {breakfast.protein}G PROTEIN
                </p>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center items-center py-6 text-center text-[#c4c9ac]">
                <Coffee size={24} className="opacity-40 mb-2" />
                <p className="text-xs">No breakfast logged</p>
                <button
                  onClick={() => onNavigate("nutrition")}
                  className="text-[10px] text-[#c3f400] font-mono mt-1 hover:underline cursor-pointer"
                >
                  Log Breakfast
                </button>
              </div>
            )}
          </div>

          {/* Lunch */}
          <div className="group rounded-xl border border-[#2c2c2e]/60 bg-[#131313]/40 p-3 hover:border-[#c3f400]/30 transition-all">
            {lunch ? (
              <>
                <div className="relative rounded-xl overflow-hidden h-36 mb-3">
                  <img
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    alt={lunch.name}
                    referrerPolicy="no-referrer"
                    src={lunch.image}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info size={18} className="text-[#ffffff]" />
                  </div>
                </div>
                <p className="font-mono text-[9px] text-[#c3f400] font-bold mb-1">LUNCH</p>
                <h4 className="font-sans font-bold text-[#e5e2e1] text-sm truncate">{lunch.name}</h4>
                <p className="font-mono text-[9px] text-[#c4c9ac] mt-1">
                  {lunch.kCal} KCAL · {lunch.protein}G PROTEIN
                </p>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center items-center py-6 text-center text-[#c4c9ac]">
                <Salad size={24} className="opacity-40 mb-2" />
                <p className="text-xs">No lunch logged</p>
                <button
                  onClick={() => onNavigate("nutrition")}
                  className="text-[10px] text-[#c3f400] font-mono mt-1 hover:underline cursor-pointer"
                >
                  Log Lunch
                </button>
              </div>
            )}
          </div>

          {/* Dinner */}
          <div className="group rounded-xl border border-[#2c2c2e]/60 bg-[#131313]/40 p-3 hover:border-[#c3f400]/30 transition-all">
            {dinner ? (
              <>
                <div className="relative rounded-xl overflow-hidden h-36 mb-3">
                  <img
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                    alt={dinner.name}
                    referrerPolicy="no-referrer"
                    src={dinner.image}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info size={18} className="text-[#ffffff]" />
                  </div>
                </div>
                <p className="font-mono text-[9px] text-[#c3f400] font-bold mb-1">DINNER</p>
                <h4 className="font-sans font-bold text-[#e5e2e1] text-sm truncate">{dinner.name}</h4>
                <p className="font-mono text-[9px] text-[#c4c9ac] mt-1">
                  {dinner.kCal} KCAL · {dinner.protein}G PROTEIN
                </p>
              </>
            ) : (
              <div className="h-full flex flex-col justify-center items-center py-6 text-center text-[#c4c9ac]">
                <Moon size={24} className="opacity-40 mb-2" />
                <p className="text-xs">Dinner Not Logged</p>
                <button
                  onClick={() => onNavigate("nutrition")}
                  className="text-[10px] text-[#c3f400] font-mono mt-1 hover:underline cursor-pointer"
                >
                  Log Dinner
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Weight Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] border border-[#2c2c2e] p-6 rounded-2xl w-full max-w-sm">
            <h4 className="font-display font-bold text-[#ffffff] text-lg mb-4">Log Current Weight</h4>
            <form onSubmit={handleWeightSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">WEIGHT (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="e.g. 76.5"
                  className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
                />
              </div>
              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowWeightModal(false)}
                  className="text-xs font-mono font-semibold text-[#c4c9ac] hover:text-[#e5e2e1] px-4 py-2 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="text-xs font-mono font-bold bg-[#c3f400] text-[#161e00] px-4 py-2 rounded-xl hover:bg-[#abd600] cursor-pointer"
                >
                  LOG ENTRY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
