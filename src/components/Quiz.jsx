import { useState } from "react";
import api from "../api/api";

const QUESTIONS = [
  { id: 'q1', text: 'I enjoy building user interfaces (React, CSS).', type: 'skill' },
  { id: 'q2', text: 'I enjoy backend systems and databases.', type: 'skill' },
  { id: 'q3', text: 'I prefer working with data and ML.', type: 'skill' },
  { id: 'q4', text: 'I am confident solving algorithmic problems.', type: 'aptitude' },
  { id: 'q5', text: 'I enjoy design and user experience.', type: 'design' },
  { id: 'q6', text: 'I can commit 10+ hours/week to learning new skills.', type: 'commitment' },
];

export default function Quiz({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handle = (id, value) => setAnswers(a => ({ ...a, [id]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/quizzes/submit', { results: answers });
      onComplete && onComplete(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to submit quiz');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="bg-black/80 p-6 rounded-lg w-full max-w-2xl">
        <h3 className="text-xl font-semibold mb-4">Career Quiz</h3>
        <form onSubmit={submit} className="space-y-3">
          {QUESTIONS.map(q => (
            <div key={q.id} className="space-y-1">
              <p>{q.text}</p>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(n => (
                  <button type="button" key={n} onClick={() => handle(q.id, n)} className={`px-3 py-1 rounded ${answers[q.id] === n ? 'bg-orange-500' : 'bg-white/10'}`}>{n}</button>
                ))}
              </div>
            </div>
          ))}

          {error && <p className="text-red-400">{error}</p>}

          <div className="mt-4 flex gap-2">
            <button disabled={loading} className="bg-orange-500 px-4 py-2 rounded">Submit Quiz</button>
            <button type="button" onClick={() => onComplete && onComplete(null)} className="px-4 py-2 rounded bg-white/10">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
