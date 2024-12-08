import axios from "axios";
import { useSetRecoilState } from "recoil";
import { accessTokenState, isAuthenticatedState } from "../store/authStore";
import { BASE_URL } from "../store/authStore";

const useRefreshToken = () => {
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);

  const refresh = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/generate-authtoken`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setAccessToken(response.data.accessToken);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setIsAuthenticated(false);
      console.error("Error refreshing token:", err);
    }
  };

  return refresh;
};

export default useRefreshToken;
