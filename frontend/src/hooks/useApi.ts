import { useCallback, useEffect, useState, useRef } from "react";
import { BASE_URL } from "../App";

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiOptions extends Omit<RequestInit, 'body' | 'method'> {
    method?: Method;
    body?: any;
    auto?: boolean;
}

interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (opts?: Partial<ApiOptions>) => Promise<T | null>;
    post: (body: any, opts?: Partial<ApiOptions>) => Promise<T | null>;
    put: (body: any, opts?: Partial<ApiOptions>) => Promise<T | null>;
    patch: (body: any, opts?: Partial<ApiOptions>) => Promise<T | null>;
    del: (opts?: Partial<ApiOptions>) => Promise<T | null>;
    reset: () => void;
}

const useApi = <T = any>(endpoint: string, initOptions: ApiOptions = {}): ApiState<T> => {
    const [state, setState] = useState<Omit<ApiState<T>, "refetch" | "post" | "put" | "patch" | "del" | "reset">>({
        data: null,
        loading: false,
        error: null,
    });
    
    const isMountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const fetchData = useCallback(async (options: ApiOptions = {}): Promise<T | null> => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        
        const mergedOptions = {
            method: 'GET' as Method,
            ...initOptions,
            ...options,
        };

        if (!isMountedRef.current) return null;

        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const requestOptions: RequestInit = {
                ...mergedOptions,
                method: mergedOptions.method,
                signal: abortControllerRef.current.signal,
                credentials: 'include'
            };

            const isFormData = mergedOptions.body instanceof FormData;
            const isFile = mergedOptions.body instanceof File;
            const isBlob = mergedOptions.body instanceof Blob;

            if(isFormData || isFile || isBlob) {
              requestOptions.headers = {
                ...(mergedOptions.headers || {})
              }

              requestOptions.body = mergedOptions.body;
            } else if (mergedOptions.body && ['POST', 'PUT', 'PATCH'].includes(mergedOptions.method || 'GET')) {
                requestOptions.headers = {
                    'Content-Type': 'application/json',
                    ...(mergedOptions.headers || {})
                };
                requestOptions.body = typeof mergedOptions.body === 'string' 
                    ? mergedOptions.body 
                    : JSON.stringify(mergedOptions.body);
            } else {
                requestOptions.headers = {
                    ...(mergedOptions.headers || {})
                };
            }
            const res = await fetch(`${BASE_URL}${endpoint}`, requestOptions);
            
            if (!res.ok) {
              let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
                try {
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const err = await res.json();
                        errorMessage = err.msg || err.message || errorMessage;
                    } else {
                        const textError = await res.text();
                        if (textError) errorMessage = textError;
                    }
                } catch {
                  //
                }
                throw new Error(errorMessage);
            }

            const contentType = res.headers.get('content-type');
            let data: T;
            
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                data = (await res.text()) as unknown as T;
            }

            if (isMountedRef.current) {
                setState({ data, loading: false, error: null });
            }
            
            return data;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                return null;
            }
            
            if (isMountedRef.current) {
                setState({ data: null, loading: false, error: err.message });
            }
            return null;
        }
    }, [endpoint, initOptions]);

    useEffect(() => {
        if (initOptions.auto !== false) {
            fetchData();
        }
    }, []);

    const refetch = useCallback((opts?: Partial<ApiOptions>) => {
        return fetchData(opts);
    }, [fetchData]);

    const post = useCallback((body: any, opts?: Partial<ApiOptions>) => {
        return fetchData({ ...opts, body, method: 'POST' });
    }, [fetchData]);

    const put = useCallback((body: any, opts?: Partial<ApiOptions>) => {
        return fetchData({ ...opts, body, method: 'PUT' });
    }, [fetchData]);

    const patch = useCallback((body: any, opts?: Partial<ApiOptions>) => {
        return fetchData({ ...opts, body, method: 'PATCH' });
    }, [fetchData]);

    const del = useCallback((opts?: Partial<ApiOptions>) => {
        return fetchData({ ...opts, method: 'DELETE' });
    }, [fetchData]);

    const reset = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setState({ data: null, loading: false, error: null });
    }, []);

    return { ...state, refetch, post, put, patch, del, reset };
};

export default useApi;
