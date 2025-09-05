import { PiHandsPrayingBold } from "react-icons/pi";
import Title from "../components/Title";
import { MdArticle } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="my-20">
        <Title title="Create"/>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-5 text-black my-20">
        <div 
          className="w-1/4 flex items-center gap-5 text-[2rem] bg-white p-5 rounded-2xl
          cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('/new-post')}
        >
          <p className="ml-auto">Post</p>
          <MdArticle className="ml-auto"/>
        </div>
        <div className="w-1/4 flex items-center gap-5 text-[2rem] bg-white p-5 rounded-2xl
          cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all"
          onClick={() => navigate('')}
        >
          <p className="ml-auto">Culture</p>
          <PiHandsPrayingBold className="ml-auto" />
        </div>
        <div className="w-1/4 flex items-center gap-5 text-[2rem] bg-white p-5 rounded-2xl
          cursor-pointer hover:bg-primary hover:text-white hover:scale-105 transition-all">
          <p className="ml-auto">Tag</p>
          <FaHashtag className="ml-auto" />
        </div>
      </div>
    </div>
  )
}

export default Create;
