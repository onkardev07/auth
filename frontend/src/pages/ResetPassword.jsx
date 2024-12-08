import { useState } from "react";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import { useRecoilCallback } from "recoil";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL, errorState, isLoadingState } from "../store/authStore";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();
  const handleResetPassword = useRecoilCallback(
    ({ set }) =>
      async () => {
        set(isLoadingState, true);
        set(errorState, null);
        console.log(token);
        try {
          const response = await axios.post(
            `${BASE_URL}/reset-password/${token}`,
            {
              password,
            }
          );
          console.log(response.data);
          toast.success("Password has been reset successfully.");
        } catch (err) {
          set(errorState, err.response.data.message);
          toast.error(err.response.data.message);
        } finally {
          set(isLoadingState, false);
        }
      },
    [password]
  );

  const isButtonDisabled =
    password === "" || confirmpassword === "" || password !== confirmpassword;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-[#f2f2f5] py-[10px] px-[15px] flex flex-col gap-3 w-[350px] rounded-lg shadow-md">
        <div className="text-center font-abcdia-pixel text-[20px] leading-[32px] font-semibold">
          Reset Password
        </div>

        <>
          <Input
            icon={Lock}
            type="password"
            value={password}
            placeholder="New Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <Input
            icon={Lock}
            type="password"
            value={confirmpassword}
            placeholder="Confirm New Password"
            onChange={(e) => {
              setConfirmpassword(e.target.value);
            }}
          />

          <button
            onClick={handleResetPassword}
            disabled={isButtonDisabled}
            className={`text-white font-semibold py-2 px-5 rounded-lg text-[20px] transition-colors duration-300 ease-in-out text-center ${
              isButtonDisabled ? "bg-[grey]" : "bg-[#d74b07]"
            }`}
          >
            Set New Password
          </button>
          <button
            onClick={() => navigate("/login")}
            className={`text-white bg-[#c7b5f6] font-semibold py-2 px-5 rounded-lg text-[20px] transition-colors duration-300 ease-in-out text-center`}
          >
            Back to Login
          </button>
        </>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default ResetPassword;
