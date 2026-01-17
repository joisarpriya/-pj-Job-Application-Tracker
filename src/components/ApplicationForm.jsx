export default function ApplicationForm({ onAdd }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const newApp = {
      id: Date.now(),
      company: form.company.value,
      role: form.role.value,
      status: form.status.value,
      applied_date: form.date.value,
      notes: form.notes.value,
    };

    onAdd(newApp);
    form.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 rounded-2xl space-y-4">
      <h3 className="text-xl font-semibold">Add Application</h3>

      <input
        name="company"
        placeholder="Company"
        className="w-full p-2 rounded"
        required
      />

      <input
        name="role"
        placeholder="Role"
        className="w-full p-2 rounded"
        required
      />

      <select name="status" className="w-full p-2 rounded">
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>

      <input type="date" name="date" className="w-full p-2 rounded" required />

      <textarea
        name="notes"
        placeholder="Notes"
        className="w-full p-2 rounded"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl w-full hover:bg-indigo-700 transition">
        Save Application
      </button>
    </form>
  );
}





