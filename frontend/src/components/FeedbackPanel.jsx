import { useState } from 'react';
import { Loader } from 'lucide-react';

export default function FeedbackPanel({ resume, role, setFeedback, feedback }) {
  const [loading, setLoading] = useState(false);

  const getFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, role }),
      });

      const data = await res.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6">
      <button
        onClick={getFeedback}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium px-6 py-2 rounded shadow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Loading...
          </>
        ) : (
          '🚀 Get AI Feedback'
        )}
      </button>

      {feedback && !loading && (
        <div className="mt-6 bg-white border border-indigo-200 rounded-lg p-6 shadow-inner space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-indigo-800">✅ Strengths</h2>
            <ul className="list-disc ml-6 text-gray-700">
              {feedback.strengths?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-red-700">⚠️ Weaknesses</h2>
            <ul className="list-disc ml-6 text-gray-700">
              {feedback.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-sky-700">🔍 Missing Keywords</h2>
            <p className="text-gray-700">{feedback.missing_keywords}</p>
          </div>
        </div>
      )}
    </div>
  );
}
