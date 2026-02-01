import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 glass text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold heading text-[#FF8A00] mb-8 tracking-wide">
        ApplyFlow
      </h2>

      <nav className="space-y-4 sidebar-text">
        <Link
          to="/"
          className="block p-3 rounded-lg hover:bg-white/10 transition-all"
        >
          Dashboard
        </Link>

        <Link
          to="/applications"
          className="block p-3 rounded-lg hover:bg-white/10 transition-all"
        >
          Applications
        </Link>

        <Link
          to="/interviews"
          className="block p-3 rounded-lg hover:bg-white/10 transition-all"
        >
          Interviews
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
