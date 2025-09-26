import { apiFetch } from "./http";
import { API_PATHS } from "./config";

export const ChatAPI = {
  suggest: (body) => apiFetch(API_PATHS.chat_suggest, { method: "POST", body }),
};
