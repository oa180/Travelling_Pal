import { apiFetch } from "./http";
import { API_PATHS } from "./config";

export const BookingsAPI = {
  list: (params) => apiFetch(API_PATHS.bookings, { params }),
  get: (id) => apiFetch(`${API_PATHS.bookings}/${encodeURIComponent(id)}`),
  create: (data) => apiFetch(API_PATHS.bookings, { method: "POST", body: data }),
  update: (id, data) => apiFetch(`${API_PATHS.bookings}/${encodeURIComponent(id)}`, { method: "PATCH", body: data }),
  delete: (id) => apiFetch(`${API_PATHS.bookings}/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
