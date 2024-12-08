import { useState } from "react";
import sidebar from "../assets/cover-auth.jpg";
import Input from "../components/Input";
import { User, Loader, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isLoadingState } from "../store/authStore";
import { errorState } from "../store/authStore";
import { userState } from "../store/authStore";
import { BASE_URL } from "../store/authStore";
import { useRecoilCallback, useRecoilValue } from "recoil";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isLoading = useRecoilValue(isLoadingState);
  axios.defaults.withCredentials = true;

  const handleSignup = useRecoilCallback(
    ({ set }) =>
      async () => {
        set(isLoadingState, true);
        set(errorState, null);
        try {
          const response = await axios.post(`${BASE_URL}/signup`, {
            email,
            password,
            username,
          });
          set(userState, response.data.user);
          if (response.data.success) {
            navigate("/verify-email");
          }
        } catch (error) {
          set(errorState, error.response.data.message);
          console.log(error.response.data.message);
        } finally {
          set(isLoadingState, false);
        }
      },
    [email, password, username]
  );
  console.log("isloading", isLoading);
  return (
    <div className="flex h-screen">
      <div className="w-[65%] overflow-hidden">
        <img src={sidebar} alt="Logo" className="h-full w-full object-cover" />
      </div>
      <div className="w-[35%] bg-[#f3f3f6] flex flex-col justify-center">
        <div className="mx-[35px] bg-[white] rounded-md flex flex-col shadow-md ">
          <div className="font-abcdia-pixel text-[24px] leading-[32px] font-semibold flex justify-center py-[20px]">
            Create Safepass Account
          </div>
          <div className="mx-[52px] flex flex-col gap-[10px]">
            <Input
              icon={User}
              type="text"
              value={username}
              placeholder="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            ></Input>
            <Input
              icon={Mail}
              type="email"
              value={email}
              placeholder="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            ></Input>
            <Input
              icon={Lock}
              type="password"
              value={password}
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            ></Input>
            <button
              onClick={handleSignup}
              disabled={userState == "" || email == "" || password == ""}
              className={`text-white font-semibold py-2 px-5 rounded-lg text-[20px] transition-colors duration-300 ease-in-out text-center ${
                !username || !password || !email ? "bg-[grey]" : "bg-[#d74b07]"
              }`}
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={25}></Loader>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
          <hr className="my-[15px] mx-[55px] border-0 h-[2px] bg-[#ebeced]" />
          <div className="mx-auto mb-[20px]">
            <span className="mr-[10px]">Already have an account?</span>
            <span
              onClick={() => {
                navigate("/login");
              }}
              className="cursor-pointer text-[#d74b07]"
            >
              Log in
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
