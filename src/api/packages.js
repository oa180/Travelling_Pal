import { apiFetch } from "./http";
import { API_PATHS } from "./config";

export const PackagesAPI = {
  list: (params) => apiFetch(API_PATHS.packages, { params }),
  get: (id) => apiFetch(`${API_PATHS.packages}/${encodeURIComponent(id)}`),
  create: (data) => apiFetch(API_PATHS.packages, { method: "POST", body: data }),
  update: (id, data) => apiFetch(`${API_PATHS.packages}/${encodeURIComponent(id)}`, { method: "PATCH", body: data }),
  delete: (id) => apiFetch(`${API_PATHS.packages}/${encodeURIComponent(id)}`, { method: "DELETE" }),
  // Swagger endpoints
  search: (body) => apiFetch(API_PATHS.search_offers, { method: "POST", body }),
  companyCreate: (data) => apiFetch(API_PATHS.company_offers, { method: "POST", body: data }),
  companyUpdate: (id, data) => apiFetch(`${API_PATHS.company_offers}/${encodeURIComponent(id)}`, { method: "PUT", body: data }),
};
