import { apiFetch } from "./http";
import { API_PATHS } from "./config";

export const UsersAPI = {
  me: () => apiFetch(API_PATHS.me),
};
