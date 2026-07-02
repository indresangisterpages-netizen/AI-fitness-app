import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import CoachAIView from "./components/CoachAIView";
import WorkoutsView from "./components/WorkoutsView";
import NutritionView from "./components/NutritionView";
import SettingsView from "./components/SettingsView";
import SupportView from "./components/SupportView";
import { Task, Meal, Workout, CoachMessage, UserStats, MealType, WorkoutIntensity } from "./types";
import { LayoutDashboard, Bot, Dumbbell, Utensils } from "lucide-react";

const INITIAL_STATS: UserStats = {
  calories: 1840,
  calorieGoal: 2500,
  hydration: 2.2,
  hydrationGoal: 3.0,
  weightTrend: [
    { date: "2026-06-26", weight: 77.2 },
    { date: "2026-06-27", weight: 77.0 },
    { date: "2026-06-28", weight: 76.9 },
    { date: "2026-06-29", weight: 76.8 },
    { date: "2026-06-30", weight: 76.5 },
    { date: "2026-07-01", weight: 76.3 },
    { date: "2026-07-02", weight: 76.1 },
  ],
  level: 42,
  experience: 40,
};

const INITIAL_TASKS: Task[] = [
  { id: "task-1", title: "Drink 3L Water", completed: false },
  { id: "task-2", title: "8,000 Steps", completed: true },
  { id: "task-3", title: "Sleep 8 Hours", completed: false },
  { id: "task-4", title: "Post-Workout Stretch", completed: false },
];

const INITIAL_MEALS: Meal[] = [
  {
    id: "meal-1",
    name: "Avocado & Egg Bowl",
    kCal: 420,
    protein: 24,
    type: MealType.BREAKFAST,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAxEYO3LVbykOMVdOc3viMf414OaeEXKzcUd2I6tWmlzXcZUFbKEga-ZKcKTpxOZazX_nGAIrNdDUH0GYsJfDIW-_OlM7a3PipN3dG_0tdFJDICMV0mWuLI7N19qYZHssuWMWjDHBfFf_YA7oLWXwFsjNeFlwkRcGqwbn8FVVebwjiJK42-7-yapt1fFSRxWM29ihtvG3vP6CR2yf2xlyXJ3Z_DjHyzt0QLfq3RLlTSmwojAvRhL83",
  },
  {
    id: "meal-2",
    name: "Quinoa Chicken Salad",
    kCal: 580,
    protein: 45,
    type: MealType.LUNCH,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDu1uQFd4kft5Gr1nPO3h1-f69uIEH7N2Q5Ck_EL_pMYLNb0RDerV37ftlZwUzwgDQrYQu4y95I-EkhYw130Td_eyNpt-fo3qPcvvlNa8zc-o72F3YnGKE4QdpeqYtD2TpDHhz_d9VDG_2TRI7hTFZvYpuKQHkWuDvLGSS80UsKOtPN_512JcbakI4aMTmS7zc4BKcHAb2zVtsb8m1BMDv5W2pZMpjl9zFripviynPZ-dw71dEPHr7z",
  },
];

const INITIAL_WORKOUTS: Workout[] = [
  {
    id: "workout-1",
    title: "Push Day A",
    intensity: WorkoutIntensity.INTENSE,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXpod6SQMDCfFfkf0dz2wiveC0jbmCre3i_yCPexnIKhiSBDdYDL0L_hYTFvdRZXkiRB7x4PJTJLrEKFdix7l54hB16bbeQ5NyZI8awR5XdTpnpqvG_YMmMkV1KOE0kHfTCGdhYIJVAJeoy0_XhS3u1R5bD7-T4ZCtEIpEO3UkAcVOvzUIQ1kEI70cZDtxbKWnJWKhh7jiljHQeaMJTrMso8XYj1UziSsD2ND7vGBHvx4Jd47xPPPm",
    exercises: [
      { id: "ex-1", name: "Bench Press", sets: 4, reps: "8-10" },
      { id: "ex-2", name: "Overhead Press", sets: 3, reps: "12" },
      { id: "ex-3", name: "Incline DB Fly", sets: 3, reps: "15" },
      { id: "ex-4", name: "Tricep Pushdowns", sets: 4, reps: "12" },
    ],
  },
  {
    id: "workout-2",
    title: "Pull Day B",
    intensity: WorkoutIntensity.MODERATE,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXpod6SQMDCfFfkf0dz2wiveC0jbmCre3i_yCPexnIKhiSBDdYDL0L_hYTFvdRZXkiRB7x4PJTJLrEKFdix7l54hB16bbeQ5NyZI8awR5XdTpnpqvG_YMmMkV1KOE0kHfTCGdhYIJVAJeoy0_XhS3u1R5bD7-T4ZCtEIpEO3UkAcVOvzUIQ1kEI70cZDtxbKWnJWKhh7jiljHQeaMJTrMso8XYj1UziSsD2ND7vGBHvx4Jd47xPPPm",
    exercises: [
      { id: "ex-5", name: "Deadlift", sets: 4, reps: "5" },
      { id: "ex-6", name: "Lat Pulldown", sets: 3, reps: "10" },
      { id: "ex-7", name: "Seated Cable Row", sets: 3, reps: "12" },
      { id: "ex-8", name: "Incline Bicep Curls", sets: 3, reps: "15" },
    ],
  },
  {
    id: "workout-3",
    title: "Leg Day C",
    intensity: WorkoutIntensity.INTENSE,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXpod6SQMDCfFfkf0dz2wiveC0jbmCre3i_yCPexnIKhiSBDdYDL0L_hYTFvdRZXkiRB7x4PJTJLrEKFdix7l54hB16bbeQ5NyZI8awR5XdTpnpqvG_YMmMkV1KOE0kHfTCGdhYIJVAJeoy0_XhS3u1R5bD7-T4ZCtEIpEO3UkAcVOvzUIQ1kEI70cZDtxbKWnJWKhh7jiljHQeaMJTrMso8XYj1UziSsD2ND7vGBHvx4Jd47xPPPm",
    exercises: [
      { id: "ex-9", name: "Barbell Squats", sets: 4, reps: "8-10" },
      { id: "ex-10", name: "Romanian Deadlift", sets: 3, reps: "10" },
      { id: "ex-11", name: "Leg Press", sets: 3, reps: "12" },
      { id: "ex-12", name: "Standing Calf Raises", sets: 4, reps: "15" },
    ],
  },
];

