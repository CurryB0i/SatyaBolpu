import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaUserAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Button from "../components/Button";
import useApi from "../hooks/useApi";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDialog } from "../context/DialogBoxContext";
import gsap from "gsap";

const Profile = () => {
  const { state, dispatch } = useAuth();
  const dialog = useDialog();
  const { error, loading, post } = useApi("/auth/logout", { auto: false });
  const [buttonLoad, setButtonLoad] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    dialog.popup({
      title: "Logging Out",
      description: "Are you sure you want to log out?",
      severity: "risky",
      onConfirm: async () => {
        try {
          await post({});
          dispatch({ type: "LOGOUT" });
          toast.info("User Logged Out");
        } catch (err) {
          console.error("Logout failed:", err);
          toast.error("Something went wrong while logging out.");
        }
      },
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (profileRef.current) {
        gsap.fromTo(
          profileRef.current,
          { top: "100px", opacity: 0 },
          { top: "0px", opacity: 1, duration: 0.75, ease: "power2.inOut" }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setButtonLoad(loading);
    if (error) {
      console.warn("Logout error:", error);
      toast.error(error);
    }
  }, [error, loading]);

  if (!state.token) return <Navigate to="/login" replace />;

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div
        ref={profileRef}
        className="w-[95%] sm:w-2/3 md:w-3/5 lg:w-2/5 2xl:w-1/3 relative flex flex-col items-center justify-center bg-white/80 
          p-10 [box_shadow:1px_1px_6px_primary] shadow-primary rounded-2xl gap-10"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="absolute -top-[10%] md:-top-[15%] bg-white/90 outline outline-4 outline-primary px-2 pt-2 overflow-hidden rounded-full">
            <FaUserAlt className="w-full text-[8rem] md:text-[10rem]" />
          </div>

          <div className="text-center pt-[5rem]">
            <div className="text-[2rem]/[2rem] flex items-center gap-2 justify-center font-black">
              <p>{state.user?.name}</p>
              {state.user?.verified && <MdVerified className="text-blue-500" />}
            </div>
            <p className="text-[1.2rem] italic">@{state.user?.uname}</p>
            {state.user?.role !== "user" && (
              <p className="text-green-500 font-semibold">
                {state.user?.role.toUpperCase()}
              </p>
            )}
          </div>
        </div>

        <div className="min-w-[40%]">
          <p className="text-[1.2rem] font-semibold">Email:</p>
          <div className="bg-white p-2 rounded-lg outline outline-primary break-words">
            {state.user?.email}
          </div>
        </div>

        <div className="min-w-[40%]">
          <p className="text-[1.2rem] font-semibold">Phone:</p>
          <div className="bg-white p-2 rounded-lg outline outline-primary break-words">
            {
              state.user?.phone ? 
                "+" + state.user.phone.dialCode + " " + state.user.phone.number :
                <span className="italic text-gray-500">Not Provided</span>
            }
          </div>
        </div>

        <Button
          theme="light"
          loading={buttonLoad}
          loadingText="Logging Out"
          onClick={handleLogout}
          className="text-[1.25rem]"
          content="Log Out"
        />
      </div>
    </div>
  );
};

export default Profile;

