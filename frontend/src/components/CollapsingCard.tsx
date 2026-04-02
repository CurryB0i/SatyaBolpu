import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CardProps } from "../types/globals";
import Button from "./Button";

export const CollapsingSkeletonCard = () => (
  <div className="flex flex-col w-[90%] lg:w-2/3 border border-solid border-white rounded-lg
        overflow-hidden relative">
    <div className="w-full flex h-[25rem]">
      {
        Array(3).fill(0).map((_, i) => (
          <div key={i} className={`w-1/3 h-full ${i%2 === 0 ? 'bg-gray-500' : 'bg-gray-600'} `}></div>
        ))
      }
    </div>
    <div className="absolute bottom-0 w-full bg-gray-700 h-[5rem]"></div>
  </div>
);

export const CollapsingCard = ({ title, images, route, description }: CardProps) => {
  const [showMoreIdx, setShowMoreIdx] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [offset, setOffset] = useState<number>(0);
  const finalImages = images.length < 3 ?
                        images.length > 1 ? 
                          [images[0], images[1], images[0]] : 
                          Array(3).fill(images[0])
                        : images;

  useLayoutEffect(() => {
    if(!descriptionRef.current) return;
    setOffset(descriptionRef.current!.getBoundingClientRect().height + 15);
    const calculateOffset = () => {
      setOffset(descriptionRef.current!.getBoundingClientRect().height + 15);
    }

    window.addEventListener('resize', calculateOffset);
    return () => window.removeEventListener('resize', calculateOffset);
  }, [descriptionRef.current]);

  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (showMoreIdx !== null && cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowMoreIdx(null);
      }
    }

    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [showMoreIdx]);

  return (
    <div
      className="flex flex-col w-[90%] lg:w-2/3 border border-solid border-white rounded-lg
        overflow-hidden cursor-pointer relative"
      onClick={() => setShowMoreIdx(prev => prev !== 0 ? 0 : null)}
      ref={cardRef}
    >
      <div 
        className="w-full flex h-[25rem]"
        style={{
          opacity: showMoreIdx === 0 ? '0.5' : '1'
        }}
      >
        {
          finalImages.map((img, idx) => (
            <img 
              key={idx}
              className="w-1/3 h-full object-center object-cover"
              src={img.src}
              alt={img.alt}
            />
          ))
        }
      </div>
      <div 
        className="w-full absolute p-5 flex flex-col items-center justify-center transition-all
        bg-black bottom-0"
        style={{
          translate: showMoreIdx === 0 ? '0 0' : `0 ${offset}px`
        }}
      >
        <div className="absolute bg-black p-2 bottom-full rounded-tl-2xl rounded-tr-2xl">
          <IoIosArrowUp 
            className="text-white hover:text-primary text-[30px] transition-all" 
            style={{
              rotate: showMoreIdx === 0 ? '180deg' : '0deg'
            }}
            /> 
        </div>
        <p className="text-primary text-[2rem] font-black">{title}</p>
        <div className="flex flex-col gap-2 items-center justify-center" ref={descriptionRef}>
          <p className="text-white text-justify">
            {description}
          </p>
          <Button 
            content="View More"
            onClick={() => navigate(route)}
          />
        </div>
      </div>
    </div>
  );
}
