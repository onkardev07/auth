import { useRecoilValue } from "recoil";
import {
  isAuthenticatedState,
  isLoadingState,
  userState,
} from "../store/authStore";
import { Loader } from "lucide-react";
const Profile = () => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  const loading = useRecoilValue(isLoadingState);
  const user = useRecoilValue(userState);
  console.log("auth state in profile:", isAuthenticated);
  if (loading) {
    return <Loader className="animate-spin mx-auto" size={25}></Loader>;
  }
  return (
    <div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-[#f2f2f5] px-[15px] py-[10px] flex flex-col gap-2 w-[400px] rounded-md">
          <div className="border-2 border-[#f6f0f0] shadow-md bg-[#f6f0f0] py-[10px] px-[15px]">
            <div className="font-abcdia-pixel text-[16px] leading-[32px] font-semibold">
              Profile Information
            </div>
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-semibold mr-1">UserName:</span>
                {user.username}
              </div>
              <div>
                <span className="font-semibold mr-1">Email:</span>
                {user.email}
              </div>
            </div>
          </div>
          <div className="border-2 border-[#f6f0f0] shadow-md bg-[#f6f0f0] py-[10px] px-[15px]">
            <div className="font-abcdia-pixel text-[16px] leading-[32px] font-semibold">
              Account Activity
            </div>
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-semibold mr-1">Joined:</span>
                {new Date(user.createdAt).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div>
                <span className="font-semibold mr-1">Last Login:</span>
                {new Date(user.lastLogin).toLocaleString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
