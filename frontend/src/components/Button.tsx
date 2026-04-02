import React from "react";
import { cn } from "../utils/merge";
import { ButtonProps } from "../types/globals";

const Button: React.FC<ButtonProps> = ({
  content,
  index,
  ref,
  className,
  type = "button",
  onClick,
  loading = false,
  loadingText,
  theme
}) => {
  return (
    <button
      className={cn(
        `p-2 rounded-md border hover:bg-white hover:text-black transition flex
        items-center justify-center gap-2 text-primary font-semibold cursor-pointer
        ${theme === 'light' ? 'bg-white hover:text-white hover:bg-black' : 'bg-black hover:text-black hover:bg-white'}
        disabled:cursor-not-allowed disabled:scale-100 disabled:bg-primary/70 disabled:text-white`,
        className
      )}
      disabled={loading}
      onClick={onClick}
      type={type}
      ref={(el) => {
        if(!el || !ref) return;
        if(ref.current && typeof index === "number" && Array.isArray(ref.current)) {
          ref.current[index] = el;
        } else {
          (ref as React.MutableRefObject<HTMLButtonElement>).current = el;
        }
      }}
    >
      {loading && (
        <svg
          className="animate-spin fill-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z" />
        </svg>
      )}
      {loading ? loadingText || content : content}
    </button>
  );
};

export default Button;
