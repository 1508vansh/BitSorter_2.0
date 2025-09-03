import { useSelector } from "react-redux";
import { useState } from "react";

export default function SortingVisualizer() {
    const isDark = useSelector((state) => state.isDark.isDark);
    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';

    const [intervalId, setIntervalId] = useState(null);
    const [inputArray, setInputArray] = useState("");
    const [compareIdx, setCompareIdx] = useState([]);
    const [swapIdx, setSwapIdx] = useState([]);
    const [minIDX, setMinIDX] = useState(-1);
    const [isSorting, setIsSorting] = useState(false);
    const [arrDisplay, setArrDisplay] = useState(['Input Data']);
    const [instruction1, setInstruction1] = useState('Input Data');
    const [instruction2, setInstruction2] = useState('Input Data');
    const [instruction3, setInstruction3] = useState('Input Data');
    const [stepQueue, setStepQueue] = useState([]);
    const [isStop, setIsStop] = useState(false);
    const [currQIdx, setCurrQIdx] = useState(-1);
    function setArrayDisplay(arr) {
        setArrDisplay(arr);
    }

    const handleSort = [
        { id: 1, name: 'Bubble Sort', color: 'text-blue-500',
            algo: function bubbleSort(arr) {
                let StepQueue = [];
                const n = arr.length;
                for (let i = 0; i < n - 1; i++) {
                    for (let j = 0; j < n - i - 1; j++) {
                        StepQueue.push({ stepName: 'compare', idxI: j, idxJ: j + 1 });
                        if (arr[j] > arr[j + 1]) {
                            StepQueue.push({ stepName: 'swap', idxI: j, idxJ: j + 1 });
                            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                        }
                    }
                }
                return StepQueue;
            }
        },
        { id: 2, name: 'Selection Sort', color: 'text-green-500',
            algo: function selectionSort(arr) {
                let StepQueue = [];
                const n = arr.length;
                for (let i = 0; i < n - 1; i++) {
                    let minIndex = i;
                    for (let j = i + 1; j < n; j++) {
                        StepQueue.push({ stepName: 'minIDX', idxI: minIndex });
                        StepQueue.push({ stepName: 'compare', idxI: minIndex, idxJ: j });
                        if (arr[j] < arr[minIndex]) {
                            minIndex = j;
                        }
                    }
                    StepQueue.push({ stepName: 'swap', idxI: i, idxJ: minIndex });
                    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
                }
                return StepQueue;
            }
        },
        { id: 3, name: 'Insertion Sort', color: 'text-red-500',
            algo: function insertionSort(arr) {
                let StepQueue = [];
                for (let i = 1; i < arr.length; i++) {
                    let j = i;
                    while (j > 0) {
                        StepQueue.push({ stepName: 'compare', idxI: j, idxJ: j - 1 });
                        if (arr[j] < arr[j - 1]) {
                            StepQueue.push({ stepName: 'swap', idxI: j, idxJ: j - 1 });
                            [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
                        } else {
                            break;
                        }
                        j--;
                    }
                }
                return StepQueue;
            }
        },
    ];

    const [sortAlgo, setSortAlgo] = useState(handleSort[0]);


    function PartialReset() {
        stop();
        setCompareIdx([]);
        setSwapIdx([]);
        setMinIDX(-1);
    }

    function setSortId(id) {
        PartialReset();
        setInstruction1('');
        setInstruction2('');
        setInstruction3('');
        const algo = handleSort.find((algo) => algo.id === id);
        setSortAlgo(algo);
    }

    function stop() {
        setIsStop(true);
        setIsSorting(false);
        clearInterval(intervalId);
    }

    function Reset() {
        stop();
        setInstruction1('Input Data');
        setInstruction2('Input Data');
        setInstruction3('Input Data');
        setArrDisplay(['Input Data']);
        setArrayDisplay([]);
        setStepQueue([]);
        setCurrQIdx(-1);
        setCompareIdx([]);
        setSwapIdx([]);
        setInputArray("");
        setMinIDX(-1);
        document.getElementById("inputNumber").value = "";
    }

    function prev(){
        if(stepQueue.length===0) return;
        if(currQIdx<=0) return;
        setCurrQIdx(currQIdx-1);
        let step = stepQueue[currQIdx-1];
        if (step.stepName === 'minIDX') {
            setArrayDisplay(PrevArray=>{
            setInstruction1(`Found Minimum Index at ${PrevArray[step.idxI]}`);
            return [...PrevArray];
            });
            setInstruction2('');
            setInstruction3('');
            setMinIDX(step.idxI);
            setCompareIdx([]);
            setSwapIdx([]);
        }
        if (step.stepName === 'compare') {
            setArrayDisplay(PrevArray=>{
            setInstruction2(`Comparing Elements at ${PrevArray[step.idxI]} and ${PrevArray[step.idxJ]}`);
            return [...PrevArray];
            });
            setInstruction3('');
            setInstruction1('');
            setCompareIdx([step.idxI, step.idxJ]);
            setSwapIdx([]);
            setMinIDX(-1);
        }
        if (step.stepName === 'swap') {
            setArrayDisplay(PrevArray=>{
            setInstruction3(`Swapping Elements at ${PrevArray[step.idxI]} and ${PrevArray[step.idxJ]}`);
            return [...PrevArray];
            });
            setInstruction2('');
            setInstruction1('');
            setSwapIdx([step.idxI, step.idxJ]);
            setCompareIdx([]);
            setMinIDX(-1);

            // swap after a small delay so that color shows first
            setTimeout(() => {
                setArrayDisplay(prevArray => {
                    const newArray = [...prevArray];
                    [newArray[step.idxI], newArray[step.idxJ]] = [newArray[step.idxJ], newArray[step.idxI]];
                    return newArray;
                });
            }, 600); // 400ms delay for swap after coloring
        }
    }
    function next(){
        if(stepQueue.length===0) return;
        if(currQIdx>=stepQueue.length) return;
        setCurrQIdx(currQIdx+1);
        let step = stepQueue[currQIdx];
        if (step.stepName === 'minIDX') {
            setArrayDisplay(PrevArray=>{
            setInstruction1(`Found Minimum Index at ${PrevArray[step.idxI]}`);
            return [...PrevArray];
            });
            setInstruction2('');
            setInstruction3('');
            setMinIDX(step.idxI);
            setCompareIdx([]);
            setSwapIdx([]);
        }
        if (step.stepName === 'compare') {
            setArrayDisplay(PrevArray=>{
            setInstruction2(`Comparing Elements at ${PrevArray[step.idxI]} and ${PrevArray[step.idxJ]}`);
            return [...PrevArray];
            });
            setInstruction3('');
            setInstruction1('');
            setCompareIdx([step.idxI, step.idxJ]);
            setSwapIdx([]);
            setMinIDX(-1);
        }
        if (step.stepName === 'swap') {
            setArrayDisplay(PrevArray=>{
            setInstruction3(`Swapping Elements at ${PrevArray[step.idxI]} and ${PrevArray[step.idxJ]}`);
            return [...PrevArray];
            });
            setInstruction2('');
            setInstruction1('');
            setSwapIdx([step.idxI, step.idxJ]);
            setCompareIdx([]);
            setMinIDX(-1);

            // swap after a small delay so that color shows first
            setTimeout(() => {
                setArrayDisplay(prevArray => {
                    const newArray = [...prevArray];
                    [newArray[step.idxI], newArray[step.idxJ]] = [newArray[step.idxJ], newArray[step.idxI]];
                    return newArray;
                });
            }, 600); // 400ms delay for swap after coloring
        }
    }
    function showAnimation() {
        PartialReset();
        setIsSorting(true);
        setIsStop(false);
        const arr = inputArray.split(",").map(Number);
        setArrayDisplay(arr);
        const Steps = sortAlgo.algo([...arr]);
        setStepQueue(Steps);
        let i = 0;
        setCurrQIdx(i);
        const intervalCallBack = setInterval(() => {
            setCurrQIdx(i);
            setIntervalId(intervalCallBack);

            if (i >= Steps.length) {
                setIsStop(true);
                clearInterval(intervalCallBack);
                return;
            }

            const step = Steps[i];

            if (step.stepName === 'minIDX') {
                setArrayDisplay(PrevArray=>{
                setInstruction1(`Found Minimum Index at ${PrevArray[step.idxI]}`);
                return [...PrevArray];
                });
                setInstruction2('');
                setInstruction3('');
                setMinIDX(step.idxI);
                setCompareIdx([]);
                setSwapIdx([]);
            }
            if (step.stepName === 'compare') {
                setArrayDisplay(PrevArray=>{
                setInstruction2(`Comparing Elements at ${PrevArray[step.idxI]} and ${PrevArray[step.idxJ]}`);
                return [...PrevArray];
                });
                setInstruction3('');
                setInstruction1('');
                setCompareIdx([step.idxI, step.idxJ]);
                setSwapIdx([]);
                setMinIDX(-1);
            }
            if (step.stepName === 'swap') {
                setArrayDisplay(PrevArray=>{
                setInstruction3(`Swapping Elements at ${PrevArray[step.idxI]} and ${PrevArray[step.idxJ]}`);
                return [...PrevArray];
                });
                setInstruction2('');
                setInstruction1('');
                setSwapIdx([step.idxI, step.idxJ]);
                setCompareIdx([]);
                setMinIDX(-1);

                // swap after a small delay so that color shows first
                setTimeout(() => {
                    setArrayDisplay(prevArray => {
                        const newArray = [...prevArray];
                        [newArray[step.idxI], newArray[step.idxJ]] = [newArray[step.idxJ], newArray[step.idxI]];
                        return newArray;
                    });
                }, 600); // 400ms delay for swap after coloring
            }

            i++;
        }, 800);
    }

    return (
        <div className={`flex flex-col gap-4 pt-10 items-center h-screen ${bgColor} transition-colors duration-300`}>
            <div className={`p-5 rounded-lg shadow-lg text-center ${bgColor}`}>
                <h1 className={`${textColor} text-3xl font-bold mb-4`}>Sorting Visualizer</h1>
                <p className={`${textColor} text-lg mb-2`}>Choose an algorithm to visualize:</p>
                <div className="flex justify-center items-center flex-wrap gap-4">
                    <button onClick={() => setSortId(1)} className="bg-blue-500 text-white sm:text-base text-xs px-4 py-2 rounded">Bubble Sort</button>
                    <button onClick={() => setSortId(2)} className="bg-green-500 text-white px-4 py-2 sm:text-base text-xs rounded">Selection Sort</button>
                    <button onClick={() => setSortId(3)} className="bg-red-500 text-white px-4 py-2 sm:text-base text-xs rounded">Insertion Sort</button>
                </div>
            </div>

            <div className="mt-8 w-[80%] h-[80%] flex flex-col items-center border-2 border-gray-300 rounded-lg p-5 shadow-lg">
                <div className={`${textColor} sm:text-3xl text-2xl font-bold mb-4`}>Sorting Algorithms</div>
                <div className={`text-2xl font-bold ${sortAlgo.color} mb-2`}>{sortAlgo.name}</div>
                
                <div className="w-[80%] flex justify-center mb-4">
                    <input
                        id="inputNumber"
                        onChange={(e) => setInputArray(e.target.value)}
                        className={`py-1 border-2 w-[60%] ${isDark?'border-white':'border-black'} rounded-xl px-6 ${isDark?'placeholder:text-white':''} rounded-xl px-6`}
                        type="text"
                        placeholder="Input Numbers Comma(,) separated"
                    />
                </div>

                <div className="flex justify-center flex-wrap items-center gap-2">
                    <div className="py-1 px-4 sm:text-base text-xs rounded-sm text-white font-semibold bg-red-600">{isSorting?<button onClick={()=>stop()}>Stop Sorting</button>:<button onClick={()=>showAnimation()}>Start Sorting</button>}</div>
                    <button onClick={Reset} className="py-1 px-4 sm:text-base text-xs rounded-sm text-white font-semibold bg-red-600">Reset</button>
                    {isStop&&<div>
                    <button onClick={()=>prev()} className="py-1 px-4 sm:text-base text-xs rounded-sm text-white font-semibold bg-green-600">Prev</button>
                    <button onClick={()=>next()} className="py-1 px-4 sm:text-base text-xs ml-2 rounded-sm text-white font-semibold bg-orange-600">Next</button>
                    </div>}
                </div>

                <div className="mt-4 w-[80%] h-[60%] border-2 gap-4 border-gray-400 rounded-xl py-3 px-3 flex flex-col items-center">
                    <div className={`flex justify-center items-center w-full h-full`}>{instruction1.length!==0?instruction1:instruction2.length!==0?instruction2:instruction3}</div>
                    <div className="flex justify-center items-end w-full h-full">
                        {arrDisplay.map((value, index) => (
                            <div 
                                key={index}
                                style={{ height: `${value * 10}%` }}
                                className={`w-12 flex justify-center items-center rounded-sm border-2 mx-1
                                    ${minIDX === index ? 'bg-yellow-400'
                                        : swapIdx.includes(index) ? 'bg-red-400'
                                        : compareIdx.includes(index) ? 'bg-green-400'
                                        : 'bg-white'
                                    } transition-colors duration-500`}
                            >
                                <div className={`font-semibold`}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
