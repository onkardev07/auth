import { useState } from "react";
import Input from "../components/Input";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecoilCallback } from "recoil";
import axios from "axios";
import { BASE_URL, errorState, isLoadingState } from "../store/authStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [btnText, setBtnText] = useState("Send Reset Link");
  const [btnColor, setBtnColor] = useState("grey");
  //   const error = useRecoilValue(errorState)
  const navigate = useNavigate();

  const handleForgotPassword = useRecoilCallback(
    ({ set }) =>
      async () => {
        set(isLoadingState, true);
        set(errorState, null);
        try {
          const response = await axios.post(`${BASE_URL}/forgot-password`, {
            email,
          });
          console.log(response.data);
          setBtnText("Email Sent");
          setBtnColor("green");
        } catch (err) {
          set(errorState, err.response.data.message);
          setBtnText("Error Sending Email");
          setBtnColor("red");
        } finally {
          set(isLoadingState, false);
        }
      },
    [email]
  );

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-[#f2f2f5] px-[15px] py-[10px] flex flex-col gap-2 w-[350px] rounded-md">
        <div className="text-center font-abcdia-pixel text-[20px] font-semibold">
          Forgot Password
        </div>

        <>
          <div className="text-center">
            Enter your email & we&apos;ll email you a password reset link
          </div>
          <Input
            icon={Mail}
            type="email"
            value={email}
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
              setBtnText("Send Reset Link");
              setBtnColor(e.target.value ? "#d74b07" : "grey");
            }}
          />
          <button
            onClick={handleForgotPassword}
            disabled={email === ""}
            className={`text-white font-semibold py-2 px-5 rounded-lg text-[20px] transition-colors duration-300 ease-in-out text-center mt-[20px]`}
            style={{ backgroundColor: btnColor }}
          >
            {btnText}
          </button>
        </>

        <button
          onClick={() => navigate("/login")}
          className={`text-white bg-[#c7b5f6] font-semibold py-2 px-5 rounded-lg text-[20px] transition-colors duration-300 ease-in-out text-center mb-[7px]`}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
