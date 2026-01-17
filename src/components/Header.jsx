export default function Header({ darkMode, setDarkMode, setOpen }) {
  return (
    <nav className="glass fixed top-4 left-4 right-4 z-50 rounded-2xl p-4 shadow-xl">
      <div className="flex justify-between items-center">
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(prev => !prev)}
        >
          ☰
        </button>

        <h1 className="text-white text-lg font-semibold tracking-wide">
           ApplyFlow
        </h1>



        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded-xl bg-white/20 text-white"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </nav>
  );
}

