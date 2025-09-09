import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import useApi from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

type SignUpProps = {
  name: string;
  uname: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
};

const initialFormData = {
    name: '',
    uname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
}

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpProps>(initialFormData);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [buttonLoad, setButtonLoad] = useState<boolean>(false);
  const { data, error, loading, post } = useApi("/auth/signup",{auto: false});
  const { state, dispatch } = useAuth();

  const handleFormDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
      const savedData = sessionStorage.getItem('signup-data');
      if (savedData) {
          setFormData(JSON.parse(savedData));
      }
  },[])

  const validateForm = () => {
    const errorList: string[] = [];

    if (!formData.name.trim()) errorList.push("Name is required.");
    if (!formData.email.trim()) errorList.push("Email is required.");
    if (!/\S+@\S+\.\S+/.test(formData.email)) errorList.push("Invalid email format.");
    if (!formData.phone?.trim()) errorList.push("Phone number is required.");
    if (!formData.password) errorList.push("Password is required.");
    if (formData.password.length < 6) errorList.push("Password must be at least 6 characters.");
    else if (formData.password !== formData.confirmPassword) errorList.push("Passwords do NOT match.");

    return errorList;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sessionStorage.setItem('signup-data',JSON.stringify(formData));
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    await post(formData);
  };

  useEffect(() => {
      if (error) {
          setErrors([error]);
      }

      if (data) {
          setButtonLoad(loading);
          dispatch({
              type: 'LOGIN',
              payload: {
                  user: data.user,
                  token: data.accessToken
              }
          });
          toast.success(`Sign In Successful! Welcome ${data.user.name}`)
          sessionStorage.removeItem('signup-data');
          setFormData(initialFormData);
      }
  }, [data, error, loading]);

  if(state.token) 
      return <Navigate to={'/profile'} replace/>

  return (
    <div className="w-screen min-h-screen text-primary flex flex-col items-center justify-center py-32">
      <form
        className="w-[95%] sm:w-[90%] md:w-4/5 lg:w-3/5 xl:w-1/2 gap-5 border-4 border-white border-solid rounded-2xl
        flex flex-col items-center justify-evenly py-10 text-[1.5rem]"
        onSubmit={handleSubmit}
      >
        <h1 className="text-[3rem] sm:text-[4rem] font-semibold">Sign Up</h1>
        
        {errors.length > 0 && (
          <ul className="text-red-500 list-disc text-[1.2rem] bg-red-100 p-4 pl-10 w-[80%] rounded-lg">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

        <div className="w-[90%] sm:w-4/5 md:w-2/3 flex flex-col">
          <label className="text-[1.2rem] sm:text-[1.5rem]" htmlFor="name">Name:</label>
          <input
            className="text-black p-1 sm:p-2 text-[1.5rem]"
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormDataChange}
            required
          />
        </div>

        <div className="w-[90%] sm:w-4/5 md:w-2/3 flex flex-col">
          <label className="text-[1.2rem] sm:text-[1.5rem]" htmlFor="name">Username:</label>
          <input
            className="text-black p-1 sm:p-2 text-[1.5rem]"
            type="text"
            id="uname"
            name="uname"
            value={formData.uname}
            onChange={handleFormDataChange}
            required
          />
        </div>

        <div className="w-[90%] sm:w-4/5 md:w-2/3 flex flex-col">
          <label className="text-[1.2rem] sm:text-[1.5rem]" htmlFor="email">Email:</label>
          <input
            className="text-black p-1 sm:p-2 text-[1.5rem]"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormDataChange}
            required
          />
        </div>

        <div className="w-[90%] sm:w-4/5 md:w-2/3 flex flex-col" data-lenis-prevent>
          <label className="text-[1.2rem] sm:text-[1.5rem]" htmlFor="phone">Phone:</label>
          <PhoneInput
            country={'in'}
            value={formData.phone}
            onChange={phone => setFormData(prev => ({ ...prev, phone }))}
            inputStyle={{
              width: '100%',
              textAlign: 'center',
              padding: '1.5rem',
              fontSize: '1.5rem',
              color: 'black'
            }}
          />
        </div>

        <div className="w-[90%] sm:w-4/5 md:w-2/3 flex flex-col">
          <label htmlFor="password" className="flex items-center justify-between text-[1.2rem] sm:text-[1.5rem]">
            Password:
            <div className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <GrFormViewHide /> : <GrFormView />}
            </div>
          </label>
          <input
            className="text-black p-1 sm:p-2 text-[1.5rem]"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleFormDataChange}
            required
          />
        </div>

        <div className="w-[90%] sm:w-4/5 md:w-2/3 flex flex-col">
          <label className="text-[1.2rem] sm:text-[1.5rem]" htmlFor="confirmPassword">Confirm Password:</label>
          <input
            className="text-black p-1 sm:p-2 text-[1.5rem]"
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleFormDataChange}
            required
          />
        </div>

        <Button loading={buttonLoad} loadingText="Signing In" className="text-[1.5rem]" type="submit" content="Sign Up" />

      </form>
    </div>
  );
};

export default SignUp;

