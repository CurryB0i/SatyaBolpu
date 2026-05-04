import { useState } from "react";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { CardProps } from "../types/globals";

export const RotatingSkeletonCard = () => (
    <div className="w-1/5 bg-gray-700 animate-pulse h-120 flex items-center justify-center rounded-xl" >
      <div className="w-2/3 h-2/3 rounded-xl bg-gray-800"></div>
    </div>
);

const RotatingCard = ({ id, title, images, description }: CardProps) => {
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    if (id) {
      navigate(`/${id}/${title}`)
    }
  }

  return (
    <div className="w-1/5 perspective-[1000px] hover:scale-[1.025] transition-all duration-200 ease-in-out" 
      onClick={() => setClicked(!clicked)}>
      <div
        className={`relative w-full h-120 transition-transform duration-700 ease-in-out cursor-pointer
          transform-3d ${clicked ? 'transform-[rotateY(180deg)]' : 'transform-[rotateY(0deg)]'}`}
      >
        <div className="absolute w-full h-full bg-black text-white backface-hidden z-10
          rounded-2xl overflow-hidden border border-white border-solid">
          <img src={images[0]} alt={title} className="w-full h-4/5 object-cover" />
          <div className="h-1/5 flex items-center justify-center">
            <h3>{title}</h3>
          </div>
        </div>
        <div className="absolute w-full h-full bg-zinc-800 text-white overflow-hidden
          rounded-2xl border border-white border-solid transform-[rotateY(180deg)] backface-hidden">
          <div className="p-4 flex flex-col items-center justify-center h-full">
            <p className="h-3/4 flex items-center justify-center">{description || "No content provided"}</p>
            <Button content="View More" onClick={handleClick}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotatingCard;
