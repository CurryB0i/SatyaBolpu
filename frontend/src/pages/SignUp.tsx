import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Button from "../components/Button";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { GrFormView, GrFormViewHide } from "react-icons/gr";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import useApi from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import parsePhoneNumberFromString from 'libphonenumber-js/mobile';
import { toast } from "react-toastify";
import { SignUpProps } from "../types/globals";

const initialFormData: SignUpProps = {
  name: "",
  uname: "",
  email: "",
  phone: {
    dialCode: "",
    number: ""
  },
  password: "",
  confirmPassword: "",
};

const steps = ["Basic Info", "Contact Info", "Security"];

const SignUp = () => {
  const [formData, setFormData] = useState<SignUpProps>(initialFormData);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<SignUpProps>(initialFormData);
  const [buttonLoad, setButtonLoad] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);

  const { data, error, loading, post } = useApi("/auth/signup", { auto: false });
  const { state, dispatch } = useAuth();

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

  const handlePhoneNoChange = (phone: string, data: CountryData) => {
    setErrors((prev) => ({
      ...prev,
      phone: ''
    }));

    setFormData((prev) => ({
      ...prev,
      phone: {
        dialCode: data.dialCode,
        number: phone.slice(data.dialCode.length)
      }
    }));
  }

  const validateForm = (step: number) => {
    const newErrors: SignUpProps = { ...initialFormData, phone: "" };

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required.";
    } else if (step === 2) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format.";
      }
      if(formData.phone && typeof formData.phone === "object") {
        const phone =  parsePhoneNumberFromString("+" + formData.phone.dialCode + formData.phone.number);
        console.log(formData)
        if(formData.phone.number !== "" && phone?.getType() !== "MOBILE") {
          newErrors.phone = "Invalid phone number.";
        }
      }

    } else if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required.";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters.";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do NOT match.";
      }
    }

    return newErrors;
  };

  const handleNext = (step: number) => {
    const newErrors = validateForm(step);
    console.log(newErrors)
    if (Object.values(newErrors).some(err => err !== '')) {
      setErrors(newErrors);
      return;
    }
    setStep(step);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setButtonLoad(true);
    e.preventDefault();
    const newErrors = validateForm(3);
    if (Object.values(newErrors).some(err => err != '')) {
      setErrors(newErrors);
      return;
    }
    await post(formData);
    setButtonLoad(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    if (data) {
      setButtonLoad(loading);
      dispatch({
        type: "LOGIN",
        payload: {
          user: data.user,
          token: data.accessToken,
        },
      });
      const names: string[] = data.user.name.split(' ');
      let finalName;
      if(names.length < 2) {
        finalName = names[0];
      } else {
        finalName = names.find(n => n.length > 5 );
      }
      finalName = finalName!.length > 10 ? `${finalName!.slice(0, 10)}...` : finalName;
      toast.success(`Sign In Successful! Welcome ${finalName}`);
      setFormData(initialFormData);
      setButtonLoad(false);
    }
  }, [data, error, loading]);

  if (state.token) return <Navigate to={"/profile"} replace />;

  return (
    <div className="w-screen min-h-screen text-primary flex flex-col items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] md:w-2/3 lg:w-2/5 xl:w-1/3 border-[1px] border-white border-solid rounded-2xl 
        flex flex-col items-center gap-8 px-6 py-10 bg-white/5 backdrop-blur-md shadow-lg"
      >
        <h1 className="text-[2.5rem] sm:text-[3rem] font-bold">Sign Up</h1>
        <div className="flex items-center gap-4 mb-4">
          {steps.map((label, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 ${i === step ? "text-white" : "text-gray-400"}`}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full 
                ${i === step ? "bg-white text-black font-bold" : "border border-gray-400"}`}
              >
                {i + 1}
              </div>
              <span className="hidden sm:block">{label}</span>
              {i < steps.length - 1 && <span className="text-gray-400">—</span>}
            </div>
          ))}
        </div>


        {step === 0 && (
          <>
            <div className="w-full flex flex-col gap-3">
              <label htmlFor="name">Name:</label>
              <input
                className="text-white p-2 rounded-md text-[1.2rem] border-2 border-gray-300"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormDataChange}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="w-full flex flex-col gap-3">
              <label htmlFor="uname">Username (Optional):</label>
              <input
                className="text-white p-2 rounded-md text-[1.2rem] border-2 border-gray-300"
                type="text"
                id="uname"
                name="uname"
                value={formData.uname}
                onChange={handleFormDataChange}
                required
              />
              {errors.uname && <p className="text-red-500 text-sm">{errors.uname}</p>}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="w-full flex flex-col gap-3">
              <label htmlFor="email">Email:</label>
              <input
                className="text-white p-2 rounded-md text-[1.2rem] border-2 border-gray-300"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormDataChange}
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="w-full flex flex-col gap-3" data-lenis-prevent>
              <label htmlFor="phone">Phone (Optional):</label>
              <PhoneInput
                country={"in"}
                value={typeof formData.phone === "object" ? formData.phone.dialCode + formData.phone.number : formData.phone}
                onChange={handlePhoneNoChange}
                inputStyle={{
                  width: "100%",
                  textAlign: "center",
                  padding: "1rem",
                  fontSize: "1.2rem",
                  color: "black",
                  borderRadius: "8px",
                }}
              />
              {errors.phone && typeof errors.phone === "string" && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="w-full flex flex-col gap-3">
              <label htmlFor="password" className="flex justify-between">
                Password:
                <span
                  className="cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <GrFormViewHide /> : <GrFormView />}
                </span>
              </label>
              <input
                className="text-white p-2 rounded-md text-[1.2rem] border-2 border-gray-300"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleFormDataChange}
                required
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="w-full flex flex-col gap-3">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                className="text-white p-2 rounded-md text-[1.2rem] border-2 border-gray-300"
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleFormDataChange}
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>
          </>
        )}

        <div className="flex w-full justify-between mt-6">
          {step > 0 ? (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-white
              cursor-pointer hover:text-black transition"
              onClick={() => setStep((prev) => prev - 1)}
            >
              <FaArrowLeft /> Back
            </button>
          ) : (
            <span></span>
          )}

          {step < steps.length - 1 ? (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-white
              cursor-pointer hover:text-black transition"
              onClick={() => handleNext(step+1)}
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <Button
              loading={buttonLoad}
              loadingText="Signing In"
              className="text-[1.2rem] px-6 py-2"
              type="submit"
              content="Sign Up"
            />
          )}
        </div>
      </form>
    </div>
  );
};

export default SignUp;

