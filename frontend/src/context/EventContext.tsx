import { createContext, ReactNode, useContext, useReducer } from "react";
import { EventAction, EventState } from "../types/globals";

const initialEventState: EventState = {
  details: null,
  location: null,
};

export type EventDispatch = React.Dispatch<EventAction>;

const EventReducer = (state: EventState,action: EventAction): EventState => {
  switch(action.type) {
    case 'SAVE_EVENT_DETAILS' : {
      localStorage.setItem('eventDetails', JSON.stringify(action.payload.details));
      return {
        ...state,
        details: action.payload.details
      };
    }

    case 'CLEAR_EVENT_DETAILS' : {
      localStorage.removeItem('eventDetails');
      return {
        ...state,
        details: null
      };
    }

    case 'SAVE_LOCATION' : {
      localStorage.setItem('eventLocation', JSON.stringify(action.payload.location));
      return {
        ...state,
        location: action.payload.location
      };
    }

    case 'CLEAR_LOCATION' : {
      localStorage.removeItem('eventLocation');
      return {
        ...state,
        location: null
      };
    }

    case 'CLEAR_EVENT': {
      localStorage.removeItem('eventDetails');
      localStorage.removeItem('eventLocation');
      return {
        ...initialEventState
      };
    }

    default:
      return state;

  }
}

type EventContextType = {
  state: EventState;
  dispatch: EventDispatch;
};

const EventContext = createContext<EventContextType>({
  state: initialEventState,
  dispatch: () => {
    console.warn("Dipatch called outside of provider");
  }
});

export const EventProvider = ({ children } : { children: ReactNode }) => {
  const init = (): EventState => {
    const details = (() => {
      const raw = localStorage.getItem('eventDetails');
      if(!raw) return null;
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).length > 0 ? parsed : null;
    })();

    const location = (() => {
      const raw = localStorage.getItem('eventLocation');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Object.keys(parsed).length > 0 ? parsed : null;
    })();

    return { details , location };
  } 

  const [state, dispatch] = useReducer(EventReducer, initialEventState, init);

  return (
    <EventContext.Provider value={{state,dispatch}}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
