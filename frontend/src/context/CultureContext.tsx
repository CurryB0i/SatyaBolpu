import { createContext, ReactNode, useContext, useReducer } from "react";
import { CultureAction, CultureContextType, CultureState } from "../types/globals";

export const initialCultureState: CultureState = {
  details: null,
  content: ''
};

const CultureReducer = (state: CultureState,action: CultureAction): CultureState => {
  switch(action.type) {
    case 'SAVE_CULTURE_DETAILS' : {
      localStorage.setItem('cultureDetails',JSON.stringify(action.payload.details));
      return {
        ...state,
        details: action.payload.details
      }
    }

    case 'CLEAR_CULTURE_DETAILS' : {
      localStorage.removeItem('cultureDetails');
      return {
        ...state,
        details: null
      }
    }

    case 'SAVE_EDITOR_CONTENT' : {
      localStorage.setItem('cultureContent',action.payload.content);
      return {
        ...state,
        content: action.payload.content
      }
    }

    case 'CLEAR_EDITOR_CONTENT' : {
      localStorage.removeItem('cultureContent');
      return {
        ...state,
        content: ''
      }
    }

    case 'CLEAR_CULTURE' : {
      localStorage.removeItem('cultureDetails');
      localStorage.removeItem('cultureContent');
      return {
        ...initialCultureState
      }
    }

    default:
      return state;

  }
}

const CultureContext = createContext<CultureContextType>({
  state: initialCultureState,
  dispatch: () => {
    console.warn("Dipatch called outside of provider");
  }
});

export const CultureProvider = ({ children } : { children: ReactNode }) => {
  const init = (): CultureState => {
    const details = (() => {
      const raw = localStorage.getItem('cultureDetails');
      if(!raw) return null;
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).length > 0 ? parsed : null;
    })();

    const content = localStorage.getItem('cultureContent') || '';

    return { details , content };
  } 

  const [state,dispatch] = useReducer(CultureReducer, initialCultureState, init);

  return (
    <CultureContext.Provider value={{state,dispatch}}>
      {children}
    </CultureContext.Provider>
  );
};

export const useCulture = () => useContext(CultureContext);
