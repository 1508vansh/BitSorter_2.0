const kunalImg = new URL("../assets/kunal.jpg", import.meta.url).href;
const loveBabbarImg = new URL("../assets/loveBabbar.jpg", import.meta.url).href;
const PWImg = new URL("../assets/pwJava.jpg", import.meta.url).href;
const coderArmyImg = new URL("../assets/coderArmy.jpg", import.meta.url).href;
const pythonDSA = new URL("../assets/pythonDSA.jpg", import.meta.url).href;
import { FaPython } from "react-icons/fa";
import { FaJava } from "react-icons/fa";
import { TbBrandCpp } from "react-icons/tb";
import AnimatedWrapper from "../Ui/AnimatedWrapper";

export default function CoursesPage() {
  const courses = [
    {
      id: 1,
      language: "Java",
      title: "DSA Masterclass in Java",
      platform: "YouTube",
      link: "https://youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ&si=EQUv56xMaTAUDNVc",
      img: kunalImg,
      badge: true,
    },
    {
      id: 2,
      language: "Java",
      title: "DSA Masterclass in Java",
      platform: "YouTube",
      link: "https://youtube.com/playlist?list=PLxgZQoSe9cg00xyG5gzb5BMkOClkch7Gr&si=-MwbA1yIDMlT6vDf",
      img: PWImg,
    },
    {
      id: 3,
      language: "C++",
      title: "C++ Data Structures & Algorithms",
      platform: "YouTube",
      link: "https://youtube.com/playlist?list=PLQEaRBV9gAFu4ovJ41PywklqI7IyXwr01&si=7DFuYEcQ4KzOxiCB",
      img: coderArmyImg,
      badge: true,
    },
    {
      id: 4,
      language: "C++",
      title: "C++ Data Structures & Algorithms",
      platform: "YouTube",
      link: "https://youtube.com/playlist?list=PLDzeHZWIZsTryvtXdMr6rPh4IDexB5NIA&si=xWJyR8QMdDWO4v_F",
      img: loveBabbarImg,
    },
    {
      id: 5,
      language: "Python",
      title: "Python for Data Structures and Algorithms",
      platform: "YouTube",
      link: "https://youtube.com/playlist?list=PLhR2IpV1b2FwWwviBHRrR118YAaSlyhTU&si=SqMNia5Uy_dzMdSC",
      img: pythonDSA,
      badge: true,
    },
    // Add more courses here
  ];

  const getCoursesByLanguage = (lang) =>
    courses.filter((course) => course.language === lang);

  const renderCourseCard = (course) => (
    <a
      key={course?.id}
      href={course?.link}
      target="_blank"
      className="card bg-base-100 w-96 shadow-sm hover:scale-95 transition duration-200"
    >
      <figure>
        <img src={course?.img} alt="DSA COURSE" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {course?.title}
          {course?.badge && <div className="badge badge-secondary">Best</div>}
        </h2>
        <p>
          <span className="text-blue-700 text-sm font-semibold"> Data Structures & Algorithms </span> , with covering all the neccessary topics, From basic to Advanced 
        </p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline">{course?.platform}</div>
        </div>
      </div>
    </a>
  );

  return (
    <AnimatedWrapper>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Best DSA Courses</h1>

      {/* Java Section */}
      <section className="mb-10">
        <div className="tooltip">
          <div className="tooltip-content">
            <div className="animate-bounce text-orange-400 -rotate-10 text-2xl font-black">
              <FaJava/>
            </div>
          </div>
          <button className="text-2xl font-semibold">Java Courses</button>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {getCoursesByLanguage("Java").map((course) =>
            renderCourseCard(course)
          )}
        </div>
      </section>

      {/* C++ Section */}
      <section className="mb-10">
        <div className="tooltip">
          <div className="tooltip-content">
            <div className="animate-bounce text-orange-400 -rotate-10 text-2xl font-black">
              <TbBrandCpp/>
            </div>
          </div>
          <button className="text-2xl font-semibold">C++ Courses</button>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {getCoursesByLanguage("C++").map((course) =>
            renderCourseCard(course)
          )}
        </div>
      </section>

      {/* Python Section */}
      <section>
        <div className="tooltip">
          <div className="tooltip-content">
            <div className="animate-bounce text-orange-400 -rotate-10 text-2xl font-black">
              <FaPython/>
            </div>
          </div>
          <button className="text-2xl font-semibold">Python Courses</button>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {getCoursesByLanguage("Python").map((course) =>
            renderCourseCard(course)
          )}
        </div>
      </section>
    </div>
    </AnimatedWrapper>
  );
}
