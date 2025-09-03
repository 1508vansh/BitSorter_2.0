import { useNavigate } from "react-router"
export default function MathVisualizer(){
    const navigate = useNavigate();
    return(
        <>
        <div className="h-screen w-screen flex justify-center items-center">
           <button onClick={()=>navigate('/visualizer')} className="rounded-sm bg-purple-500 py-2 text-2xl px-2.5 text-white">Coming Soon</button>
        </div>
        </>
    )
}