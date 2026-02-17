import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function SignupForm({ onClose }) {
  const { signup } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black/80 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Sign up</h3>
        <form onSubmit={submit} className="space-y-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full p-2 rounded" required />
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full p-2 rounded" required />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 rounded" required />
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button className="bg-orange-500 text-black px-4 py-2 rounded">Create account</button>
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-white/10">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
