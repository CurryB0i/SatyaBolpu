import { createContext, ReactNode, useCallback, useContext, useEffect, useReducer, useRef } from "react";
import useApi from "../hooks/useApi";
import { jwtDecode } from 'jwt-decode';
import { AuthAction, AuthContextType, AuthState } from "../types/globals";

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
    
    console.log(user, token)
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
      const currentTime = Math.floor(Date.now() / 1000);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      const timeUntilExpiry = exp - currentTime;
      console.log(timeUntilExpiry)
      const refreshThreshold = 60;

      if (timeUntilExpiry <= 0) {
        dispatch({ type: 'LOGOUT' });
        return;
      }

      const refreshTime = Math.max((timeUntilExpiry - refreshThreshold) * 1000, 1000);

      refreshTimeoutRef.current = setTimeout(() => {
        refreshToken().catch(() => {});
      }, refreshTime);    } 
    catch (err) {
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
