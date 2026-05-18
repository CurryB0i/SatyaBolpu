import { PiHandsPrayingBold } from "react-icons/pi";
import { MdArticle, MdDrafts } from "react-icons/md";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Title from "../../components/Title";
import { GiPartyFlags } from "react-icons/gi";
import useApi from "../../hooks/useApi";

const Create = () => {
  const navigate = useNavigate();
  const draftsApi = useApi('/drafts', { auto: false });

  const { state: authState } = useAuth();

  const handleClick = async (type: 'post' | 'culture' | 'event') => {
    const res = await draftsApi.post({ type });
    console.log(res)
    navigate(`${type}/${res.id}`);
  }

  if(!authState.token || authState.user?.role !== 'admin')
    return <Navigate to={'/404'} replace/>

  return (
    <div className="w-screen my-20">
      <Title title="Create"/>

      <div className="w-2/3 mx-auto md:w-1/2 lg:w-1/3 flex flex-col items-center justify-center gap-5 text-black my-20">
        <div 
          className="w-full flex items-center gap-5 font-black text-[1.5rem] md:text-[2rem] bg-white p-5 rounded-2xl
            cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('/create/draft')}
        >
          <p className="ml-auto">Drafts</p>
          <MdDrafts className="ml-auto"/>
        </div>
        <div 
          className="w-full flex items-center gap-5 font-black text-[1.5rem] md:text-[2rem] bg-white p-5 rounded-2xl
            cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => handleClick('post')}
        >
          <p className="ml-auto">Post</p>
          <MdArticle className="ml-auto"/>
        </div>
        <div 
          className="w-full flex items-center gap-5 font-black text-[1.5rem] md:text-[2rem] bg-white p-5 rounded-2xl
            cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => handleClick('culture')}
        >
          <p className="ml-auto">Culture</p>
          <PiHandsPrayingBold className="ml-auto" />
        </div>
        <div 
          className="w-full flex items-center gap-5 font-black text-[1.5rem] md:text-[2rem] bg-white p-5 rounded-2xl
            cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => handleClick('event')}
        >
          <p className="ml-auto">Event</p>
          <GiPartyFlags className="ml-auto" strokeWidth={'10px'}/>
        </div>
        <div 
          className="w-full flex items-center gap-5 font-black text-[1.5rem] md:text-[2rem] bg-white p-5 rounded-2xl
            cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('/create/others')}>
          <p className="ml-auto">Others</p>
          <p className="ml-auto">...</p>
        </div>
      </div>
    </div>
  )
}

export default Create;
