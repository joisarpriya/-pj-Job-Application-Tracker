
import { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/me").then((res) => {
        setUser(res.data);
        setIsAuthenticated(true);
        localStorage.setItem('userId', res.data.id);
      }).catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem('userId');
        setIsAuthenticated(false);
      }).finally(() => setLoading(false));
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.user.id);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data.user;
  };

  const signup = async (name, email, password, role) => {
    const res = await api.post("/auth/register", { name, email, password, role });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.user.id);
    setUser(res.data.user);
    setIsAuthenticated(true);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
