import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import { useRecoilValue } from "recoil";
import {
  isAuthenticatedState,
  authModeState,
  userState,
} from "../store/authStore";
import { useSetRecoilState } from "recoil";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  const authMode = useRecoilValue(authModeState);
  const setIsAuthenticated = useSetRecoilState(isAuthenticatedState);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {
    let isMounted = true;

    const verifyOAuthSession = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/check-oauth-session`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error checking OAuth session:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.error("Error refreshing token:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (authMode === "JWT") {
      if (!isAuthenticated) {
        verifyRefreshToken();
      } else {
        setIsLoading(false);
      }
    } else {
      // Handle OAuth mode
      verifyOAuthSession();
    }

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, refresh, authMode, setIsAuthenticated, setUser]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <Outlet />;
};

export default PersistLogin;
