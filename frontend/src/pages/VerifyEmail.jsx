import { useRecoilCallback, useRecoilValue } from "recoil";
import OTPInput from "../components/OTPInput";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  errorState,
  isLoadingState,
  isVerifiedState,
} from "../store/authStore";
import axios from "axios";
import { BASE_URL } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const verifiedState = useRecoilValue(isVerifiedState);
  const error = useRecoilValue(errorState);
  const [attempts, setAttempts] = useState(3);
  const [locked, setIsLocked] = useState(false);
  const navigate = useNavigate();

  const lockUser = () => {
    setIsLocked(true);
    toast.error("Too many attempts. Please try again after 1 minute.");

    const lockExpireTime = Date.now() + 60 * 1000;
    localStorage.setItem("lockExpireTime", lockExpireTime);

    setTimeout(() => {
      setAttempts(3);
      setIsLocked(false);
      localStorage.removeItem("lockExpireTime");
    }, 60 * 1000);
  };

  useEffect(() => {
    const lockExpireTime = localStorage.getItem("lockExpireTime");
    if (lockExpireTime && Date.now() < parseInt(lockExpireTime)) {
      const remainingTime = parseInt(lockExpireTime) - Date.now();
      setIsLocked(true);

      setTimeout(() => {
        setAttempts(3);
        setIsLocked(false);
        localStorage.removeItem("lockExpireTime");
      }, remainingTime);
    }
  }, []);

  const verifyEmail = useRecoilCallback(
    ({ set }) =>
      async () => {
        if (locked) return;

        set(isLoadingState, true);
        set(errorState, null);
        try {
          const response = await axios.post(`${BASE_URL}/verify-email`, {
            verificationToken: otp,
          });
          console.log("verify-email", response.data);
          set(isVerifiedState, true);
          navigate("/login");
        } catch (err) {
          set(errorState, err);
          setAttempts((prevAttempts) => {
            const newAttempts = prevAttempts - 1;
            if (newAttempts === 0) {
              lockUser();
            }
            return newAttempts;
          });
          console.log("verify error", err.response.data.message);
        } finally {
          set(isLoadingState, false);
        }
      },
    [otp, locked]
  );

  useEffect(() => {
    if (otp.length === 6 && !locked) {
      verifyEmail();
      console.log("vfs", verifiedState);
    }
  }, [otp]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="shadow-md rounded-lg bg-[#f2f2f5] pt-[10px] px-[10px] flex flex-col gap-3">
        <div className="text-center font-abcdia-pixel text-[24px] leading-[32px] font-semibold">
          Verify Your Email
        </div>
        <div className="text-center">
          Enter 6 digit code sent to your email address
        </div>
        <OTPInput otp={otp} setOtp={setOtp} />
        {error ? <p className="text-[red] text-center">Wrong OTP</p> : null}
        <p className="text-center">
          {locked
            ? "Too many attempts. Please try again later."
            : `${attempts} attempt${attempts !== 1 ? "s" : ""} left`}
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default VerifyEmail;
