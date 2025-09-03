import { useState } from "react";

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Reset after 1.5s
    });
  };

  return (
    <div className="relative mockup-code w-full">
      <pre className="whitespace-pre-wrap p-4">
        <code>{code}</code>
      </pre>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        {copied ? "✅" : "📋"}
      </button>
    </div>
  );
}
