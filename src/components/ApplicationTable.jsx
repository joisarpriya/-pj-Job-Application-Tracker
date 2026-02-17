import api from "../api/api";

export default function ApplicationTable({ applications, onChange }) {
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applications/${id}`, { status });
      onChange();
    } catch (err) {
      console.error('Status update failed', err);
      alert('Update failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this application?')) return;
    try {
      await api.delete(`/applications/${id}`);
      onChange();
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-white/10">
        <thead>
          <tr className="bg-white/10">
            <th className="p-2">Company</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-t border-white/10">
              <td className="p-2">{app.company}</td>
              <td className="p-2">{app.role}</td>
              <td className="p-2">
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value)}
                  className="text-black rounded"
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
              </td>
              <td className="p-2">{app.applied_date}</td>
              <td className="p-2">
                <button onClick={() => remove(app.id)} className="px-3 py-1 bg-red-500 rounded text-black">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
