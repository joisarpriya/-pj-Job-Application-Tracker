export default function ApplicationTable({ applications }) {
  return (
    <div className="glass p-6 rounded-2xl mt-6 overflow-x-auto">
      <h3 className="text-xl font-semibold mb-4">Your Applications</h3>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Company</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b hover:bg-white/20">
              <td className="p-2">{app.company}</td>
              <td className="p-2">{app.role}</td>
              <td className="p-2">{app.status}</td>
              <td className="p-2">{app.applied_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



