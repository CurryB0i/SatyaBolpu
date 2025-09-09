import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import useApi from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
    const [formData, setFormData] = useState<{ email: string; password: string }>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [buttonLoad,setButtonLoad] = useState<boolean>(false);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const {state, dispatch} = useAuth();
    const {data, error, loading, post} = useApi('/auth/login',{auto: false});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors: string[] = [];
        if (!formData.email.trim()) {
            newErrors.push("Email is required");
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.push("Invalid email format");
        }

        if (!formData.password.trim()) {
            newErrors.push("Password is required");
        } else if (formData.password.length < 6) {
            newErrors.push("Password must be at least 6 characters");
        }

        return newErrors;
    };

    useEffect(() => {
        const savedData = sessionStorage.getItem('login-data');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    },[])

    const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateForm();
        sessionStorage.setItem('login-data',JSON.stringify(formData));
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        await post(formData);
        setErrors([]);
        setShowPassword(false);
    };


    useEffect(() => {
        setButtonLoad(loading);

        if (error) {
            console.error("Login error:", error);
            setErrors([error]);
            return;
        }

        if (data && !loading) {
            dispatch({
                type: 'LOGIN',
                payload: {
                    user: data.user,
                    token: data.accessToken,
                },
            });
            toast.success(`Welcome back ${data.user.name}`);
            sessionStorage.removeItem('login-data');

            setFormData({
                email: '',
                password: '',
            });

            navigate('/profile');
        }
    }, [data, error, loading]);

    if(state.token) 
        return <Navigate to={'/profile'} replace/>

    return (
      <div className="w-full h-screen text-primary flex flex-col items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-[95%] sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-2/5 h-3/4 border-4 border-white border-solid rounded-2xl
          flex flex-col items-center justify-evenly text-[2rem]"
        >
          <h1 className="text-[3rem] sm:text-[4rem] font-semibold">Login</h1>

          {errors.length > 0 && (
            <ul className="text-red-500 list-disc text-[1.2rem] bg-red-100 p-4 pl-10 w-[80%] rounded-lg">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}

          <div className="w-4/5 sm:w-2/3 flex flex-col">
            <label htmlFor="email">Email:</label>
            <input
              className="text-black p-2 text-[1rem] sm:text-[1.5rem] border-2 border-solid border-gray-300 rounded-md"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormDataChange}
            />
          </div>

          <div className="w-4/5 sm:w-2/3 flex flex-col">
            <label htmlFor="password" className="flex items-center justify-between">
              Password:
              <div
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <GrFormViewHide /> : <GrFormView />}
              </div>
            </label>
            <div className="w-full">
              <input
                className="text-black p-2 w-full text-[1rem] sm:text-[1.5rem] border-2 border-solid border-gray-300 rounded-md"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                ref={passwordRef}
                value={formData.password}
                onChange={handleFormDataChange}
              />
            </div>
          </div>

          <Button loading={buttonLoad} loadingText="Logging In" className="text-[1.5rem]" type="submit" content="Login" />
        </form>
      </div>
    );
};

export default Login;

