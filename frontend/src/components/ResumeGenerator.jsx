import { useState, useRef } from 'react';
import { Loader, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResumeTemplate from './ResumeTemplate';

export default function ResumeGenerator({ resume, role, setImprovedResume, improvedResume }) {
  const [loading, setLoading] = useState(false);
  const resumeRef = useRef();

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, role }),
      });

      const data = await res.json();
      setImprovedResume(data.improvedResume);
    } catch (error) {
      console.error('Error generating improved resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('pdf-content');
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('Improved_Resume.pdf');
  };

  return (
    <div className="my-6">
      <button
        onClick={generate}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 transition text-white font-medium px-6 py-2 rounded shadow disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          '✍️ Generate Improved Resume'
        )}
      </button>

      {improvedResume && !loading && (
        <>
          <div className="mt-6 border rounded-lg p-4 bg-white shadow">
            <ResumeTemplate resumeText={improvedResume} />
          </div>

          <div className="mt-4">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium shadow transition"
            >
              <Download className="w-4 h-4" />
              Download as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}
