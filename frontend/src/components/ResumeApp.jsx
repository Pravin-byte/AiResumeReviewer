// src/components/ResumeApp.jsx
import { useState } from 'react';
import ResumeUploader from './ResumeUploader';
import FeedbackPanel from './FeedbackPanel';
import ResumeGenerator from './ResumeGenerator';

export default function ResumeApp() {
  const [resumeText, setResumeText] = useState('');
  const [role, setRole] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [improvedResume, setImprovedResume] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-indigo-200 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-8">
          AI Resume Reviewer 💼
        </h1>

        <ResumeUploader setResumeText={setResumeText} />

        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">🎯 Target Role</label>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g., Frontend Developer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>

        <FeedbackPanel
          resume={resumeText}
          role={role}
          setFeedback={setFeedback}
          feedback={feedback}
        />

        <ResumeGenerator
          resume={resumeText}
          role={role}
          setImprovedResume={setImprovedResume}
          improvedResume={improvedResume}
        />
      </div>
    </div>
  );
}
