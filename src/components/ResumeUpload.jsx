import { useState } from "react";
import api from "../api/api";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Choose a resume file first");
    setLoading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("resume", file);
      // user_id can be sent if auth exists; omitted for now
      const res = await api.post("/resumes/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnalysis(res.data.analysis);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="glass p-6 rounded-xl">Analyzing resume...</div>;

  return (
    <div className="glass p-6 rounded-xl space-y-4">
      <h3 className="text-xl font-semibold">Resume Analysis</h3>

      <form onSubmit={upload} className="space-y-3">
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
        <div className="flex gap-2">
          <button className="bg-orange-500 text-black px-4 py-2 rounded">Upload & Analyze</button>
        </div>
      </form>

      {error && <p className="text-red-400">{error}</p>}

      {analysis && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-80">Overall Score</p>
            <p className="font-bold text-2xl text-white">{analysis.overall.total}</p>
          </div>

          <div className="w-full bg-white/5 rounded overflow-hidden">
            <div
              className="bg-green-400 h-4"
              style={{ width: `${analysis.overall.total}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-white/5 rounded">
              <p className="text-sm opacity-80">Skills</p>
              <p className="font-bold">{analysis.overall.skillsScore}/45</p>
            </div>
            <div className="p-3 bg-white/5 rounded">
              <p className="text-sm opacity-80">Projects</p>
              <p className="font-bold">{analysis.overall.projectsScore}/30</p>
            </div>
            <div className="p-3 bg-white/5 rounded">
              <p className="text-sm opacity-80">ATS</p>
              <p className="font-bold">{analysis.overall.atsScore}/10</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Strengths</h4>
            <ul className="list-disc ml-5">
              {Object.entries(analysis.skillsAnalysis)
                .filter(([, v]) => v.matches && v.matches.length > 0)
                .map(([role, v]) => (
                  <li key={role}>{`${role} skills: ${v.matches.slice(0,3).join(", ")}`}</li>
                ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">Fixes</h4>
            <ul className="list-disc ml-5 space-y-2">
              {analysis.fixes.map((f, i) => (
                <li key={i} className="">
                  <div className="flex justify-between items-center">
                    <span>{f.message}</span>
                    <button
                      className="ml-3 text-sm bg-orange-500 px-2 rounded"
                      onClick={async () => {
                        const res = await api.post("/resumes/suggest", { section: f.section || f.message });
                        // append suggestions to this fix dynamically
                        f.suggestions = res.data.suggestions;
                        setAnalysis({ ...analysis });
                      }}
                    >
                      Fix this
                    </button>
                  </div>

                  {f.suggestions && (
                    <ul className="ml-4 mt-2 list-disc text-sm text-white/80">
                      {f.suggestions.map((sug, idx) => (
                        <li key={idx}>{sug}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