const INITIAL_CHAT: CoachMessage[] = [
  {
    id: "msg-init",
    sender: "ai",
    text: "Welcome back, Alex. Your Level 42 Strength profile is looking highly optimized. I detected your resting heart rate was slightly elevated today—prioritize quality form, target ranges, and solid recovery dinner macros. How can I help you adjust your active training plan today?",
    timestamp: "10:00 AM",
  },
];

export default function App() {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Load from local storage or set defaults
  const [stats, setStats] = useState<UserStats>(() => {
    const cached = localStorage.getItem("aifit_stats");
    return cached ? JSON.parse(cached) : INITIAL_STATS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const cached = localStorage.getItem("aifit_tasks");
    return cached ? JSON.parse(cached) : INITIAL_TASKS;
  });

  const [meals, setMeals] = useState<Meal[]>(() => {
    const cached = localStorage.getItem("aifit_meals");
    return cached ? JSON.parse(cached) : INITIAL_MEALS;
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const cached = localStorage.getItem("aifit_workouts");
    return cached ? JSON.parse(cached) : INITIAL_WORKOUTS;
  });

  const [chatHistory, setChatHistory] = useState<CoachMessage[]>(() => {
    const cached = localStorage.getItem("aifit_chat");
    return cached ? JSON.parse(cached) : INITIAL_CHAT;
  });

  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem("aifit_stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("aifit_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("aifit_meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("aifit_workouts", JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem("aifit_chat", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Sync Drink 3L Water task with stats.hydration metric
  useEffect(() => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === "task-1") {
          return { ...t, completed: stats.hydration >= 3.0 };
        }
        return t;
      })
    );
  }, [stats.hydration]);

  // Action: Log Water intake
  const handleLogWater = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      hydration: Math.min(prev.hydration + amount, 10),
    }));
  };

  // Action: Toggle Task State
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Action: Log Weight
  const handleLogWeight = (weight: number) => {
    const todayStr = new Date().toISOString().split("T")[0];
    setStats((prev) => {
      // replace last or append new entry
      const existingIdx = prev.weightTrend.findIndex((d) => d.date === todayStr);
      let newTrend = [...prev.weightTrend];
      if (existingIdx !== -1) {
        newTrend[existingIdx].weight = weight;
      } else {
        newTrend.push({ date: todayStr, weight });
        if (newTrend.length > 7) newTrend.shift(); // keep only last 7
      }

      return {
        ...prev,
        weightTrend: newTrend,
      };
    });
  };

  // Action: Log Meal nutrition to stats
  const handleLogMealCalories = (kcal: number) => {
    setStats((prev) => ({
      ...prev,
      calories: prev.calories + kcal,
    }));
  };

  // Action: Finish Active Workout (level up EXP, calories, redirect)
  const handleWorkoutComplete = (
    kcalBurned: number,
    expGained: number,
    durationMinutes: number,
    name: string
  ) => {
    setStats((prev) => {
      let newExp = prev.experience + expGained;
      let newLvl = prev.level;
      if (newExp >= 100) {
        newLvl += Math.floor(newExp / 100);
        newExp = newExp % 100;
      }
      return {
        ...prev,
        level: newLvl,
        experience: newExp,
      };
    });

    // Automatically check off relevant workout task if incomplete
    setTasks((prev) =>
      prev.map((t) => (t.id === "task-4" ? { ...t, completed: true } : t))
    );

    alert(`CONGRATULATIONS!\nYou completed: "${name}" in ${durationMinutes} minutes!\n🔥 Burned: ${kcalBurned} kCal\n⭐ Gained: ${expGained} EXP!`);
  };

  const handleStartWorkoutNow = () => {
    setActiveView("workouts");
    setActiveWorkoutId("workout-1"); // Starts Push Day A by default
  };

  // Shared settings actions
  const setCalorieGoal = (goal: number) => {
    setStats((prev) => ({ ...prev, calorieGoal: goal }));
  };

  const setHydrationGoal = (goal: number) => {
    setStats((prev) => ({ ...prev, hydrationGoal: goal }));
  };

  const setProteinGoal = (goal: number) => {
    // Storing in stat variables indirectly or directly (we can add a property or use dynamic calculations)
    // For simpler implementation we keep proteinGoal inside Settings component or save it locally
    localStorage.setItem("protein_goal", goal.toString());
  };

  const getProteinGoal = () => {
    const val = localStorage.getItem("protein_goal");
    return val ? parseInt(val) : 180;
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e5e2e1] font-sans antialiased">
      {/* SideNavBar Layout */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onStartWorkout={handleStartWorkoutNow}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Top App Bar Header */}
      <Header
        activeView={activeView}
        level={stats.level}
        experience={stats.experience}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Container Stage */}
      <main className="md:ml-64 p-6 md:p-10 max-w-[1280px] mx-auto pb-32 md:pb-12">
        {activeView === "dashboard" && (
          <DashboardView
            stats={stats}
            tasks={tasks}
            setTasks={setTasks}
            meals={meals}
            activeWorkout={workouts[0] || INITIAL_WORKOUTS[0]}
            onNavigate={setActiveView}
            onLogWater={handleLogWater}
            onToggleTask={handleToggleTask}
            onLogWeight={handleLogWeight}
            onStartWorkoutNow={handleStartWorkoutNow}
          />
        )}

        {activeView === "coach" && (
          <CoachAIView chatHistory={chatHistory} setChatHistory={setChatHistory} />
        )}

        {activeView === "workouts" && (
          <WorkoutsView
            workouts={workouts}
            setWorkouts={setWorkouts}
            activeWorkoutId={activeWorkoutId}
            setActiveWorkoutId={setActiveWorkoutId}
            onWorkoutComplete={handleWorkoutComplete}
          />
        )}

        {activeView === "nutrition" && (
          <NutritionView
            meals={meals}
            setMeals={setMeals}
            calorieGoal={stats.calorieGoal}
            proteinGoal={getProteinGoal()}
            onLogMealCalories={handleLogMealCalories}
          />
        )}

        {activeView === "settings" && (
          <SettingsView
            calorieGoal={stats.calorieGoal}
            setCalorieGoal={setCalorieGoal}
            hydrationGoal={stats.hydrationGoal}
            setHydrationGoal={setHydrationGoal}
            proteinGoal={getProteinGoal()}
            setProteinGoal={setProteinGoal}
          />
        )}

        {activeView === "support" && <SupportView />}
      </main>

      {/* Responsive Bottom Navigation bar for Mobile screen sizes */}
      <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-4 pt-2 md:hidden bg-[#1c1b1b]/95 border-t border-[#444933] backdrop-blur-md shadow-lg rounded-t-xl">
        <button
          onClick={() => setActiveView("dashboard")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeView === "dashboard" ? "bg-[#c3f400]/10 text-[#c3f400]" : "text-[#c4c9ac]"
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="font-mono text-[9px] mt-0.5 font-bold tracking-wider">HOME</span>
        </button>

        <button
          onClick={() => setActiveView("coach")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeView === "coach" ? "bg-[#c3f400]/10 text-[#c3f400]" : "text-[#c4c9ac]"
          }`}
        >
          <Bot size={20} />
          <span className="font-mono text-[9px] mt-0.5 font-bold tracking-wider">AI COACH</span>
        </button>

        <button
          onClick={() => setActiveView("workouts")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeView === "workouts" ? "bg-[#c3f400]/10 text-[#c3f400]" : "text-[#c4c9ac]"
          }`}
        >
          <Dumbbell size={20} />
          <span className="font-mono text-[9px] mt-0.5 font-bold tracking-wider">PLANS</span>
        </button>

        <button
          onClick={() => setActiveView("nutrition")}
          className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
            activeView === "nutrition" ? "bg-[#c3f400]/10 text-[#c3f400]" : "text-[#c4c9ac]"
          }`}
        >
          <Utensils size={20} />
          <span className="font-mono text-[9px] mt-0.5 font-bold tracking-wider">DIET</span>
        </button>
      </nav>
    </div>
  );
}
