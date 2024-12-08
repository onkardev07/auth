import axios from "axios";
import { BASE_URL } from "./store/authStore";

const setupInterceptors = (
  setIsAuthenticated,
  navigate,
  setAccessToken,
  setLoading
) => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response.status === 403 && !error.config._retry) {
        error.config._retry = true;
        setLoading(true);

        try {
          const response = await axios.get(`${BASE_URL}/generate-authtoken`);
          setAccessToken(response.data.accessToken);
          error.config.headers[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          setIsAuthenticated(false);
          navigate("/login");
          return Promise.reject(refreshError);
        } finally {
          setLoading(false);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
