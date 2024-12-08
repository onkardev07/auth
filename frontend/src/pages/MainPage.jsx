import logo from "../assets/logo-app.jpg";
import { useNavigate } from "react-router-dom";
const MainPage = () => {
  const navigate = useNavigate();
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
          <div className=" px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer">
            Contact Sales
          </div>
          <div
            onClick={() => {
              navigate("/login");
            }}
            className=" px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer"
          >
            Login
          </div>
          <div className="px-[15px] py-[5px] transition-colors duration-700 ease-in-out hover:bg-[#172126] flex items-center cursor-pointer">
            Start Building
          </div>
        </div>
      </nav>
      <main className="h-[calc(100vh_-_70px)] bg-[#5b656b] flex flex-col justify-center">
        <div className="gap-[40px] flex flex-col">
          <div className="font-abcdia-pixel text-custom-gray text-[112px] leading-[106px] font-normal flex justify-center ">
            Create Auth Faster
          </div>

          <div className="flex flex-col gap-[3px]">
            <div className="font-abcdia-pixel text-custom-gray text-[20px] font-normal mx-auto">
              Safepass is a robust authentication platform designed to
              streamline security and enhance user trust
            </div>
            <div className="font-abcdia-pixel text-custom-gray text-[20px] font-normal mx-auto">
              empowering you to build, secure, and deploy applications
            </div>
          </div>

          <div className="flex gap-[20px] mx-auto">
            <button
              onClick={() => {
                navigate("/signup");
              }}
              className=" text-white font-semibold py-4 px-8 rounded-lg bg-[#d74b07] text-[20px] transition-colors duration-300 ease-in-out text-center"
            >
              Sign Up for Free
            </button>
            <button className="text-[20px] text-[black] font-semibold py-4 px-8 rounded-lg bg-[#b9bbbc] transition-colors duration-300 ease-in-out text-center">
              Get Business Demo
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
