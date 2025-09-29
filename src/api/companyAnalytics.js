import { apiFetch } from "./http";

export const CompanyAnalyticsAPI = {
  getSummary: ({ from, to, companyId, packageId, destination }) =>
    apiFetch(`/company/analytics/summary`, { method: "GET", params: { from, to, companyId, packageId, destination } }),

  getTopPackages: ({ from, to, companyId, sort = "revenue", limit = 20 }) =>
    apiFetch(`/company/analytics/top-packages`, { method: "GET", params: { from, to, sort, limit, companyId } }),

  getRecentBookings: ({ from, to, companyId, limit = 20 }) =>
    apiFetch(`/company/analytics/recent-bookings`, { method: "GET", params: { from, to, limit, companyId } }),

  getPackages: ({ query = "", companyId }) =>
    apiFetch(`/company/packages`, { method: "GET", params: { query, companyId } }),

  getDestinations: ({ companyId }) =>
    apiFetch(`/company/destinations`, { method: "GET", params: { companyId } }),
};
