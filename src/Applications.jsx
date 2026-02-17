import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/api";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationTable from "./components/ApplicationTable";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContext } from "./context/AuthContext";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [active, setActive] = useState("Dashboard");
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    } else if (!loading && user) {
      // Role-aware redirect
      if (user.role === 'recruiter') navigate('/recruiter');
      else if (user.role === 'student') navigate('/student');
    }
    // eslint-disable-next-line
  }, [isAuthenticated, loading, user, navigate]);

  const fetchApplications = async () => {
    const res = await api.get("/applications");
    setApplications(res.data);
  };

  useEffect(() => {
    if (isAuthenticated) fetchApplications();
  }, [isAuthenticated]);

  if (loading) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0B0F1A] text-white p-8 overflow-auto">
        <h1 className="text-3xl font-bold text-orange-400 mb-6">
          ApplyFlow
        </h1>

        <Navbar active={active} setActive={setActive} />

        {active === "Dashboard" && <Dashboard />}

        {active === "Applications" && (
          <div className="space-y-6">
            <ApplicationForm onSuccess={fetchApplications} />
            <ApplicationTable
              applications={applications}
              onChange={fetchApplications}
            />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
