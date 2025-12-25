import React from "react";

export default function Loader(width = 50) {
  return (
    <>
      <div className={`loader w-[${width}px] aspect-square grid border-[4px] border-transparent rounded-full border-r-[#6366f1]`}></div>
      <style>{`
        .loader::before,
        .loader::after {
          content: "";
          grid-area: 1/1;
          margin: 2px;
          border: inherit;
          border-radius: 50%;
          border-right-color: #06b6d4; /* cyan-500 */
          animation: spin-l15 2s infinite linear;
        }
        .loader::after {
          margin: 8px;
          border-right-color: #9333ea; /* purple-600 */
          animation-duration: 3s;
        }
        .loader {
          animation: spin-l15 1s infinite linear;
        }
        @keyframes spin-l15 {
          100% { transform: rotate(1turn); }
        }
      `}</style>
    </>
  );
}
