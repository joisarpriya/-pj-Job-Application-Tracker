import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import LoginForm from "./auth/LoginForm";
import SignupForm from "./auth/SignupForm";

export default function Navbar({ active, setActive }) {
  const { user, logout } = useContext(AuthContext);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="flex gap-6 mb-8 items-center">
      {["Dashboard", "Applications"].map((item) => (
        <button
          key={item}
          onClick={() => setActive(item)}
          className={`px-4 py-2 rounded-lg font-medium ${
            active === item
              ? "bg-orange-500"
              : "bg-white/10 hover:bg-white/20"
          }`}
        >
          {item}
        </button>
      ))}

      <div className="ml-auto flex items-center gap-3">
        {user ? (
          <>
            <div className="text-sm opacity-90">{user.name}</div>
            <button onClick={logout} className="px-3 py-1 bg-white/10 rounded">Logout</button>
          </>
        ) : (
          <>
            <button onClick={() => setShowLogin(true)} className="px-3 py-1 bg-white/10 rounded">Login</button>
            <button onClick={() => setShowSignup(true)} className="px-3 py-1 bg-orange-500 rounded">Signup</button>
          </>
        )}
      </div>

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showSignup && <SignupForm onClose={() => setShowSignup(false)} />}
    </div>
  );
}
