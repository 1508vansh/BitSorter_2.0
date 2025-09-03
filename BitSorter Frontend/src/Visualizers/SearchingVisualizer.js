import { useState } from "react";
import { useSelector } from "react-redux";
export default function SearchingVisualizer(){
    let [target,setTarget] = useState();
    let [inputArray,setInputArray] = useState([]);
    let [checkIdx,setCheckIdx] = useState(-1);
    let [foundIdx,setFoundIdx] = useState(-1);
    let [isNotPresent,setIsNotPresent] = useState(false);
    let [instruction,setInstruction] = useState('Instructions');
    let [isSearching,setIsSearching] = useState(false);
    let [intervalId,setIntervalId] = useState(null);
    let [stEnd,setStEnd] = useState([-1,-1]);
    const isDark = useSelector((state) => state.isDark.isDark);
    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';
    
    function setArray(str){
       let arr = str.split(',').map(Number);
       setInputArray(arr);
    }
    let handleSearch = [
        {
           name:'linear search',
           algo:function linearSearch(arr,tar){
            let steps = [];
            let flag = false;
            for(let i = 0; i < arr.length; i++){
                steps.push({step:'check', idxI:i});
                if(tar === arr[i]){
                    steps.push({step:'found', idxI:i});
                    flag = true;
                    break;
                }
            }
            if(!flag) steps.push({step:'notFound'});
            return steps;
           }
        },
        {
            name:'binary search',
            algo:function binarySearch(arr,tar){
               let steps = [];
               let st = 0;
               let end = arr.length-1;
               let flag = false;
               let sortedArr = [...arr].sort((a,b)=>a-b);
               steps.push({step:'divide', idxSt:st, idxLast:end});
               while(st<=end){
                let mid = Math.floor((st + end) / 2);
                  if(sortedArr[mid]===tar){
                     steps.push({step:'found',idxI:mid});
                     flag = true;
                     break;
                  }else if(sortedArr[mid]>tar){
                     steps.push({step:'divide',idxSt:st,idxLast:mid-1});
                     end = mid-1;
                  }else{
                     steps.push({step:'divide',idxSt:mid+1,idxLast:end});
                     st = mid+1;
                  }
               }
               if(!flag)steps.push({step:'notFound'});
               return steps;
          }
        }
    ];
    let [currAlgo,setCurrAlgo] = useState(handleSearch[0]);
    function setAlgo(idx){
       Reset();
       setCurrAlgo(handleSearch[idx]);
    }
    function stop(){
        clearInterval(intervalId);
        setIsSearching(false);
        setCheckIdx(-1);
        setFoundIdx(-1);
        setIsNotPresent(false);
    }
    function Reset(){
        stop();
        setInstruction('Instructions');
        document.getElementById('inputNumber').value = '';
        document.getElementById('inputTarget').value = '';
        setInputArray([]);
        setTarget();
    }
    function showAnimation(){
        let arr = [];
        if(currAlgo.name === 'binary search'){
            setInputArray(prevArray=>{
                let arr = [...prevArray];
                arr.sort((a,b)=>a-b);
                return arr;
              }
            )
        }
        arr = currAlgo.algo([...inputArray],target);
        let i = 0;
        setIsSearching(true);
        let interval = setInterval(() => {
            setIntervalId(interval);
            if(i === arr.length){
                setIntervalId(null);
                setIsSearching(false);
                setCheckIdx(-1);
                setFoundIdx(-1);
                setIsNotPresent(false);
                clearInterval(interval);
                return;
            }
            let currStep = arr[i];
            if(currStep.step === 'check'){
                setCheckIdx(currStep.idxI);
                setInstruction(`Checking ${inputArray[currStep.idxI]}`);
                setFoundIdx(-1);
                setStEnd([-1,-1]);
            }
             else if(currStep.step === 'divide'){
                setStEnd([currStep.idxSt, currStep.idxLast]);
                setInstruction(`Dividing Array from ${currStep.idxSt} to ${currStep.idxLast}`);
                setCheckIdx(-1);
                setFoundIdx(-1);
            }
            else if(currStep.step === 'found'){
                setFoundIdx(currStep.idxI);
                setInstruction(`Found ${inputArray[currStep.idxI]} at index ${currStep.idxI}`);
                setCheckIdx(-1);
                setStEnd([-1,-1]);
                clearInterval(interval);
            }else if(currStep.step === 'notFound'){
                setCheckIdx(-1);
                setFoundIdx(-1);
                setInstruction(`Not Found ${target}`);
                setIsNotPresent(true);
                setStEnd([-1,-1]);
            }
            i++;
        }, 1000);
    }
    return(
        <>
        <div className={`h-screen ${isDark?'bg-gray-900':''} sm:w-[80%] w-full pt-6 mx-auto text-center justify-center`}>
        <div className={`p-5 rounded-lg w-[80%] shadow-lg mx-auto text-center justify-center ${bgColor}`}>
                <h1 className={`${textColor} sm:text-3xl text-2xl font-bold mb-4`}>Searching Visualizer</h1>
                <p className={`${textColor} text-lg mb-2`}>Choose an algorithm to visualize:</p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <div><button onClick={()=>setAlgo(0)} className="bg-blue-500 text-white px-4 py-2 rounded">Linear Search</button></div>
                   <div><button onClick={()=>setAlgo(1)} className="bg-green-500 text-white px-4 py-2 rounded">Binary Search</button></div>
                </div>
            </div>
            <div className="w-[100%] flex flex-col mt-4 items-center">
            <div className="w-[80%] flex justify-center mb-4">
                    <input
                        id="inputNumber"
                        onChange={(e) => setArray(e.target.value)}
                        className={`py-1 border-2 w-[60%] ${isDark?'border-white':'border-black'} rounded-xl px-6 ${isDark?'placeholder:text-white':''}`}
                        type="text"
                        placeholder="Input Numbers Comma(,) separated"
                    />
            </div>
            <div className="flex justify-center mb-4">
                    <input
                        id="inputTarget"
                        onChange={(e) => setTarget(Number(e.target.value))}
                        className={`border-2 px-2 py-1 w-16 ${isDark?'border-white':'border-black'} ${isDark?'placeholder:text-white':''} rounded-sm`}
                        type='text'
                        maxLength={10}
                        placeholder="Target"
                    />
            </div>
            </div>
            <div className="w-[80%] flex justify-center mb-4 gap-2 mx-auto">
            <div>
                <button onClick={()=>isSearching?stop():showAnimation()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">{isSearching?'Stop Searching':'Start Searching'}</button>
            </div>
            <div>
                <button onClick={()=>Reset()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">Reset</button>
            </div>
            </div>
            <div className="mt-4 w-[80%] h-64 border-2 gap-1 border-gray-400 rounded-xl mx-auto py-3 px-3 flex flex-col items-center">
                    <div className={`flex justify-center items-center w-full h-20`}>{instruction}</div>
                    <div className="flex justify-center items-center w-full h-20">
                        {inputArray.map((value, index) => (
                            <div
                                key={index}
                                className={`w-20 h-20 flex justify-center items-center rounded-sm border-2 mx-1
                                    ${foundIdx===index ? 'bg-green-400'
                                        : (checkIdx===index||isNotPresent)? 'bg-red-400'
                                        : (stEnd[0]===index||stEnd[1]===index)? 'bg-yellow-400'
                                        : 'bg-white'
                                    } transition-colors duration-500`}
                            >
                                <div className={`font-semibold`}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}