import React, { useState } from "react";
import api from "../api/api";

export default function ApplicationForm({ onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const payload = {
      company: form.company.value,
      role: form.role.value,
      status: form.status.value,
      applied_date: form.date.value,
      notes: form.notes.value,
    };

    setSubmitting(true);
    setMessage(null);

    try {
      await api.post("/applications", payload);
      form.reset();
      setMessage({ type: 'success', text: 'Application saved' });
      onSuccess(); // refreshes the table
    } catch (err) {
      console.error("Submit failed:", err);
      setMessage({ type: 'error', text: err?.response?.data?.error || 'Failed to add application' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass p-6 rounded-xl space-y-4">
      <h3 className="text-xl font-semibold">Add Application</h3>

      <input name="company" placeholder="Company" className="w-full p-2 rounded" required />
      <input name="role" placeholder="Role" className="w-full p-2 rounded" required />

      <select name="status" className="w-full p-2 rounded">
        <option>Applied</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>

      <input type="date" name="date" className="w-full p-2 rounded" required />

      <textarea name="notes" placeholder="Notes" className="w-full p-2 rounded" />

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={submitting}
          className={`bg-orange-500 text-black font-semibold px-4 py-2 rounded-lg w-full ${submitting ? 'opacity-60' : ''}`}
        >
          {submitting ? 'Saving...' : 'Save Application'}
        </button>
        {message && (
          <div className={`text-sm ${message.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message.text}</div>
        )}
      </div>
    </form>
  );
}
