import { createContext, ReactNode, useContext, useReducer } from "react";

export type PostDetailsType = {
  mainTitle: string;
  shortTitle: string;
  culture: "daivaradhane" | "nagaradhane" | "kambala" | "yakshagana" | "";
  description: string;
  tags: string[];
  locationSpecific: boolean;
  image: File | number | string | null;
}

export type MapDetailsType = {
  district: string;
  taluk?: string;
  village: string;
  lat: number | null;
  lng: number | null;
}

export type PostState = {
  details: PostDetailsType | null;
  content: string;
  mapDetails: MapDetailsType | null;
}

const initialPostState : PostState = {
  details: null,
  content: '',
  mapDetails: null,
}

type PostAction =
  | { type: 'SAVE_POST_DETAILS' , payload: { details: PostDetailsType } }
  | { type: 'CLEAR_POST_DETAILS' }
  | { type: 'SAVE_EDITOR_CONTENT', payload: { content: string } }
  | { type: 'CLEAR_EDITOR_CONTENT' }
  | { type: 'SAVE_MAP_DETAILS', payload: { mapDetails: MapDetailsType } }
  | { type: 'CLEAR_MAP_DETAILS' }
  | { type: 'CLEAR_POST' };

export type PostDispatch = React.Dispatch<PostAction>;

const PostReducer = (state: PostState, action: PostAction) : PostState => {
  switch(action.type) {
    case 'SAVE_POST_DETAILS': {
      localStorage.setItem('postDetails',JSON.stringify(action.payload.details));
      return {
        ...state,
        details: action.payload.details
      }
    }

    case 'CLEAR_POST_DETAILS': {
      localStorage.removeItem('postDetails');
      return {
        ...state,
        details: null
      };
    }

    case 'SAVE_EDITOR_CONTENT': {
      localStorage.setItem('postContent',action.payload.content); 
      return {
        ...state,
        content: action.payload.content
      }
    }

    case 'CLEAR_EDITOR_CONTENT': {
      localStorage.removeItem('postContent');  
      return {
        ...state,
        content: ''
      }
    }

    case 'SAVE_MAP_DETAILS': {
      localStorage.setItem('mapDetails',JSON.stringify(action.payload.mapDetails));
      return {
        ...state,
        mapDetails: action.payload.mapDetails
      }
    }

    case 'CLEAR_MAP_DETAILS': {
      localStorage.removeItem('mapDetails');
      return {
        ...state,
        mapDetails: null
      }
    }

    case 'CLEAR_POST': {
      localStorage.removeItem('postDetails');
      localStorage.removeItem('postContent');  
      localStorage.removeItem('mapDetails');
      return {
        ...initialPostState
      }
    }

    default:
      return state;
  }
}

type PostContextType = {
  state: PostState;
  dispatch: PostDispatch;
}

const PostContext = createContext<PostContextType>({
  state: initialPostState,
  dispatch: () => {
    console.warn("Dispatch used outside provider")
  }
});

export const PostProvider = ({ children } : { children: ReactNode }) => {

  const init = (): PostState => {
    const details = (() => {
      const raw = localStorage.getItem('postDetails');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).length > 0 ? parsed : null;
    })();

    const content = localStorage.getItem('postContent') || '';

    const mapDetails = (() => {
      const raw = localStorage.getItem('mapDetails');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).length > 0 ? parsed : null;
    })();

    return { details, content, mapDetails };
  };

  const [state, dispatch] = useReducer(PostReducer, initialPostState, init);

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePost = () => useContext(PostContext);
