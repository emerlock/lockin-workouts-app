import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import NavHeader from "./compoents/NavHeader";
import { useThemeStore } from "./lib/themeStore";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import WorkoutCreate from "./pages/WorkoutCreate";
import WorkoutDetail from "./pages/WorkoutDetail";
import WorkoutList from "./pages/WorkoutList";

export default function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-screen">
      <NavHeader />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workouts" element={<WorkoutList />} />
          <Route path="/workouts/new" element={<WorkoutCreate />} />
          <Route path="/workouts/:workoutId" element={<WorkoutDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
