import { useRecoilState, useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticatedState } from "../store/authStore";
import { BASE_URL } from "../store/authStore";
import { accessTokenState } from "../store/authStore";
import { isLoadingState } from "../store/authStore";
import { useSetRecoilState } from "recoil";
import { authModeState } from "../store/authStore";

const useAuthValidation = () => {
  // eslint-disable-next-line no-unused-vars
  const [isAuthenticated, setIsAuthenticated] =
    useRecoilState(isAuthenticatedState);
  const accessToken = useRecoilValue(accessTokenState);
  const authMode = useRecoilValue(authModeState);
  const setLoading = useSetRecoilState(isLoadingState);
  const navigate = useNavigate();

  const validateAuthToken = async () => {
    setLoading(true); // Set loading before the request
    try {
      if (authMode === "JWT" && accessToken) {
        // Validate JWT token
        const response = await axios.post(`${BASE_URL}/verify-auth`, {
          authToken: accessToken,
        });
        setIsAuthenticated(response.data.valid);
        if (!response.data.valid) {
          navigate("/login");
        }
      } else if (authMode === "OAuth") {
        // Check session for OAuth
        const response = await axios.get(
          `http://localhost:3000/check-session`,
          {
            withCredentials: true,
          }
        );
        setIsAuthenticated(response.data.sessionActive);
        if (!response.data.sessionActive) {
          navigate("/login");
        }
      }
    } catch (err) {
      console.log(err);
      setIsAuthenticated(false);
      navigate("/login");
    } finally {
      setLoading(false); // Reset loading after the process
    }
  };

  return validateAuthToken;
};

export default useAuthValidation;
