import { Route, Routes } from 'react-router-dom'
import NotFound from './components/NotFound'
import Home from './pages/Home'
import Explore from './pages/Explore'
import MAP from './pages/MAP'
import Editor from './pages/Admin/Editor'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard'
import NewPost from './pages/Admin/NewPost'
import PostDetails from './pages/Admin/PostDetails'
import Culture from './pages/Culture'
import Lenis from "lenis";
import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import Create from './pages/Admin/Create'
import NewCulture from './pages/Admin/NewCulture'
import CultureDetails from './pages/Admin/CultureDetails'
import NewTag from './pages/Admin/NewTag'
import Posts from './pages/Posts'
import Post from './pages/Post'
import Cultures from './pages/Cultures'
import NewEvent from './pages/Admin/NewEvent'
import { Mode } from './types/enums'
import EventDetails from './pages/Admin/EventDetails'
import Drafts from './pages/Admin/Drafts'
import Others from './pages/Admin/Others'
import NewPostType from './pages/Admin/NewPostType'
import NewPostGroup from './pages/Admin/NewPostGroup'
import Events from './pages/Events'
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

gsap.registerPlugin(ScrollTrigger);

function App() {
  useLayoutEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      allowNestedScroll: true,
      smoothWheel: true,
      duration: 0.8,
      wheelMultiplier: 1,
      syncTouch: true,
      syncTouchLerp: 0.1,
      touchMultiplier: 1.5
    });


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
        toastClassName={
          `relative font-semibold flex p-4 min-h-10 max-w-fit text-md rounded-md 
          justify-between overflow-hidden cursor-pointer m-2 shadow-lg`
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
        }}
      />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/cultures' element={<Cultures />} />
        <Route path='/cultures/:culture' element={<Culture />} />
        <Route path='/posts' element={<Posts />} />
        <Route path='/posts/:postId' element={<Post />} />
        <Route path='/events' element={<Events />} />
        <Route path='/create' element={<Create />} />
        <Route path='/create/others' element={<Others />} />
        <Route path='/create/draft' element={<Drafts />} />
        <Route path='/create/post/:id' element={<NewPost />} />
        <Route path='/create/post/:id/details' element={<PostDetails />} />
        <Route path='/create/post/:id/editor' element={<Editor mode={Mode.POST} />} />
        <Route path='/create/post/:id/map' element={<MAP editMode={Mode.POST} />} />
        <Route path='/create/culture/:id' element={<NewCulture />} />
        <Route path='/create/culture/:id/details' element={<CultureDetails />} />
        <Route path='/create/culture/:id/editor' element={<Editor mode={Mode.CULTURE} />} />
        <Route path='/create/event/:id' element={<NewEvent />} />
        <Route path='/create/event/:id/details' element={<EventDetails />} />
        <Route path='/create/event/:id/map' element={<MAP editMode={Mode.EVENT} />} />
        <Route path='/create/tag' element={<NewTag />} />
        <Route path='/create/post-type' element={<NewPostType />} />
        <Route path='/create/post-group' element={<NewPostGroup />} />
        <Route path='/map' element={<MAP />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
