import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen gradient-bg transition-all duration-500">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} setOpen={setOpen} />

        <div className="flex">
          <Sidebar open={open} setOpen={setOpen} />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}




