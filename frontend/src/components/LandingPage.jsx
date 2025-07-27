// src/components/LandingPage.jsx
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 to-white scroll-smooth overflow-y-scroll scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">

      {/* Header */}
      <header className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-indigo-700">AI Resume Reviewer</h1>
        <nav className="space-x-6 text-indigo-600 font-medium text-sm">
          <a href="#features" className="hover:text-indigo-900">Features</a>
          <Link to="/review" className="hover:text-indigo-900">Get Started</Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-4 py-20 bg-indigo-100">
        <h2 className="text-5xl font-extrabold text-indigo-800 mb-4">Elevate Your Resume with AI</h2>
        <p className="text-lg text-gray-600 max-w-2xl mb-8">
          Instantly analyze your resume, identify strengths and weaknesses, and generate improvements tailored to your dream role.
        </p>
        <Link to="/review">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full text-lg shadow transition">
            🚀 Get Started
          </button>
        </Link>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4 bg-white">
        <h3 className="text-3xl font-bold text-center text-indigo-800 mb-12">Key Features</h3>
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {[
            { icon: '📄', title: 'Upload PDF Resume', desc: 'Easily upload your resume for instant review.' },
            { icon: '💬', title: 'Get AI Feedback', desc: 'Receive insights on strengths, weaknesses & missing keywords.' },
            { icon: '📝', title: 'Generate Resume', desc: 'Let AI generate a better version tailored to your role.' }
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-indigo-50 rounded-lg p-6 text-center shadow-md">
              <div className="text-4xl mb-3">{icon}</div>
              <h4 className="text-xl font-semibold text-indigo-700 mb-2">{title}</h4>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
