import { createContext, ReactNode, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import useApi from "../hooks/useApi";
import { jwtDecode } from 'jwt-decode';

type User = {
  id: string;
  name: string;
  uname: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  verified: boolean;
}

type AuthState = {
  user: User | null;
  token: string | null;
  isRefreshing: boolean;
};

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_START' }
  | { type: 'REFRESH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REFRESH_FAILED' };

const initialState: AuthState = {
  user: null,
  token: null,
  isRefreshing: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { 
        user: action.payload.user, 
        token: action.payload.token, 
        isRefreshing: false 
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'REFRESH_START':
      return { ...state, isRefreshing: true };
    case 'REFRESH_SUCCESS':
      return { 
        user: action.payload.user, 
        token: action.payload.token, 
        isRefreshing: false 
      };
    case 'REFRESH_FAILED':
      return { ...initialState };
    default:
      return state;
  }
};

type AuthContextType = {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType>({
  state: initialState,
  dispatch: () => {
    console.warn("dispatch called outside of AuthProvider");
  },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, error, post } = useApi('/auth/refresh', { auto: false });
   const [state, dispatch] = useReducer(authReducer, initialState, () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token) {
      try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        const currentTime = Date.now() / 1000;
        
        if (exp <= currentTime) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return initialState;
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return initialState;
      }
    }
    
    return { user, token, isRefreshing: false };
  }); 
  const refreshTimeoutRef = useRef<number | null>(null);
  const isRefreshingRef = useRef(false);

  const refreshToken = useCallback(async () => {
    if (isRefreshingRef.current || state.isRefreshing) {
      return;
    }

    try {
      isRefreshingRef.current = true;
      dispatch({ type: 'REFRESH_START' });
      
      await post({});
    } catch (err) {
      console.error('Token refresh failed:', err);
      dispatch({ type: 'REFRESH_FAILED' });
    } finally {
      isRefreshingRef.current = false;
    }
  }, [post]);

  const scheduleTokenRefresh = useCallback((token: string) => {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = exp - currentTime;
      const refreshThreshold = 300;
      
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      if (timeUntilExpiry > refreshThreshold) {
        const refreshTime = (timeUntilExpiry - refreshThreshold) * 1000;
        refreshTimeoutRef.current = setTimeout(() => {
          refreshToken();
        }, refreshTime);
        
        console.log(`Token refresh scheduled in ${Math.round(refreshTime / 1000)} seconds`);
      } else if (timeUntilExpiry > 0) {
        refreshToken();
      } else {
        console.warn('Token is already expired');
        dispatch({ type: 'LOGOUT' });
      }
    } catch (err) {
      console.error('Invalid token:', err);
      dispatch({ type: 'LOGOUT' });
    }
  }, [refreshToken]);

  useEffect(() => {
    if (state.token && !state.isRefreshing) {
      scheduleTokenRefresh(state.token);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }
    };
  }, [state.token, scheduleTokenRefresh]);

  useEffect(() => {
    if (data?.accessToken && state.isRefreshing) {
      console.log('Token refreshed successfully');
      dispatch({
        type: 'REFRESH_SUCCESS',
        payload: { user: data.user, token: data.accessToken },
      });
    }
    
    if (error && state.isRefreshing) {
      console.error('Refresh error:', error);
      dispatch({ type: 'REFRESH_FAILED' });
    }
  }, [data, error, state.isRefreshing]);

  useEffect(() => {
    if (state.token && state.user) {
      localStorage.setItem('token', state.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [state.token, state.user]);

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
