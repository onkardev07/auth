import { useRecoilValue } from "recoil";
import { isAuthenticatedState, isLoadingState } from "../store/authStore";
import { Loader } from "lucide-react";
import about from "../assets/about.png";

const About = () => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  const loading = useRecoilValue(isLoadingState);
  console.log("auth state in about:", isAuthenticated);

  if (loading) {
    return <Loader className="animate-spin mx-auto" size={25}></Loader>;
  }
  return (
    <div>
      <img src={about} alt="about" className="h-full w-full object-cover" />
    </div>
  );
};

export default About;
