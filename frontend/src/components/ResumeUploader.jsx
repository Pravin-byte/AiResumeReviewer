export default function ResumeUploader({ setResumeText }) {
  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append('resume', e.target.files[0]);

    const res = await fetch('http://localhost:5000/api/upload-pdf', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResumeText(data.extractedText);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        📄 Upload Your Resume (PDF)
      </label>
      <input
        type="file"
        onChange={handleUpload}
        accept=".pdf"
        className="block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4 file:rounded-full
          file:border-0 file:text-sm file:font-semibold
          file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
      />
    </div>
  );
}
