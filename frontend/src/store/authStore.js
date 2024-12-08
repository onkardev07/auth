import { atom } from "recoil";

export const BASE_URL = "http://localhost:3000/api/auth";

export const isLoadingState = atom({
  key: "isLoadingState",
  default: false,
});

export const isAuthenticatedState = atom({
  key: "isAuthenticatedState",
  default: null,
});

export const accessTokenState = atom({
  key: "accessTokenState",
  default: null,
});

export const userState = atom({
  key: "userState",
  default: null,
});

export const errorState = atom({
  key: "errorState",
  default: null,
});

export const isVerifiedState = atom({
  key: "isVerifiedState",
  default: false,
});

export const isRefreshingState = atom({
  key: "isRefreshingState",
  default: false,
});

export const profilePicState = atom({
  key: "profilePicState",
  default: null,
});

export const authModeState = atom({
  key: "authModeState",
  default: localStorage.getItem("authMode") || "JWT", // Assuming JWT is default
  effects_UNSTABLE: [
    ({ onSet }) => {
      onSet((mode) => {
        localStorage.setItem("authMode", mode);
      });
    },
  ],
});
