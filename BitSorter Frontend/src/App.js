import { Routes, Route, Outlet } from "react-router";
import Navbar from "./components/navbar";
import Home from "./Pages/home";

import SecondPage from './Pages/SecondPage';
import Backtracking from './Visualizers/Backtracking';
import SortingVisualizer from './Visualizers/SortingVisualizer';
import SearchingVisualizer from './Visualizers/SearchingVisualizer';
import GraphVisualizer from './Visualizers/GraphVisualizer';
import GreedyVisualizer from './Visualizers/GreedyVisualizer';
import DpVisualizer from './Visualizers/DpVisualizer';
import TreeVisualizer from './Visualizers/TreeVisualizer';
import MathVisualizer from './Visualizers/MathVisualizer';
import LinkedListVisualizer from './Visualizers/LinkedListVisualizer';
import StackVisualizer from './Visualizers/StackVisualizer';
import QueueVisualizer from './Visualizers/QueueVisualizer';
import ScrollToTop from './Ui/ScrollToTop';
import Login from "./authentication/login";
import ProblemPage from "./Pages/problemPage";
import ProfilePage from "./Pages/profilePage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

import AdminLayout from "./AdminPanel/AdminLayout";
import AdminFront from "./AdminPanel/AdminFront";
import AdminCreate from './AdminPanel/AdminOperations/adminCreate';
import AdminUpdateList from './AdminPanel/AdminOperations/updateProblemList';
import AdminUpdate from "./AdminPanel/AdminOperations/adminUpdate";
import AdminDelete from './AdminPanel/AdminOperations/adminDelete';
import ProblemShow from "./Pages/ProblemShow";
import BegginerSheet from "./components/begginerSheet";
import CoursesPage from "./Pages/CoursesPage";
import AboutUs from "./Pages/AboutUs";
import Arena from './RoomPages/Arena';
import RoomProblemPage from './RoomPages/RoomProblemPage';
import RoomProblemSection from './RoomPages/RoomProblemSection';
import Loader from "./Ui/Loader";
import OAuthSuccess from "./authentication/OAuthSuccess";

export default function App() {

  const CenteredLoader = () => (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.7)'
      }}>
        <Loader />
      </div>
    );

  const navigate = useNavigate();
  const {isAuthorized,loading} = useSelector((state)=>state?.auth);
  const isDark = useSelector((state) => state?.isDark?.isDark);
  return (
    <>
    <div className={`${isDark?'bg-gray-900':'bg-white'}`}>
      <Navbar /> {/* Showed only after login/register */}
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={isAuthorized?<Home />:navigate('/login')} />
        <Route path="/oauthSuccess" element={<OAuthSuccess />} /> 
        <Route
        path="*"
        element={loading ? <CenteredLoader /> : isAuthorized ? <Home /> : navigate("/login")}/>


        <Route path='/problem/:id' element={isAuthorized?<ProblemPage/>:navigate('/login')}/>
        <Route path='/profile' element={isAuthorized?<ProfilePage/>:navigate('/login')}/>
        <Route path="/problemShow" element={isAuthorized?<ProblemShow/>:navigate('/login')}/>
        <Route path="/begineerSheet" element={isAuthorized?<BegginerSheet/>:navigate('/login')}/>
        <Route path="/courses" element={isAuthorized?<CoursesPage/>:navigate('/login')}/>
        <Route path="/aboutUs" element={isAuthorized?<AboutUs/>:navigate('/login')}/>
        
        {/*visualizer routes*/}
        <Route path="/visualizer" element={<SecondPage />} />
        <Route path="/visualizer/sorting" element={<SortingVisualizer />} />
        <Route path="/visualizer/searching" element={<SearchingVisualizer />} />
        <Route path="/visualizer/dp" element={<DpVisualizer />} />
        <Route path="/visualizer/graph" element={<GraphVisualizer />} />
        <Route path="/visualizer/tree" element={<TreeVisualizer />} />
        <Route path="/visualizer/math" element={<MathVisualizer />} />
        <Route
          path="/visualizer/linked-List"
          element={<LinkedListVisualizer />}
        />
        <Route path="/visualizer/backTracking" element={<Backtracking />} />
        <Route path="/visualizer/greedy" element={<GreedyVisualizer />} />
        <Route path="/visualizer/stack" element={<StackVisualizer />} />
        <Route path="/visualizer/queue" element={<QueueVisualizer />} />

        {/*admin panel routes*/}

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminFront />} />
          <Route path="create-problem" element={<AdminCreate/>} />
          <Route path="update-problem" element={<AdminUpdateList/>} />
          <Route path="delete-problem" element={<AdminDelete/>} />
        </Route>
        <Route path="/admin/update-problem/:id" element={<AdminUpdate/>}/>

        {/*Arena Room routes*/}
        <Route path="/Arena" element={<Arena />} />
        <Route path="/RoomProblemSection" element={isAuthorized?<RoomProblemSection/>:navigate('/login')}/>
         <Route path='/RoomProblem/:id' element={isAuthorized?<RoomProblemPage/>:navigate('/login')}/>
      </Routes>
      </div>
    </>
  );
}
