import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { MdArticle } from "react-icons/md";
import { PiHandsPrayingBold } from "react-icons/pi";
import { GiPartyFlags } from "react-icons/gi";

const Explore = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen my-20">
      <Title title="Explore"/>

      <div className="w-2/3 mx-auto md:w-1/2 lg:w-1/3 flex flex-col items-center justify-center gap-5 text-black my-20">
        <div 
          className="w-full flex items-center gap-5 text-[2rem] bg-white p-5 rounded-2xl
          cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('/posts')}
        >
          <p className="ml-auto">Posts</p>
          <MdArticle className="ml-auto"/>
        </div>
        <div className="w-full flex items-center gap-5 text-[2rem] bg-white p-5 rounded-2xl
          cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('/cultures')}
        >
          <p className="ml-auto">Cultures</p>
          <PiHandsPrayingBold className="ml-auto" />
        </div>
        <div className="w-full flex items-center gap-5 text-[2rem] bg-white p-5 rounded-2xl
          cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('/events')}>
          <p className="ml-auto">Events</p>
          <GiPartyFlags className="ml-auto" strokeWidth={'10px'}/>
        </div>
      </div>
    </div>
  )
};

export default Explore;
