export enum MealType {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK",
}

export enum WorkoutIntensity {
  LIGHT = "LIGHT",
  MODERATE = "MODERATE",
  INTENSE = "INTENSE",
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Meal {
  id: string;
  name: string;
  kCal: number;
  protein: number;
  type: MealType;
  image?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
}

export interface Workout {
  id: string;
  title: string;
  intensity: WorkoutIntensity;
  image: string;
  exercises: Exercise[];
}

export interface CoachMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export interface Insight {
  id: string;
  type: string;
  message: string;
  date: string;
}

export interface WeightData {
  date: string;
  weight: number;
}

export interface UserStats {
  calories: number;
  calorieGoal: number;
  hydration: number;
  hydrationGoal: number;
  weightTrend: WeightData[];
  level: number;
  experience: number;
}
