export default function ResumeTemplate({ resumeText }) {
  return (
    <div
      id="pdf-content"
      className="w-[794px] min-h-[1123px] px-10 py-8 bg-white text-black font-sans text-[13px] leading-relaxed"
    >
      <div className="whitespace-pre-wrap">
        {resumeText}
      </div>
    </div>
  );
}
