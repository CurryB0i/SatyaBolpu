import { useNavigate } from "react-router-dom";
import { CardProps } from "../types/globals";
import Button from "./Button";
import { BASE_URL } from "../App";

export const NormalSkeletonCard = () => (
  <div className="w-[90%] lg:w-2/3 flex border border-white animate-pulse">
    <div className="w-1/2 lg:w-1/3 bg-gray-700 opacity-40"></div>
    <div className="w-3/5 p-5 flex gap-5 flex-col items-center justify-center">
      <div className="w-4/5 h-10 rounded-full bg-gray-600"></div>
      <div className="w-4/5 h-20 rounded-full bg-gray-600"></div>
      <div className="w-1/5 h-10 rounded-full bg-gray-600"></div>
    </div>
  </div>
);

export const NormalCard = ({ title, description, images, route }: CardProps) => {
  const navigate = useNavigate();
  console.log(route)
  return (
    <div className="w-[90%] lg:w-2/3 flex border border-white">
      <div className="w-1/2 lg:w-1/3">
        <img className="w-full h-full object-cover object-center" src={`${BASE_URL}${images[0]}`} alt={title} />
      </div>
      <div className="w-3/5 p-5 flex flex-col gap-5 items-center justify-center">
        <h1 className="text-primary text-center text-[1.5rem]">{title}</h1>
        <p className="text-white text-justify">{description}</p>
        <Button content="View More" onClick={() => navigate(route)}/>
      </div>
    </div>
  );
}
