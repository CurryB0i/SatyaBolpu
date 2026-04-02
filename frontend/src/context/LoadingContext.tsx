import { createContext, ReactNode, useContext, useState } from "react";
import LoadingPage from "../components/LoadingPage";
import { LoadingContextType } from "../types/globals";

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {
    console.warn("setLoading called outside of LoadingProvider");
  },
});

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
        {children}
        {isLoading && <LoadingPage /> }
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
