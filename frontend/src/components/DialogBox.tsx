import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import Button from "./Button";
import Form from "./Form";
import { DialogBoxOptions } from "../types/globals";

const DialogBox: React.FC<DialogBoxOptions> = (props) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if(dialogRef.current && bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          {
            backdropFilter: 'blur(0px)'
          },
          {
            backdropFilter: 'blur(10px)',
            duration: 0.5,
            ease: 'power2.inOut'
          }
        )
        gsap.fromTo(
          dialogRef.current,
          {
            scale: 0
          },
          {
            scale: 1,
            duration: 0.5,
            ease: 'power2.inOut'
          }
        )
      }
    })

    return () => ctx.revert();
  },[]);

  const handleClick = (call? : () => void) => {
    call?.();
    if(bgRef.current && dialogRef.current) {
      dialogRef.current.style.pointerEvents = 'none';
      gsap.to(
        bgRef.current,
        {
          backdropFilter: 'blur(0px)',
          duration: 0.5,
          ease: 'power2.inOut'
        }
      );

      gsap.to(
        dialogRef.current,
        {
          scale: 0,
          duration: 0.5,
          ease: 'power2.inOut'
        }
      );
    }
  }

  return (
    <div 
      className={`w-screen h-screen flex bg-opacity-50 fixed top-0 items-center 
        justify-center z-[9999] backdrop-blur-sm overflow-hidden select-none`} 
      ref={bgRef}>
        <div 
          className="w-[90%] sm:w-2/3 md:w-1/2 lg:w-1/3 bg-black border-2 border-solid border-primary h-1/3 
            rounded-2xl flex flex-col text-center items-center justify-evenly"
          ref={dialogRef}>
            
            <div className="flex items-center justify-center flex-col">
                <p className="text-[2rem]">
                {
                    props.severity === 'irreversible' ?
                        <IoIosWarning className="text-red-500"/> :
                        props.severity === 'risky' ?
                        <IoIosWarning className="text-yellow-500"/> :
                        <FaInfoCircle className="text-gray-400"/>
                }
                </p>

                <h1 className="text-primary text-[2rem] font-bold">
                    {props.title}
                </h1>
            </div>

            <div className="w-[90%] text-white flex items-center justify-center text-wrap">
                {props.description}
            </div>

            {
              props.form &&
                <Form {...props.form}/>
            }

            <div className="flex gap-3">
                <Button 
                  content="Proceed" 
                  className="bg-green-500 text-white hover:bg-green-600" 
                  onClick={() => handleClick(props.onConfirm)}/>
                <Button 
                  content="Cancel" 
                  className="bg-red-500 text-white hover:bg-red-600" 
                  onClick={() => handleClick(props.onCancel) }/>
            </div>

        </div>
    </div>
  )
}

export default DialogBox;
