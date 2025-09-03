import { useEffect, useState } from "react";

export default function RadialStats({user,total}) {
  const [beginnerSolved,setBeginner] = useState(0);
  const [easySolved,setEasy] = useState(0);
  const [mediumSolved,setMedium] = useState(0);
  const [solved,setSolved] = useState(0);
  useEffect(()=>{
     let easy = 0;
     let solved = 0;
     let medium = 0;
     let beginner = 0;
     user?.problemSolved?.forEach(obj => {
        if(obj?.difficulty=='easy')easy++;
        else if(obj?.difficulty=='medium')medium++;
        else beginner++;
        solved++;
     });
     setSolved(solved);
     setEasy(easy);
     setMedium(medium);
     setBeginner(beginner);
  },[]);

  return (
    <div className="flex flex-col items-center mt-4">
      {/* Outer Radial */}
      <div className="border mt-2 shadow-sm shadow-yellow-400 border-yellow-400 h-44 w-44 flex justify-center items-center rounded-full">
        <div className="border shadow-sm shadow-purple-400 flex justify-center items-center border-purple-400 h-40 w-40 rounded-full">
          <div className="border shadow-sm shadow-green-400 border-green-400 h-36 w-36 rounded-full flex flex-col justify-center items-center">
            {/* Center text */}
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold">
                {solved}
                <span className="inline-block rotate-12 text-lg mx-1">/</span>
                {total}
              </div>
              <div className="text-xs text-gray-500">Problems</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div className="flex justify-between w-full max-w-xs mt-4">
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 bg-blue-400 rounded-full mb-1"></div>
          <span className="text-xs">Beginner</span>
          <span className="text-sm font-bold">{beginnerSolved}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 bg-green-400 rounded-full mb-1"></div>
          <span className="text-xs">Easy</span>
          <span className="text-sm font-bold">{easySolved}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-4 h-4 bg-orange-400 rounded-full mb-1"></div>
          <span className="text-xs">Medium</span>
          <span className="text-sm font-bold">{mediumSolved}</span>
        </div>
      </div>
    </div>
  );
}
