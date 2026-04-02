import { createContext, ReactNode, useContext, useReducer } from "react";
import { PostAction, PostContextType, PostState } from "../types/globals";

const initialPostState : PostState = {
  details: null,
  content: '',
  location: null,
};

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

    case 'SAVE_LOCATION': {
      localStorage.setItem('postLocation',JSON.stringify(action.payload.location));
      return {
        ...state,
        location: action.payload.location
      }
    }

    case 'CLEAR_LOCATION': {
      localStorage.removeItem('postLocation');
      return {
        ...state,
        location: null
      }
    }

    case 'CLEAR_POST': {
      localStorage.removeItem('postDetails');
      localStorage.removeItem('postContent');  
      localStorage.removeItem('postLocation');
      return {
        ...initialPostState
      }
    }

    default:
      return state;
  }
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

    const location = (() => {
      const raw = localStorage.getItem('postLocation');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).length > 0 ? parsed : null;
    })();

    return { details, content, location };
  };

  const [state, dispatch] = useReducer(PostReducer, initialPostState, init);

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePost = () => useContext(PostContext);
