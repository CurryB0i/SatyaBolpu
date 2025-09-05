import { Route, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import Explore from './pages/Explore'
import MAP from './pages/MAP'
import Editor from './pages/Editor'
import Categories from './pages/Categories'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard'
import Updates from './pages/Updates'
import NewPost from './pages/NewPost'
import PostDetails from './pages/PostDetails'
import Culture from './pages/Culture'
import Lenis from "@studio-freight/lenis";
import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import Create from './pages/Create'
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

gsap.registerPlugin(ScrollTrigger);

function App() {
  useLayoutEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.1,
      wheelMultiplier: 1, 
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={3000}
        limit={5}
        className='space-y-2'
        toastClassName={
          `relative font-semibold flex p-4 min-h-10 max-w-fit text-md rounded-md 
          justify-between overflow-hidden cursor-pointer mb-2 shadow-lg`
        }
        closeButton={true}
        hideProgressBar={false}
        draggable={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        pauseOnHover={true}
        theme='dark'
        style={{
          width: '320px',
        }}
      />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/explore' element={<Explore/>}/>
        <Route path='/explore/:culture' element={<Culture/>}/>
        <Route path='/create' element={<Create />}/>
        <Route path='/new-post' element={<NewPost />}/>
        <Route path='/new-post/post-details' element={<PostDetails/>}/>
        <Route path='/new-post/editor' element={<Editor/>}/>
        <Route path='/new-post/map' element={<MAP editMode/>}/>
        <Route path='/updates' element={<Updates />}/>
        <Route path='/:title/categories' element={<Categories/>}/>
        <Route path='/map' element={<MAP/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </>
  )
}

export default App
