import React, { useState, useEffect, useRef } from "react";
import { Play, Plus, Trash2, Clock, Check, Star, CheckSquare, Award, Flame, X, Dumbbell } from "lucide-react";
import { Workout, Exercise, WorkoutIntensity } from "../types";

interface WorkoutsViewProps {
  workouts: Workout[];
  setWorkouts: React.Dispatch<React.SetStateAction<Workout[]>>;
  activeWorkoutId: string | null;
  setActiveWorkoutId: (id: string | null) => void;
  onWorkoutComplete: (kcalBurned: number, expGained: number, durationMinutes: number, name: string) => void;
}

interface CompletedWorkoutLog {
  id: string;
  name: string;
  date: string;
  durationMinutes: number;
  kcalBurned: number;
}

export default function WorkoutsView({
  workouts,
  setWorkouts,
  activeWorkoutId,
  setActiveWorkoutId,
  onWorkoutComplete,
}: WorkoutsViewProps) {
  // Active timer and exercise completion states
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Completed set map: record completed sets for each exercise: key: "exId-setIdx", value: boolean
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});

  // Weight / reps trackers per exercise-set: key: "exId-setIdx", value: number
  const [exerciseLoads, setExerciseLoads] = useState<Record<string, number>>({});

  // History log of completed workouts
  const [historyLog, setHistoryLog] = useState<CompletedWorkoutLog[]>([
    { id: "log-1", name: "Pull Day B", date: "2026-06-30", durationMinutes: 45, kcalBurned: 350 },
    { id: "log-2", name: "Leg Day C", date: "2026-06-28", durationMinutes: 52, kcalBurned: 480 },
  ]);

  // Modal / Editor state to create routine
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newRoutineIntensity, setNewRoutineIntensity] = useState<WorkoutIntensity>(WorkoutIntensity.MODERATE);
  const [newRoutineExercises, setNewRoutineExercises] = useState<Omit<Exercise, "id">[]>([
    { name: "Incline Bench Press", sets: 4, reps: "8-10" },
  ]);

  // Track active workout details
  const activeWorkout = workouts.find((w) => w.id === activeWorkoutId);

  // Format Stopwatch timer
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Stopwatch timer controller
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Start active workout
  const handleStartWorkout = (id: string) => {
    setActiveWorkoutId(id);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setCompletedSets({});
    setExerciseLoads({});
  };

  // Toggle dynamic exercise sets checklist
  const handleToggleSet = (exerciseId: string, setIdx: number) => {
    const key = `${exerciseId}-${setIdx}`;
    setCompletedSets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Modify target loads
  const handleModifyLoad = (exerciseId: string, setIdx: number, increment: number) => {
    const key = `${exerciseId}-${setIdx}`;
    const currentLoad = exerciseLoads[key] || 60; // default 60kg starting weight
    setExerciseLoads((prev) => ({
      ...prev,
      [key]: Math.max(0, currentLoad + increment),
    }));
  };

  // Finish active workout
  const handleFinishWorkout = () => {
    if (!activeWorkout) return;

    setIsTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate calories burned: intensity factor * minutes
    const minutes = Math.ceil(timerSeconds / 60) || 1;
    let factor = 5;
    if (activeWorkout.intensity === WorkoutIntensity.LIGHT) factor = 4;
    if (activeWorkout.intensity === WorkoutIntensity.INTENSE) factor = 8;
    const kCalBurned = minutes * factor;
    const expGained = 40 + minutes * 2; // base 40 EXP + 2 EXP/min

    // Trigger parent callback to level up and add calories
    onWorkoutComplete(kCalBurned, expGained, minutes, activeWorkout.title);

    // Append history
    const newLog: CompletedWorkoutLog = {
      id: `log-${Date.now()}`,
      name: activeWorkout.title,
      date: new Date().toISOString().split("T")[0],
      durationMinutes: minutes,
      kcalBurned: kCalBurned,
    };
    setHistoryLog((prev) => [newLog, ...prev]);

    // Cleanup active states
    setActiveWorkoutId(null);
    setTimerSeconds(0);
  };

  // Create Custom Routine
  const handleAddExerciseRow = () => {
    setNewRoutineExercises((prev) => [...prev, { name: "", sets: 3, reps: "10" }]);
  };

  const handleRemoveExerciseRow = (index: number) => {
    setNewRoutineExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExerciseChange = (index: number, field: string, value: any) => {
    setNewRoutineExercises((prev) =>
      prev.map((ex, i) => (i === index ? { ...ex, [field]: value } : ex))
    );
  };

  const handleSubmitRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;

    const validatedExercises: Exercise[] = newRoutineExercises
      .filter((ex) => ex.name.trim())
      .map((ex, i) => ({
        id: `ex-${Date.now()}-${i}`,
        name: ex.name.trim(),
        sets: Number(ex.sets) || 3,
        reps: ex.reps.trim() || "10",
      }));

    if (validatedExercises.length === 0) return;

    const newWorkout: Workout = {
      id: `workout-${Date.now()}`,
      title: newRoutineName.trim(),
      intensity: newRoutineIntensity,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXpod6SQMDCfFfkf0dz2wiveC0jbmCre3i_yCPexnIKhiSBDdYDL0L_hYTFvdRZXkiRB7x4PJTJLrEKFdix7l54hB16bbeQ5NyZI8awR5XdTpnpqvG_YMmMkV1KOE0kHfTCGdhYIJVAJeoy0_XhS3u1R5bD7-T4ZCtEIpEO3UkAcVOvzUIQ1kEI70cZDtxbKWnJWKhh7jiljHQeaMJTrMso8XYj1UziSsD2ND7vGBHvx4Jd47xPPPm",
      exercises: validatedExercises,
    };

    setWorkouts((prev) => [...prev, newWorkout]);
    setNewRoutineName("");
    setNewRoutineExercises([{ name: "Incline Bench Press", sets: 4, reps: "8-10" }]);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-10">
      {activeWorkout ? (
        /* ================= ACTIVE WORKOUT PANEL ================= */
        <div className="glass-card rounded-2xl overflow-hidden bg-[#1E1E1E] border border-[#c3f400]/20 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#2c2c2e]">
            <div>
              <span className="bg-[#c3f400]/20 border border-[#c3f400]/40 text-[#c3f400] font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase">
                {activeWorkout.intensity} MODE ACTIVE
              </span>
              <h3 className="font-display text-3xl font-black text-[#ffffff] mt-1.5 tracking-tight">
                {activeWorkout.title}
              </h3>
            </div>

            {/* Stopwatch timer */}
            <div className="flex items-center gap-4 bg-[#131313] px-6 py-3 rounded-xl border border-[#2c2c2e]">
              <Clock size={22} className="text-[#c3f400]" />
              <div className="text-right">
                <p className="font-mono text-2xl font-black text-[#ffffff]">{formatTime(timerSeconds)}</p>
                <p className="font-mono text-[9px] text-[#c4c9ac] tracking-widest uppercase">ELAPSED TIME</p>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`ml-2 text-[10px] font-mono font-bold px-2.5 py-1 rounded cursor-pointer ${
                  isTimerRunning ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"
                }`}
              >
                {isTimerRunning ? "PAUSE" : "RESUME"}
              </button>
            </div>
          </div>

          {/* Active exercises checklist */}
          <div className="mt-8 space-y-6">
            {activeWorkout.exercises.map((exercise) => (
              <div key={exercise.id} className="bg-[#131313]/60 rounded-xl p-5 border border-[#2c2c2e]/80">
                <h4 className="font-display font-bold text-lg text-[#ffffff] mb-3">{exercise.name}</h4>
                
                {/* Sets checkoff sub-grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {Array.from({ length: exercise.sets }).map((_, setIdx) => {
                    const setKey = `${exercise.id}-${setIdx}`;
                    const isSetChecked = completedSets[setKey] || false;
                    const load = exerciseLoads[setKey] || 60; // 60kg starting default
                    return (
                      <div
                        key={setIdx}
                        className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                          isSetChecked
                            ? "bg-[#c3f400]/5 border-[#c3f400]/40"
                            : "bg-[#1e1e1e] border-[#2c2c2e] hover:border-[#c4c9ac]/30"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="font-mono text-[10px] text-[#c4c9ac]">SET {setIdx + 1}</p>
                          <p className="text-xs text-[#e5e2e1]">{exercise.reps} Reps</p>
                          {/* Weight modifier */}
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="font-mono text-xs font-bold text-[#c3f400]">{load}kg</span>
                            <button
                              onClick={() => handleModifyLoad(exercise.id, setIdx, -2.5)}
                              className="text-[9px] bg-[#2a2a2a] px-1 rounded hover:bg-[#333] text-[#c4c9ac] cursor-pointer"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleModifyLoad(exercise.id, setIdx, 2.5)}
                              className="text-[9px] bg-[#2a2a2a] px-1 rounded hover:bg-[#333] text-[#c4c9ac] cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Interactive custom checklist checkmark */}
                        <button
                          onClick={() => handleToggleSet(exercise.id, setIdx)}
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${
                            isSetChecked
                              ? "bg-[#c3f400] text-[#161e00] border-transparent shadow-[0_0_10px_rgba(195,244,0,0.3)]"
                              : "border-[#444933] hover:border-[#c3f400] text-transparent"
                          }`}
                        >
                          <Check size={16} strokeWidth={3} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#2c2c2e] flex items-center justify-between gap-4">
            <button
              onClick={() => {
                if (confirm("Are you sure you want to discard this workout? Progress will not be logged.")) {
                  setActiveWorkoutId(null);
                  setTimerSeconds(0);
                }
              }}
              className="text-xs font-mono font-bold text-[#c4c9ac] hover:text-[#e5e2e1] px-4 py-3 border border-[#2c2c2e] hover:border-[#444933] rounded-xl cursor-pointer"
            >
              DISCARD
            </button>
            <button
              onClick={handleFinishWorkout}
              className="px-8 py-4 bg-[#c3f400] text-[#161e00] font-display font-black rounded-xl hover:bg-[#abd600] transition-all duration-300 neon-glow hover:shadow-[0_0_20px_rgba(195,244,0,0.45)] flex items-center gap-2 cursor-pointer"
            >
              <Award size={16} />
              FINISH & LOG WORKOUT
            </button>
          </div>
        </div>
      ) : (
        /* ================= CORE ROUTINES LISTING PANEL ================= */
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-extrabold text-[#ffffff] text-2xl tracking-tight">Custom Routines</h3>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#c3f400]/10 hover:bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/30 rounded-xl px-4 py-2 text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Plus size={16} /> CREATE ROUTINE
            </button>
          </div>

          {/* Routine cards list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workouts.map((routine) => (
              <div
                key={routine.id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between bg-[#1E1E1E] border border-[#2c2c2e] hover:border-[#c3f400]/30 group transition-all duration-300"
              >
                <div>
                  <div className="h-32 relative overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 duration-500"
                      alt={routine.title}
                      referrerPolicy="no-referrer"
                      src={routine.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent" />
                    <span className="absolute bottom-3 left-4 bg-black/60 text-[#c3f400] border border-[#c3f400]/30 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                      {routine.intensity}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <h4 className="font-display font-extrabold text-[#ffffff] text-lg truncate tracking-tight">
                      {routine.title}
                    </h4>
                    <p className="font-mono text-[9px] text-[#c4c9ac] tracking-widest uppercase">Target Exercises</p>
                    <div className="space-y-1">
                      {routine.exercises.map((ex) => (
                        <div key={ex.id} className="text-xs text-[#e5e2e1] flex justify-between">
                          <span className="opacity-80 truncate">{ex.name}</span>
                          <span className="text-[#c3f400] font-mono shrink-0 ml-1">
                            {ex.sets}x{ex.reps}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleStartWorkout(routine.id)}
                    className="w-full py-2.5 bg-[#c3f400]/10 hover:bg-[#c3f400] text-[#c3f400] hover:text-[#161e00] font-mono text-xs font-black rounded-xl border border-[#c3f400]/30 hover:border-transparent transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play size={12} className="fill-current" />
                    START TRAINING
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Workout Completed History Log */}
          <section className="glass-card rounded-2xl p-6 bg-[#1E1E1E]">
            <h3 className="font-display font-bold text-[#ffffff] text-xl mb-6 flex items-center gap-2">
              <CheckSquare size={18} className="text-[#c3f400]" />
              Completed History Logs
            </h3>
            
            <div className="space-y-3">
              {historyLog.map((log) => (
                <div
                  key={log.id}
                  className="bg-[#131313]/60 rounded-xl p-4 border border-[#2c2c2e]/50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#c3f400]/10 flex items-center justify-center text-[#c3f400]">
                      <Dumbbell size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#e5e2e1]">{log.name}</h4>
                      <p className="font-mono text-[9px] text-[#c4c9ac] mt-0.5">{log.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-6 text-right font-mono">
                    <div>
                      <p className="text-sm font-bold text-[#ffffff]">{log.durationMinutes} mins</p>
                      <p className="text-[8px] text-[#c4c9ac] tracking-widest uppercase">DURATION</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#c3f400]">{log.kcalBurned} kCal</p>
                      <p className="text-[8px] text-[#c4c9ac] tracking-widest uppercase">BURNED</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Routine Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-[#1e1e1e] border border-[#2c2c2e] p-6 rounded-2xl w-full max-w-lg my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-display font-bold text-[#ffffff] text-xl">Create Custom Routine</h4>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#c4c9ac] hover:text-[#e5e2e1] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitRoutine} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">ROUTINE NAME</label>
                  <input
                    type="text"
                    required
                    value={newRoutineName}
                    onChange={(e) => setNewRoutineName(e.target.value)}
                    placeholder="e.g. Pull Day B"
                    className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#c4c9ac] font-mono mb-2 uppercase">INTENSITY LEVEL</label>
                  <select
                    value={newRoutineIntensity}
                    onChange={(e) => setNewRoutineIntensity(e.target.value as WorkoutIntensity)}
                    className="w-full bg-[#131313] border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
                  >
                    <option value={WorkoutIntensity.LIGHT}>LIGHT (e.g. Mobility, Stretch)</option>
                    <option value={WorkoutIntensity.MODERATE}>MODERATE (e.g. Strength, Rep-Blocks)</option>
                    <option value={WorkoutIntensity.INTENSE}>INTENSE (e.g. Heavy, Power blocks)</option>
                  </select>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs text-[#c4c9ac] font-mono uppercase">EXERCISES</label>
                    <button
                      type="button"
                      onClick={handleAddExerciseRow}
                      className="text-[10px] font-mono font-bold text-[#c3f400] hover:underline cursor-pointer"
                    >
                      + ADD EXERCISE
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newRoutineExercises.map((ex, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          required
                          value={ex.name}
                          onChange={(e) => handleExerciseChange(idx, "name", e.target.value)}
                          placeholder="Bench Press"
                          className="flex-1 bg-[#131313] border border-[#2c2c2e] rounded-xl px-3 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#c3f400]"
                        />
                        <input
                          type="number"
                          required
                          min="1"
                          max="10"
                          value={ex.sets}
                          onChange={(e) => handleExerciseChange(idx, "sets", e.target.value)}
                          placeholder="Sets"
                          className="w-16 bg-[#131313] border border-[#2c2c2e] rounded-xl px-3 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#c3f400] text-center"
                        />
                        <input
                          type="text"
                          required
                          value={ex.reps}
                          onChange={(e) => handleExerciseChange(idx, "reps", e.target.value)}
                          placeholder="Reps"
                          className="w-20 bg-[#131313] border border-[#2c2c2e] rounded-xl px-3 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#c3f400] text-center"
                        />
                        {newRoutineExercises.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveExerciseRow(idx)}
                            className="text-red-400 hover:text-red-300 p-1.5 cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs font-mono font-semibold text-[#c4c9ac] hover:text-[#e5e2e1] px-4 py-2 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="text-xs font-mono font-bold bg-[#c3f400] text-[#161e00] px-5 py-2.5 rounded-xl hover:bg-[#abd600] cursor-pointer"
                >
                  SAVE ROUTINE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
