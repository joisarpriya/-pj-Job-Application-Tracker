import { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import ApplicationTable from "./ApplicationTable";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);

  return (
    <div className="flex-1 p-8 mt-20 space-y-6">
      <h2 className="text-3xl font-bold text-white">
        ApplyFlow Dashboard
      </h2>

      <ApplicationForm
        onAdd={(app) => setApplications((prev) => [...prev, app])}
      />

      <ApplicationTable applications={applications} />
    </div>
  );
}


