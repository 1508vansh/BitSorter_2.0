import React, { useState, useEffect, useRef } from 'react';
import {Link} from 'react-router';
export default function ReverseStack({MainStack}) {
  const [stackA, setStackA] = useState(MainStack);
  const [stackB, setStackB] = useState([]);
  const [stackC, setStackC] = useState([]);
  const [phase, setPhase] = useState(null); // 'AtoB' | 'BtoC' | 'CtoA'
  const intervalRef = useRef(null);
  console.log("this is reverseStack function");
  useEffect(() => {
    if (phase) {
      intervalRef.current = setInterval(handleStep, 700);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [phase,stackA,stackB,stackC]);

const handleStep = () => {
    if (phase === 'AtoB') {
        if (stackA.length > 0) {
            setStackA((prev) => {
                const newStackA = [...prev];
                const item = newStackA.pop();
                if (item !== undefined) {
                    setStackB((p) => [...p, item]);
                }
                return newStackA;
            });
        } else {
            setPhase('BtoC');
        }
    } else if (phase === 'BtoC') {
        if (stackB.length > 0) {
            setStackB((prev) => {
                const newStackB = [...prev];
                const item = newStackB.pop();
                if (item !== undefined) {
                    setStackC((p) => [...p, item]);
                }
                return newStackB;
            });
        } else {
            setPhase('CtoA');
        }
    } else if (phase === 'CtoA') {
        if (stackC.length > 0) {
            setStackC((prev) => {
                const newStackC = [...prev];
                const item = newStackC.pop();
                if (item !== undefined) {
                    setStackA((p) => [...p, item]);
                }
                return newStackC;
            });
        } else {
            setPhase(null); // done
        }
    }
};

  const startReverse = () => {
    if (!phase) {
      setPhase('AtoB');
    }
  };
 

  const renderStack = (label, stack) => (
    <div className="flex flex-col items-center mx-4">
      <div className="text-sm font-semibold mb-2">{label}</div>
      <div className="sm:w-50 sm:h-70 w-20 h-40 border border-gray-400 rounded p-2 flex flex-col-reverse justify-start items-center gap-2 bg-gray-50">
        {stack.map((item, index) => (
          <div
            key={index}
            className="w-[96%] h-[10%] bg-blue-500 text-white flex items-center justify-center rounded shadow"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="mt-4 sm:w-[80%] w-[90%] sm:h-[100%] h-[80%] border-2 gap-1 border-gray-400 rounded-xl mx-auto py-3 px-3 flex flex-col items-center">
    <Link to={'/visualizer'} className='text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm'>Back To Algorithms</Link>
    <div className="p-4">
      <div className="flex w-[100%] justify-center mb-6">
        {renderStack('Stack A', stackA)}
        {renderStack('Stack B', stackB)}
        {renderStack('Stack C', stackC)}
      </div>
      <div className="text-center">
        <button
          onClick={startReverse}
          disabled={phase !== null}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          Reverse Stack
        </button>
      </div>
    </div>
    </div>
  );
}
