import { useNavigate } from "react-router-dom";
import { CardProps } from "../types/globals";
import Button from "./Button";
import { BASE_URL } from "../App";
import { RiEdit2Fill } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

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

export const NormalCard = ({ id, title, description, images, handleEdit }: CardProps) => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();

  return (
    <div className="w-[90%] h-80 lg:w-2/3 flex border border-white">
      <div className="w-[40%] h-full md:w-1/3 overflow-hidden flex items-center justify-center">
        <img 
          className="w-full h-full object-cover object-center" 
          src={`${BASE_URL}${images[0]}`} 
          alt={title}
        />
      </div>
      <div className="w-[60%] md:w-2/3 h-full p-5 flex flex-col gap-5 items-center justify-center">
        <h1 className="text-primary text-center text-[1.5rem]">{title}</h1>
        <p 
          style={{
            scrollbarWidth: 'none'
          }}
          className="text-white w-full h-4/5 overflow-y-scroll text-[0.75rem] md:text-[1rem] text-justify"
        >{description}</p>
        <div className="flex items-center justify-center gap-2 relative">
          <Button content="View More" onClick={() => navigate(id)}/>
          {
            authState.user?.role === "admin" && (
              <div
                className="border-primary text-primary border rounded-lg p-1 hover:bg-white 
                  hover:text-black cursor-pointer"
                onClick={() => handleEdit(id)}
              >
                <RiEdit2Fill 
                  className="text-[1.5rem] md:text-[2rem]"
                />
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
