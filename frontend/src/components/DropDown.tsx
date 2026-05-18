import { useEffect, useRef, useState } from "react";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { cn } from "../utils/merge";

export type Option<T> = {
  name: string,
  value: T
};

export type DropDownProps<T> = {
  options: Option<T>[],
  defaultValue?: T,
  placeholder?: string,
  className?: string,
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>
}

const DropDown = <T extends string | number>({
  options,
  defaultValue,
  placeholder,
  className,
  state,
  setState
}: DropDownProps<T>) => {

  const selected =
    options.find(opt => opt.value === state)
    ?? options.find(opt => opt.value === defaultValue)
    ?? null;
  const [dropped, setDropped] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!ref.current) return;

    const handleClickOutside = (e: Event) => {
      if(!ref.current?.contains(e.target as Node)) 
        setDropped(false);
    }

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = (opt: Option<T>) => {
    setState(opt.value);
    setDropped(false);
  }

  return (
    <div 
      ref={ref}
      className={
        cn(
          "relative w-50 inline-block border border-primary",
          className
        )
      }
    >
      <div 
        className="text-primary w-full flex items-center p-1 gap-5 cursor-pointer"
        onClick={() => setDropped(!dropped)}
      >
        <p 
          className={`mx-auto ${placeholder && selected === null ? 'text-gray-400' : ''}`}
        >
          { selected?.name ?? placeholder ??  "Choose an option" }
        </p>
        <IoMdArrowDropdownCircle 
          style={{
            rotate: dropped ? '180deg' : '0deg'
          }}
          className="absolute right-1 transition-all"
        />
      </div>
      <div 
        style={{
          height: dropped ? 'auto' : '0'
        }}
        className={`absolute w-full top-full text-primary overflow-hidden transition-all
          text-center cursor-pointer z-10`}
      >
        {
          options.map((opt, id) => (
            <div
              key={id} 
              className="border hover:bg-white bg-black p-1"
              onClick={() => handleClick(opt)}
            >
              {opt.name}
            </div>
          ))
        }
      </div>
    </div>
  )
};


export default DropDown;