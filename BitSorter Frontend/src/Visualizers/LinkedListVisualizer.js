import { useSelector } from "react-redux";
import { useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
export default function QueueVisualizer(){
    let isDark = useSelector((state)=>state.isDark.isDark);
    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';
    let [instruction,setInstruction] = useState('');
    let [inputList,SetIntputList] = useState([]);
    let [inputNumber,setInputNumber] = useState('');
    let [removeIdx,setRemoveIdx] = useState(-1);
    let [addedIdx,setAddedIdx] = useState(-1);
    function setNumber(val){
        if(isNaN(val))return;
            setInputNumber(Number(val));
    }
    function addAtHead(){
        if(inputList.length>9)return;
        if(inputNumber === '' || isNaN(inputNumber)) return;
        setAddedIdx(0);
        SetIntputList([inputNumber,...inputList]);
        setRemoveIdx(-1);
        setInputNumber('');
        document.getElementById('inputNumber').value = '';
    }
    function addAtEnd(){
        if(inputList.length>9)return;
        if(inputNumber === '' || isNaN(inputNumber)) return;
        setAddedIdx(inputList.length);
        SetIntputList([...inputList,inputNumber]);
        document.getElementById('inputNumber').value = '';
        setInputNumber('');
        setRemoveIdx(-1);
    }
    function RemoveAtTail(){
        setAddedIdx(-1);
        setRemoveIdx(inputList.length-1);
        setInputNumber('');
        setTimeout(()=>{
          let arr = [...inputList];
          arr.pop();
          SetIntputList(arr);
          setRemoveIdx(-1);
        },1000)
    }
    function RemoveAtHead(){
        setAddedIdx(-1);
        setRemoveIdx(0);
        setInputNumber('');
        setTimeout(()=>{
        let arr = [...inputList];
        arr.shift();
        SetIntputList(arr);
        setRemoveIdx(-1);
        },1000);
    }
    return(
        <>
         <div className={`h-screen ${isDark?'bg-gray-900':''} sm:w-[80%] w-full pt-6 mx-auto text-center justify-center`}>
        <div className={`p-5 rounded-lg sm:w-[60%] w-[95%] shadow-lg mx-auto text-center justify-center ${bgColor}`}>
                <h1 className={`${textColor} text-3xl font-bold mb-4`}>LinkedList Visualizer</h1>
            <div className="w-[100%] flex flex-col mt-4 items-center">
            <div className="w-[80%] flex justify-center mb-4">
                    <input
                        id="inputNumber"
                        className={`py-1 border-2 w-40 ${isDark?'border-white':'border-black'} ${isDark?'placeholder:text-white':''} rounded-xl px-6`}
                        onChange={(e)=>setNumber(e.target.value)}
                        type="text"
                        maxLength={10}
                        placeholder="Input Element"
                    />
            </div>
            </div>
            <div className="w-[80%] flex justify-center flex-wrap mb-4 gap-2 mx-auto">
            <div>
                <button onClick={()=>addAtEnd()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">AddAtTail</button>
            </div>
            <div>
            <button onClick={()=>addAtHead()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">AddAtHead</button>
            </div>
            <div>
                <button onClick={()=>RemoveAtTail()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">RemoveFromTail</button>
            </div>
            <div>
            <button onClick={()=>RemoveAtHead()} className="text-white font-bold bg-red-500 py-1.5 px-4 rounded-sm">RemoveAtHead</button>
            </div>
            </div>
            </div>
            <div className="mt-4 sm:w-[100%] w-[95%] h-[40%] border-2 gap-1 border-gray-400 rounded-xl mx-auto py-3 px-3 flex flex-col items-center">
                    <div className="font-bold flex justify-center items-center">{instruction}</div>
                    {/* <div className={`flex justify-center items-center w-full h-20`}>{instruction}</div> */}
                    <div className="flex gap-0.5 py-0.5 justify-center items-center w-[95%] h-[30%]">
                        {inputList.map((value, index) => (
                            <div key={index} className="flex justify-center items-center">
                            <div className={`sm:w-25 sm:h-15 w-15 h-10  sm:px-0 px-2 flex justify-center gap-2 items-center rounded-sm border-2 mx-1
                              ${removeIdx==index?'bg-red-500':addedIdx==index?'bg-green-500':'bg-white'}
                               transition-colors duration-500`
                            }>
                                <div className="font-semibold">{value}</div>
                                <div className="border-1 border-black sm:h-15 h-9"></div>
                                <div className="font-semibold">Next</div>
                            </div>
                            <div className={`text-green-600 text-2xl`}><FaArrowRightLong/></div>
                            {index===inputList.length-1?
                            <div className={`font-semibold text-2xl text-blue-500`}>NULL</div>:<div></div>
                            }
                            </div>
                        ))}
                </div>
            </div>
            </div>
        </>
    );
}