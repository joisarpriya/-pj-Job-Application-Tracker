export default function Sidebar({ open, setOpen }) {
  return (
    <div
      className={`glass fixed md:relative top-0 left-0 h-screen w-64 p-5 transition-transform duration-300 z-40
      ${open ? "translate-x-0" : "-translate-x-64 md:translate-x-0"}`}
    >
      <h2 className="text-white text-xl font-bold mb-6">Menu</h2>

      <ul className="space-y-4 text-white">
        <li className="hover:bg-white/10 p-2 rounded-lg cursor-pointer">Dashboard</li>
        <li className="hover:bg-white/10 p-2 rounded-lg cursor-pointer">Applications</li>
        <li className="hover:bg-white/10 p-2 rounded-lg cursor-pointer">Interviews</li>
        <li className="hover:bg-white/10 p-2 rounded-lg cursor-pointer">Settings</li>
      </ul>
    </div>
  );
}
