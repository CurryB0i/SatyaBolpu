import { createContext, ReactNode, useContext, useRef, useState } from "react";
import DialogBox from "../components/DialogBox";
import { DialogBoxContextType, DialogBoxOptions } from "../types/globals";

const DialogBoxContext = createContext<DialogBoxContextType>({
  popup: () => {
    console.warn("popup called outside of DialogBoxProvider")
  }
});

export const DialogBoxProvider = ({children} : {children: ReactNode}) => {
    const [options,setOptions] = useState<DialogBoxOptions | null>(null);
    const popup = (opts: DialogBoxOptions) => 
      setOptions({
        ...opts,
        severity: opts.severity || "default",
        onCancel: () => {
            opts.onCancel?.();
            close();
        },
        onConfirm: () => {
            opts.onConfirm?.();
            close();
        }
    });
    const closeTimeout = useRef<number | null>(null);
    const close = () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      closeTimeout.current = setTimeout(() => setOptions(null), 500);
    };

    return (
        <DialogBoxContext.Provider value={{ popup }}>
            {children}
            {options && 
                <DialogBox {...options}/>
            }
        </DialogBoxContext.Provider>
    )
}

export const useDialog = () => useContext(DialogBoxContext);
