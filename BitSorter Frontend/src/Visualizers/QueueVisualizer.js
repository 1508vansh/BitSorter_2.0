import { useSelector } from "react-redux";
import { useState } from "react";
export default function QueueVisualizer(){
    let isDark = useSelector((state)=>state.isDark.isDark);
    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';
    let [queue,setQueue] = useState([]);
    let [input,setInput] = useState('');
    let [peekIdx,setPeekIdx] = useState(-1);
    let [dequeIdx,setDequeIdx] = useState(-1);
    let [instruction,setInstruction] = useState('');
    function pushElememt(){
        if(input==='') return;
        let num = parseInt(input);
        if(isNaN(num)) return;
        if(queue.length>=10){
             setInstruction(`The queue is Full!`);
             return;
        }
        setQueue([...queue, input]);
        setInput('');
        document.getElementById('inputNumber').value = '';
        setPeekIdx(-1);
        setDequeIdx(-1);
        setInstruction(`Inserted Element ${num} in the Queue`);
    }
    function popElement(){
        if(queue.length===0){
            setInstruction(`Queue is Empty Man!`);
            setTimeout(()=>{
                setInstruction('');
            },3000);
        }
        else {
        setDequeIdx(0);
        setInstruction(`Removed Element ${queue[0]} from the Queue`);
        setTimeout(() => {
        setQueue([...queue.slice(1)]);
        setDequeIdx(-1);
        }, 1000);
        setPeekIdx(-1);
        }
        if(queue.length==1){
           setTimeout(()=>{
             setInstruction('');
           },3000)
        }
    }
    function peekElement(){
        if(queue.length>0){
            setInstruction(`Front Element is ${queue[0]}`);
            setPeekIdx(0);
        }else{
            setPeekIdx(-1);
        }
        setDequeIdx(-1);
    }
    function rearElement(){
        if(queue.length>0){
            setInstruction(`Rear Element is ${queue[queue.length-1]}`);
            setPeekIdx(queue.length-1);
        }else{
            setPeekIdx(-1);
        }
    }
    return(
        <>
         <div className={`h-screen ${isDark?'bg-gray-900':''} sm:w-[80%] w-[90%] pt-6 mx-auto text-center justify-center`}>
        <div className={`p-5 rounded-lg sm:w-[40%] w-full shadow-lg mx-auto text-center justify-center ${bgColor}`}>
                <h1 className={`${textColor} sm:text-3xl text-2xl font-bold mb-4`}>Queue Visualizer</h1>
            <div className="w-[100%] flex flex-col mt-4 items-center">
            <div className="w-[80%] flex justify-center mb-4">
                    <input
                        id="inputNumber"
                        className={`py-1 border-2 w-40 ${isDark?'border-white':'border-black'} ${isDark?'placeholder:text-white':''} rounded-xl px-6`}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        maxLength={10}
                        placeholder="Input Element"
                    />
            </div>
            </div>
            <div className="w-[80%] flex justify-center mb-4 gap-2 mx-auto">
            <div>
                <button onClick={()=>pushElememt()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">Enque</button>
            </div>
            <div>
                <button onClick={()=>popElement()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">Deque</button>
            </div>
            <div>
            <button onClick={()=>peekElement()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">Front</button>
            </div>
            <div>
            <button onClick={()=>rearElement()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">Rear</button>
            </div>
            </div>
            </div>
            <div className="mt-4 sm:w-[80%] sm:[95%] h-[60%] border-2 gap-1 border-gray-400 rounded-xl mx-auto py-3 px-3 flex flex-col items-center">
                    <div className="font-bold flex justify-center items-center">{instruction}</div>
                    {/* <div className={`flex justify-center items-center w-full h-20`}>{instruction}</div> */}
                    <div className="flex flex-row-reverse gap-0.5 py-0.5 justify-start border-y-2 border-black items-center sm:w-[60%] w-[90%] h-[60%]">
                        {queue.map((value, index) => (
                            <div
                                key={index}
                                className={`w-20 h-full flex justify-center items-center rounded-sm border-2 mx-1
                                    ${peekIdx===index ? 'bg-green-400'
                                        : (dequeIdx==index)? 'bg-red-400'
                                        : 'bg-blue-400'
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