import { useState } from "react";
import sidebar from "../assets/cover-auth.jpg";
import Input from "../components/Input";
import google from "../assets/google.png";
import { Loader, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  accessTokenState,
  isAuthenticatedState,
  isLoadingState,
  profilePicState,
} from "../store/authStore";
import { errorState } from "../store/authStore";
import { userState } from "../store/authStore";
import { BASE_URL } from "../store/authStore";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { authModeState } from "../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const isLoading = useRecoilValue(isLoadingState);

  axios.defaults.withCredentials = true;

  const handleLogin = useRecoilCallback(
    ({ set }) =>
      async () => {
        set(isLoadingState, true);
        set(errorState, null);
        try {
          const response = await axios.post(`${BASE_URL}/login`, {
            email,
            password,
          });
          set(userState, response.data.user);
          set(accessTokenState, response.data.user.accessToken);
          set(isAuthenticatedState, true);
          set(authModeState, "JWT"); // Set authentication mode to 'JWT'
          navigate("/home");
        } catch (error) {
          set(errorState, error.response.data.message);
          console.log(error.response.data.message);
        } finally {
          set(isLoadingState, false);
        }
      },
    [email, password]
  );

  const handleGoogleLogin = useRecoilCallback(({ set }) => async () => {
    const googleAuthUrl = `http://localhost:3000/auth/google`;

    // eslint-disable-next-line no-unused-vars
    const popup = window.open(
      googleAuthUrl,
      "googleAuth",
      "width=500,height=600"
    );

    window.addEventListener("message", (event) => {
      if (event.origin !== "http://localhost:3000") return;

      const { user } = event.data;
      const { profilePicture } = event.data;

      set(userState, user);
      set(profilePicState, profilePicture);
      set(isAuthenticatedState, true);
      set(authModeState, "OAuth"); // Set authentication mode to 'OAuth'
      navigate("/home");
    });
  });

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };
  console.log("isloading", isLoading);
  return (
    <div className="flex h-screen">
      <div className="w-[65%] overflow-hidden">
        <img src={sidebar} alt="Logo" className="h-full w-full object-cover" />
      </div>
      <div className="w-[35%] bg-[#f3f3f6] flex flex-col justify-center">
        <div className="mx-[35px] bg-[white] rounded-md flex flex-col">
          <div className="font-abcdia-pixel text-[24px] leading-[32px] font-semibold flex justify-center pt-[20px]">
            Log in to your account
          </div>
          <div className="flex flex-col gap-[10px] mt-[14px]">
            {/* <button className="bg-[#ebeced] py-[10px] px-[15px] mx-[55px] flex justify-center">
              Continue with Google
            </button> */}
            <button
              className="bg-[#ebeced] py-[10px] px-[15px] mx-[55px] flex justify-center"
              onClick={handleGoogleLogin}
            >
              <div className="flex items-center gap-3">
                <div>
                  <img
                    src={google}
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                </div>
                <div>Continue with Google</div>
              </div>
            </button>
          </div>

          <hr className="my-[15px] mx-[55px] border-0 h-[2px] bg-[#ebeced]" />
          <div className="mx-[52px] flex flex-col gap-[10px]">
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
              onClick={handleLogin}
              disabled={email == "" || password == ""}
              className={`text-white font-semibold py-2 px-5 rounded-lg text-[20px] transition-colors duration-300 ease-in-out text-center ${
                !password || !email ? "bg-[grey]" : "bg-[#d74b07]"
              }`}
            >
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={25}></Loader>
              ) : (
                "Log In"
              )}
            </button>
            <div
              className="text-center cursor-pointer text-[#d74b07]"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </div>
          </div>
          <hr className="my-[15px] mx-[55px] border-0 h-[2px] bg-[#ebeced]" />
          <div className="mx-auto mb-[20px]">
            <span className="mr-[10px]">New to Safepass?</span>
            <span
              onClick={() => {
                navigate("/signup");
              }}
              className="cursor-pointer text-[#d74b07]"
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
