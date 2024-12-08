import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  isAuthenticatedState,
  accessTokenState,
  isLoadingState,
  authModeState,
} from "./store/authStore";
import setupInterceptors from "./axiosConfig";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import ForgotPassward from "./pages/ForgotPassward";
import ResetPassword from "./pages/ResetPassword";
import useAuthValidation from "./hooks/useAuthValidation";
import PersistLogin from "./components/PersistentLogin";
import { useNavigate } from "react-router-dom";

// ProtectedRoute component to secure routes for authenticated users
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const validateAuthToken = useAuthValidation();
  const authState = useRecoilValue(isAuthenticatedState);
  const authMode = useRecoilValue(authModeState); // Get the auth mode

  useEffect(() => {
    if (authMode === "JWT") {
      validateAuthToken(); // Only call if using JWT
    }
  }, [validateAuthToken, authMode]);

  if (!authState) {
    return <Navigate to="/login" />;
  }
  return children;
};

// RedirectAuthenticatedUsers component to prevent logged-in users from accessing login/signup routes
// eslint-disable-next-line react/prop-types
const RedirectAuthenticatedUsers = ({ children }) => {
  const authState = useRecoilValue(isAuthenticatedState);
  if (authState) {
    return <Navigate to="/home" />;
  }
  return children;
};

// Main App component
function App() {
  const [, setIsAuthenticated] = useRecoilState(isAuthenticatedState);
  const [, setAccessToken] = useRecoilState(accessTokenState);
  const setLoading = useSetRecoilState(isLoadingState);
  const authMode = useRecoilValue(authModeState); // Get the auth mode (JWT or OAuth)

  const navigate = useNavigate();

  useEffect(() => {
    // Setup Axios interceptors only if using JWT
    if (authMode === "JWT") {
      setupInterceptors(
        setIsAuthenticated,
        navigate,
        setAccessToken,
        setLoading
      );
    }
  }, [setIsAuthenticated, navigate, setAccessToken, setLoading, authMode]);

  return (
    <Routes>
      <Route
        index
        element={
          <RedirectAuthenticatedUsers>
            <MainPage />
          </RedirectAuthenticatedUsers>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectAuthenticatedUsers>
            <Login />
          </RedirectAuthenticatedUsers>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <RedirectAuthenticatedUsers>
            <ForgotPassward />
          </RedirectAuthenticatedUsers>
        }
      />
      <Route
        path="/reset-password/:token"
        element={
          <RedirectAuthenticatedUsers>
            <ResetPassword />
          </RedirectAuthenticatedUsers>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectAuthenticatedUsers>
            <Signup />
          </RedirectAuthenticatedUsers>
        }
      />
      <Route
        path="/verify-email"
        element={
          <RedirectAuthenticatedUsers>
            <VerifyEmail />
          </RedirectAuthenticatedUsers>
        }
      />

      {/* Always use PersistLogin for both JWT and OAuth */}
      <Route element={<PersistLogin />}>
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
