function Dashboard({ applications }) {
  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
    },
    {
      label: "Applied",
      value: applications.filter((app) => app.status === "Applied").length,
    },
    {
      label: "Interview",
      value: applications.filter((app) => app.status === "Interview").length,
    },
    {
      label: "Offer",
      value: applications.filter((app) => app.status === "Offer").length,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        padding: "20px",
      }}
    >
      {stats.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "#f1f5f9",
            padding: "15px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <h3>{item.label}</h3>
          <h2>{item.value}</h2>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
