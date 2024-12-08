import { useRecoilValue, useResetRecoilState } from "recoil";
import {
  isAuthenticatedState,
  accessTokenState,
  authModeState,
  isLoadingState,
  profilePicState,
} from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../store/authStore";
import logo from "../assets/logo-app.jpg";
import avatar from "../assets/boy.png";
import home from "../assets/home.png";

const Home = () => {
  const loading = useRecoilValue(isLoadingState);
  // eslint-disable-next-line no-unused-vars
  const accessToken = useRecoilValue(accessTokenState);
  const authMode = useRecoilValue(authModeState);
  const resetAccessToken = useResetRecoilState(accessTokenState);
  const resetIsAuthenticated = useResetRecoilState(isAuthenticatedState);
  const profilePic = useRecoilValue(profilePicState);
  const navigate = useNavigate();

  if (loading) {
    return <Loader className="animate-spin mx-auto" size={25}></Loader>;
  }

  // Handle Logout
  const handleLogout = async () => {
    try {
      if (authMode === "JWT") {
        await axios.post(`${BASE_URL}/logout`);
        resetAccessToken();
      } else if (authMode === "OAuth") {
        await axios.post("http://localhost:3000/logout");
      }

      resetIsAuthenticated();
      localStorage.removeItem("authMode");
      navigate("/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="h-[70px] bg-[black] flex justify-between items-center">
        <div className="flex gap-[35px] items-center">
          {/* logo */}
          <div className="h-[50px] rounded-full ml-[150px] overflow-hidden bg-gray-300">
            <img src={logo} alt="Logo" className="h-full w-full object-cover" />
          </div>
          <div className=" flex gap-[5px] font-abcdia text-[#B9BBBC] text-md leading-5 py-[5px]">
            <div className=" px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer">
              Teams
            </div>
            <div className=" px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer">
              Pricing
            </div>
            <div className="px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer">
              Guide
            </div>
            <div className="px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer">
              Blogs
            </div>
            <div className="px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer">
              Careers
            </div>
          </div>
        </div>

        <div className=" mr-[150px] flex gap-[5px] font-abcdia text-[#B9BBBC] text-md leading-5 py-[5px]">
          <div
            className=" px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer"
            onClick={() => {
              navigate("/about");
            }}
          >
            About
          </div>
          <div
            onClick={() => {
              navigate("/profile");
            }}
            className=" px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer"
          >
            Profile
          </div>
          <div
            className="px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </div>
          <div className="h-[35px] rounded-full overflow-hidden bg-gray-300 ">
            <img
              src={profilePic == null ? avatar : profilePic}
              alt="Logo"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </nav>

      <div className="h-[calc(100vh_-_70px)]">
        <img
          src={home}
          alt="wallpaper"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Home;
