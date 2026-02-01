import { useState } from "react";
import api from "../api/api";

export default function Chat() {
  const [withId, setWithId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const load = async () => {
    if (!withId) return alert('Enter user id');
    try {
      const res = await api.get(`/messages/${withId}`);
      setMessages(res.data);
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to load');
    }
  };

  const send = async () => {
    if (!withId || !message) return;
    try {
      await api.post('/messages', { receiver_id: withId, message });
      setMessage("");
      load();
    } catch (err) {
      alert('Send failed');
    }
  };

  return (
    <div className="glass p-6 rounded-xl mt-6">
      <h3 className="text-lg font-semibold">Messages</h3>
      <div className="mt-3 flex gap-2">
        <input value={withId} onChange={(e) => setWithId(e.target.value)} placeholder="Conversation with user id" className="p-2 rounded w-full" />
        <button onClick={load} className="px-3 py-1 bg-orange-500 rounded">Load</button>
      </div>

      <div className="mt-3">
        <div className="h-40 overflow-auto bg-white/5 p-3 rounded">
          {messages.map(m => (
            <div key={m.id} className={`mb-2 ${m.sender_id === Number(localStorage.getItem('userId')) ? 'text-right' : ''}`}>
              <div className="text-sm opacity-80">{m.message}</div>
              <div className="text-xs opacity-60">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message" className="p-2 rounded w-full" />
          <button onClick={send} className="px-3 py-1 bg-white/10 rounded">Send</button>
        </div>
      </div>
    </div>
  );
}
