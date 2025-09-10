import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import useApi from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type LoginProps = {
  email: string;
  password: string;
};

const initialLoginData = {
  email: "",
  password: ""
};

const Login = () => {
  const [formData, setFormData] = useState<LoginProps>(initialLoginData);
  const [errors, setErrors] = useState<LoginProps>(initialLoginData);
  const [apiError,setApiError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [buttonLoad, setButtonLoad] = useState<boolean>(false);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { state, dispatch } = useAuth();
  const { data, error, loading, post } = useApi("/auth/login", { auto: false });
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: LoginProps = { ...initialLoginData };
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors((prev) => ({
      ...prev,
      [name]: ''
    }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.values(validationErrors).some(err => err !== '')) {
      setErrors(validationErrors);
      return;
    }

    await post(formData);
    setErrors(initialLoginData);
    setShowPassword(false);
  };

  useEffect(() => {
    setButtonLoad(loading);

    if (error) {
      console.error("Login error:", error);
      setApiError(error);
      return;
    }

    if (data && !loading) {
      setApiError('');
      dispatch({
        type: "LOGIN",
        payload: {
          user: data.user,
          token: data.accessToken,
        },
      });
      toast.success(`Welcome back ${data.user.name}`);

      setFormData({
        email: "",
        password: "",
      });

      navigate("/profile");
    }
  }, [data, error, loading]);

  if (state.token) return <Navigate to={"/profile"} replace />;

  return (
    <div className="w-full min-h-screen text-primary flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[90%] md:w-2/3 lg:w-2/5 xl:w-1/3 border-[1px] border-white border-solid rounded-2xl 
        flex flex-col items-center gap-8 px-6 py-10 bg-white/5 backdrop-blur-md shadow-lg"
      >
        <h1 className="text-[2.5rem] sm:text-[3rem] font-bold">Login</h1>

        {
          apiError && <p className="text-sm text-red-600">{apiError}</p>
        }

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="email" className="text-[1.2rem]">Email:</label>
          <input
            className="text-black p-3 text-[1.2rem] border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormDataChange}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="w-full flex flex-col gap-2">
          <label htmlFor="password" className="flex items-center justify-between text-[1.2rem]">
            Password:
            <span
              className="cursor-pointer text-[1.5rem]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <GrFormViewHide /> : <GrFormView />}
            </span>
          </label>
          <input
            className="text-black p-3 text-[1.2rem] border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            ref={passwordRef}
            value={formData.password}
            onChange={handleFormDataChange}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>

        <Button
          loading={buttonLoad}
          loadingText="Logging In"
          className="text-[1.3rem] px-6 py-2"
          type="submit"
          content="Login"
        />
      </form>
    </div>
  );
};

export default Login;

