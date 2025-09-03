import AlgorithmCards from "../Ui/AlgorithmCards"
import AnimatedWrapper from "../Ui/AnimatedWrapper"
export default function SecondPage(){
    return(
        <>
            <AnimatedWrapper threshold={0.1}>
            <AlgorithmCards/>
            </AnimatedWrapper>
        </>
    )
}