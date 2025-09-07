import { PiHandsPrayingBold } from "react-icons/pi";
import Title from "../components/Title";
import { MdArticle } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Create = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();

  if(!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace/>

  return (
    <div className="w-full">
      <div className="my-20">
        <Title title="Create"/>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-5 text-black my-20">
        <div 
          className="w-1/4 flex items-center gap-5 text-[2rem] bg-white p-5 rounded-2xl
          cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('/create/new-post')}
        >
          <p className="ml-auto">Post</p>
          <MdArticle className="ml-auto"/>
        </div>
        <div className="w-1/4 flex items-center gap-5 text-[2rem] bg-white p-5 rounded-2xl
          cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('/create/new-culture')}
        >
          <p className="ml-auto">Culture</p>
          <PiHandsPrayingBold className="ml-auto" />
        </div>
        <div className="w-1/4 flex items-center gap-5 text-[2rem] bg-white p-5 rounded-2xl
          cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('/create/new-tag')}>
          <p className="ml-auto">Tag</p>
          <FaHashtag className="ml-auto" />
        </div>
      </div>
    </div>
  )
}

export default Create;
