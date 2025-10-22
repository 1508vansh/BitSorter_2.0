import HomeCard from "./homeCard";
import HeroSection from "../Ui/heroSection";
import Section2 from "../components/Section2";
import Footer from "../components/footer";
import ThanksFooter from "../components/ThanksFooter";
import AnimatedWrapper from "../Ui/AnimatedWrapper";
import { useRef } from "react";
import { useSelector } from "react-redux";
import ArenaCard from "../Ui/ArenaCard";
import Arena from "../RoomPages/Arena";

export default function HomeBody() {

  const sectionRef = useRef(null);
  const isDark = useSelector((state) => state?.isDark?.isDark);

  const scrollToSection = () => {
    sectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const cards = [
  {
    title: "Data-Structure & Algorithm Visualizer",
    description: "Learn Data-Structures through visualization",
    color: `${isDark?'bg-gray-900':'bg-white'} border border-blue-100`,
    accent: `${isDark?'text-blue-300':'text-blue-800'}`,
    hoverColor: "hover:bg-blue-50",
  },
  {
    title: "Problems",
    description: "Practice Problems to get sharper",
    color: `${isDark?'bg-gray-900':'bg-white'} border border-purple-100`,
    accent: `${isDark?'text-purple-200':'text-purple-800'}`,
    hoverColor: "hover:bg-purple-50",
  },
    {
    title: "Courses (FREE) for learning",
    description: "Best Courses on Youtube",
    color: `${isDark?'bg-gray-900':'bg-white'} border border-orange-100`,
    accent: `${isDark?'text-pink-200':'text-pink-800'}`,
    hoverColor: "hover:bg-indigo-50",
  },
];

  //function to fetch the problems.....

  return (
    <>
    <AnimatedWrapper>
      <div className={`h-full ${isDark?'bg-gray-900':''}`}>
         <section className={`${isDark?'bg-gray-900':'bg-white'}`}>
             <HeroSection scrollfun={scrollToSection}/>
          </section>
        <div className={`${isDark?'bg-gray-900':'bg-white'} lg:mx-40`}>
           {/* First Section */}
          <AnimatedWrapper>
          <Section2/>
          </AnimatedWrapper>

          <section
             ref={sectionRef}
             className={`${isDark?'bg-gray-900':'bg-white'} w-full`}
          >
            <AnimatedWrapper>
            <h1 className={`${isDark?'bg-gray-900':'bg-white'} ${isDark?'text-white':''} text-center sm:text-4xl text-2xl font-extralight mr-5`}>Explore</h1>
            <ArenaCard/>
            <div className={`${isDark?'bg-gray-900':'bg-white'} grid grid-rows-2 grid-cols-2 gap-4 p-6 pt-5 mt-5 w-full`}>
              {cards.map((card, index) => (
                <HomeCard
                  key={index}
                  idx={index}
                  title={card.title}
                  description={card.description}
                  color={card.color}
                  accent={card.accent}
                  hov={card.hoverColor}
                />
              ))}
            </div>
            </AnimatedWrapper>
          </section>

           <AnimatedWrapper>

           <ThanksFooter/>

           </AnimatedWrapper>
          {/* Problem Section */}
        </div>
        <AnimatedWrapper>

         <Footer/>

         </AnimatedWrapper>
      </div>
      </AnimatedWrapper>
    </>
  );
}
