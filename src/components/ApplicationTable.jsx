function ApplicationTable({ applications, deleteApplication, editApplication }) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Applications</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f1f5f9" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Company</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Role</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Applied</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Follow-up</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{app.company}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{app.role}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{app.status}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{app.appliedDate}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>{app.followUpDate}</td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  style={{
                    padding: "5px 10px",
                    marginRight: "5px",
                    backgroundColor: "#facc15",
                    color: "black",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => editApplication(app)}
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteApplication(app.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationTable;
