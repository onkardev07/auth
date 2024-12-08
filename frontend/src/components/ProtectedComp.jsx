import { useRecoilValue } from "recoil";
import { isAuthenticatedState } from "../store/authStore";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedComp = () => {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  console.log("auth state:", isAuthenticated);

  return isAuthenticated ? (
    <Outlet></Outlet>
  ) : (
    <Navigate to="/login"></Navigate>
  );
};

export default ProtectedComp;
