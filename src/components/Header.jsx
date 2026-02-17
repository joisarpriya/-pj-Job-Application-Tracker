export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0B1220]/80 backdrop-blur border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold tracking-wide text-[#FF8A00]">
          ApplyFlow
        </h1>
        <span className="text-sm text-gray-400">Dark Mode</span>
      </div>
    </header>
  );
}
