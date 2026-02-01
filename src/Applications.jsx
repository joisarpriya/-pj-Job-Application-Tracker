import { useEffect, useState } from "react";
import api from "./api/api";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationTable from "./components/ApplicationTable";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [active, setActive] = useState("Dashboard");

  const fetchApplications = async () => {
    const res = await api.get("/applications");
    setApplications(res.data);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
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
  );
}
