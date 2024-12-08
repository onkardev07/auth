import { useRecoilValue } from "recoil";
import { isAuthenticatedState } from "../store/authStore";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoute = () => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/home" />;
};

export default PublicRoute;
