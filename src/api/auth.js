import { apiFetch } from "./http";
import { API_PATHS } from "./config";

export const AuthAPI = {
  login: (body) => apiFetch(API_PATHS.auth_login || "/auth/login", { method: "POST", body }),
  signup: (body) => apiFetch(API_PATHS.auth_signup || "/auth/signup", { method: "POST", body }),
  me: () => apiFetch(API_PATHS.me || "/users/me", { method: "GET" }),
  logout: () => apiFetch(API_PATHS.auth_logout || "/auth/logout", { method: "POST" }),
};
