import { useSelector } from "react-redux";
import { useState } from "react";
import ReverseStack from '../components/ReverseStack';
export default function StackVisualizer(){
    let isDark = useSelector((state)=>state.isDark.isDark);
    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';
    let [IsReveseStack,setIsReverseStack] = useState(false);
    let [stack,setStack] = useState([]);
    let [input,setInput] = useState('');
    let [peekIdx,setPeekIdx] = useState(-1);
    let [popIdx,setPopIdx] = useState(-1);
    let [instruction,setInstruction] = useState('');
    function pushElememt(){
        if(input==='') return;
        let num = parseInt(input);
        if(isNaN(num)) return;
        if(stack.length>=10){
             setInstruction(`The Stack is Full!`);
             return;
        }
        setStack([...stack, input]);
        setInput('');
        document.getElementById('inputNumber').value = '';
        setPeekIdx(-1);
        setPopIdx(-1);
        setInstruction(`Pushed Element ${num} in the Stack`);
    }
    function popElement(){
        if(stack.length===0){
            setInstruction(`Stack is Empty Man!`);
            setTimeout(()=>{
                setInstruction('');
            },3000);
        }
        else {
        setPopIdx(stack.length-1);
        setInstruction(`Poped Element ${stack[stack.length-1]} from the Stack`);
        setTimeout(() => {
        setStack([...stack.slice(0, -1)]);
        }, 1000);
        setPeekIdx(-1);
        }
        if(stack.length==1){
           setTimeout(()=>{
             setInstruction('');
           },3000)
        }
    }
    function peekElement(){
        if(stack.length>0){
            setInstruction(`Peek Element is ${stack[stack.length-1]}`);
            setPeekIdx(stack.length-1);
        }else{
            setPeekIdx(-1);
        }
        setPopIdx(-1);
    }
    function CallReverseStack(){
        if(stack.length==0||stack.length==1)return;
        setIsReverseStack(true);
    }
    return(
        <>
         <div className={`h-full ${isDark?'bg-gray-900':''} sm:w-[80%] w-full pt-6 mx-auto text-center justify-center`}>
         { IsReveseStack?<ReverseStack MainStack={stack}/>
         :
            <>
        <div className={`p-5 rounded-lg sm:w-[40%] w-[80%] shadow-lg mx-auto text-center justify-center ${bgColor}`}>
                <h1 className={`${textColor} text-3xl font-bold mb-4`}>Stack Visualizer</h1>
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
                <button onClick={()=>pushElememt()} className="text-white sm:text-base text-xs font-bold bg-red-500 py-1.5 px-4 rounded-sm">Push</button>
            </div>
            <div>
                <button onClick={()=>popElement()} className="text-white sm:text-base text-xs font-bold bg-red-500 py-1.5 px-4 rounded-sm">Pop</button>
            </div>
            <div>
            <button onClick={()=>peekElement()} className="text-white sm:text-base text-xs font-bold bg-red-500 py-1.5 px-4 rounded-sm">Peek</button>
            </div>
            <div>
            <button onClick={()=>CallReverseStack()} className="text-white sm:text-base text-xs font-bold bg-red-500 py-1.5 px-4 rounded-sm">Revese Stack</button>
            </div>
            </div>
            </div>
            <div className="mt-4 w-[80%] sm:h-full h-96 border-2 gap-1 border-gray-400 rounded-xl mx-auto py-3 px-3 flex flex-col items-center">
                    <>
                    <div className="font-bold flex justify-center items-center">{instruction}</div>
                    <div className={`flex flex-col-reverse px-0.5 pb-0.5 gap-0.5 justify-start border-b-2 border-x-2 ${isDark?'border-white':'border-black'} items-center sm:w-[30%] w-[80%] sm:h-96 h-60`}>
                        {stack.map((value, index) => (
                            <div
                                key={index}
                                className={`w-full h-20 flex justify-center items-center rounded-sm border-2 mx-2
                                    ${peekIdx===index ? 'bg-green-400'
                                        : (popIdx==index)? 'bg-red-400'
                                        : 'bg-blue-400'
                                    } transition-colors duration-500`}
                            >
                                <div className={`font-semibold`}>{value}</div>
                            </div>
                        ))}
                    </div>
                    </>
                </div>
                </>
                }
            </div>
        </>
    );
}