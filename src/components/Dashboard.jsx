import { useEffect, useState } from "react";
import api from "../api/api";
import ResumeUpload from "./ResumeUpload";
import Quiz from "./Quiz";
import Chat from "./Chat";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [matches, setMatches] = useState([]);
  const [prep, setPrep] = useState(null);

  useEffect(() => {
    api.get("/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  const Card = ({ label, value, color }) => (
    <div className="glass p-5 rounded-xl">
      <p className="text-sm opacity-80">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-orange-400">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card label="Total" value={stats.total} color="text-white" />
        <Card label="Applied" value={stats.applied} color="text-blue-400" />
        <Card label="Interview" value={stats.interview} color="text-yellow-400" />
        <Card label="Offers" value={stats.offer} color="text-green-400" />
        <Card label="Rejected" value={stats.rejected} color="text-red-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          {/* Resume analysis panel */}
          <ResumeUpload />
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-lg font-semibold">Weekly Insights</h3>
          <p className="text-sm opacity-80">No insights yet — upload your resume to get personalized guidance.</p>
        </div>

        <div className="glass p-6 rounded-xl flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Career Quiz</h3>
          <p className="text-sm opacity-80">Take a short quiz to evaluate interests and confidence.</p>
          <div className="flex gap-2">
            <button className="bg-orange-500 px-4 py-2 rounded" onClick={() => setShowQuiz(true)}>Take Quiz</button>
            <button className="bg-white/10 px-4 py-2 rounded" onClick={async () => {
              try {
                const res = await api.post('/matches');
                setMatches(res.data);
                setShowMatches(true);
              } catch (err) {
                alert(err?.response?.data?.error || 'Failed to compute matches');
              }
            }}>Find Matches</button>
          </div>
        </div>
      </div>

      {showQuiz && (
        <Quiz onComplete={() => setShowQuiz(false)} />
      )}

      {showMatches && (
        <div className="glass p-6 rounded-xl mt-6">
          <h3 className="text-lg font-semibold">Recommended Internships</h3>
          {matches?.length === 0 && <p className="text-sm opacity-80">No matches found</p>}
          <ul className="mt-3 space-y-3">
            {matches?.map((m, i) => (
              <li key={i} className="p-3 bg-white/5 rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{m.internship.title} @ {m.internship.company}</div>
                    <div className="text-sm opacity-80">{m.internship.location} • {m.internship.stipend}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{m.match}%</div>
                    <div className="text-sm opacity-80">{m.reason}</div>
                    <div className="mt-2 flex gap-2 justify-end">
                      <button className="px-3 py-1 bg-white/10 rounded" onClick={async () => {
                        const title = m.internship.title.toLowerCase();
                        let role = 'backend';
                        if (title.includes('frontend')) role = 'frontend';
                        if (title.includes('data')) role = 'data';
                        try {
                          const res = await api.post('/prep', { role });
                          setPrep({ internship: m.internship, prep: res.data });
                        } catch (err) {
                          alert('Prep failed');
                        }
                      }}>Prep</button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <button onClick={() => setShowMatches(false)} className="px-3 py-1 bg-white/10 rounded">Close</button>
          </div>
        </div>
      )}

      {prep && (
        <div className="glass p-6 rounded-xl mt-6">
          <h3 className="text-lg font-semibold">Interview Prep — {prep.internship.title} @ {prep.internship.company}</h3>
          <div className="mt-3">
            <h4 className="font-semibold">Questions</h4>
            <ul className="list-disc ml-5 mt-2">
              {prep.prep.questions.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>
          <div className="mt-3">
            <h4 className="font-semibold">Tips</h4>
            <ul className="list-disc ml-5 mt-2">
              {prep.prep.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={() => setPrep(null)} className="px-3 py-1 bg-white/10 rounded">Close</button>
            <button onClick={() => setPrep(null)} className="px-3 py-1 bg-orange-500 rounded">Start mock interview</button>
          </div>
        </div>
      )}

      <Chat />
    </div>
  );
}
