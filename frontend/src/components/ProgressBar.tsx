import { useLayoutEffect, useMemo } from "react";
import { MdDone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CultureState, EventState, PostState } from "../types/globals";

type PropsType = {
  steps: Record<string,string>;
  progress: number;
  setProgress: (progress: number) => void;
  state: PostState | CultureState | EventState;
}

const ProgressBar: React.FC<PropsType> = ({ steps, progress, setProgress, state }) => {
  const navigate = useNavigate();
  const offset = useMemo(
    () => 100 / (Object.keys(steps).length - 1)
  ,[steps]);

  useLayoutEffect(() => {
    let width = 0;
    for(const value of Object.values(state)) {
      if(!value) {
        break
      }
      width += offset
    }

    setProgress(width)
  },[state]);

  return (
    <>
      <div className="flex text-white w-[80%] sm:w-2/3 md:w-1/2 h-10 bg-white 
        mx-auto items-center justify-between relative rounded-full">
        <div 
          className="absolute z-10 h-10 bg-primary transition-all duration-300" 
          style={{
            borderTopLeftRadius: '9999px',
            borderBottomLeftRadius: '9999px',
            borderTopRightRadius: progress >= 100 ? '9999px' : '',
            borderBottomRightRadius: progress >= 100 ? '9999px' : '',
            width: `${Math.min(progress,100)}%`
          }}
          ></div>
        {
          Object.values(steps).map((step,index) => {
            const isDisabled = index === 0 ? false : progress < offset * index;
            const isCompleted = progress > offset*index;
            return (
              <div className="flex z-20 flex-col items-center justify-center" key={index}>
                <div 
                  className={`outline-primary outline rounded-full w-9 h-9 text-center transition-all flex items-center justify-center 
                    ${isDisabled ? 
                      'cursor-not-allowed bg-gray-400' :
                      'cursor-pointer hover:scale-110 hover:bg-primary hover:text-black hover:outline-black bg-black'}`} 
                  onClick={() => {
                    if(!isDisabled) 
                      navigate(`${step}`) 
                  }}
                >
                  {
                    isCompleted ? 
                      <MdDone /> : index+1
                  }
                </div>
                <div className="absolute text-sm md:text-lg -bottom-10 text-nowrap cursor-pointer">
                  {Object.keys(steps)[index]}
                </div>
              </div>
            )
          })
        }
      </div>

    </>
  )
}

export default ProgressBar;
