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
      const newPost: PostState = {
        ...state,
        details: action.payload.details
      };
      localStorage.setItem('post', JSON.stringify(newPost));
      return newPost;
    }

    case 'CLEAR_POST_DETAILS': {
      const newPost: PostState = {
        ...state,
        details: null
      };
      localStorage.setItem('post', JSON.stringify(newPost));
      return newPost;
    }

    case 'SAVE_EDITOR_CONTENT': {
      const newPost: PostState = {
        ...state,
        content: action.payload.content
      };
      localStorage.setItem('post', JSON.stringify(newPost)); 
      return newPost;
    }

    case 'CLEAR_EDITOR_CONTENT': {
      const newPost: PostState = {
        ...state,
        content: ''
      };
      localStorage.setItem('post', JSON.stringify(newPost));  
      return newPost;
    }

    case 'SAVE_LOCATION': {
      const newPost: PostState = {
        ...state,
        location: action.payload.location
      };
      localStorage.setItem('post',JSON.stringify(newPost));
      return newPost;
    
    }

    case 'CLEAR_LOCATION': {
      const newPost: PostState = {
        ...state,
        location: null
      };
      localStorage.setItem('post', JSON.stringify(newPost));
      return newPost;
    }

    case 'SAVE_POST': {
      localStorage.setItem('post', JSON.stringify(action.payload.post));
      return action.payload.post;
    }

    case 'CLEAR_POST': {
      localStorage.removeItem('post');
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
    const raw = localStorage.getItem('post');
    if (!raw) return initialPostState;
    const parsed = JSON.parse(raw);
    return Object.keys(parsed).length > 0 ? parsed : initialPostState;
  };

  const [state, dispatch] = useReducer(PostReducer, initialPostState, init);

  return (
    <PostContext.Provider value={{ state, dispatch }}>
      {children}
    </PostContext.Provider>
  )
}

export const usePost = () => useContext(PostContext);
