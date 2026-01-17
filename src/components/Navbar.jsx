export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <div className="m-4 p-4 bg-glass dark:bg-glassDark backdrop-blur-glass rounded-2xl shadow-lg flex justify-between items-center animate-float">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
}

