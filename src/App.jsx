import { useState } from "react";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationTable from "./components/ApplicationTable";

function App() {
  const [applications, setApplications] = useState([]);
  const [editingApp, setEditingApp] = useState(null); // NEW: track app being edited

  // Add a new application
  const addApplication = (newApp) => {
    setApplications([...applications, newApp]);
  };

  // Update an existing application
  const updateApplication = (updatedApp) => {
    setApplications(applications.map((app) =>
      app.id === updatedApp.id ? updatedApp : app
    ));
    setEditingApp(null); // Clear edit mode
  };

  // Delete an application
  const deleteApplication = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  // Start editing an application
  const editApplication = (app) => {
    setEditingApp(app);
  };

  return (
    <div>
      <Header />
      <Dashboard applications={applications} />
      <ApplicationForm 
        addApplication={addApplication} 
        editingApp={editingApp} 
        updateApplication={updateApplication}
      />
      <ApplicationTable 
        applications={applications} 
        deleteApplication={deleteApplication} 
        editApplication={editApplication} 
      />
    </div>
  );
}

export default App;
