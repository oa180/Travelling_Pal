export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";
export const USE_API = (import.meta.env.VITE_USE_API || "false").toLowerCase() === "true" && !!API_BASE_URL;

// Optional endpoint overrides via env if your backend paths differ
export const API_PATHS = {
  // Swagger uses /offers for public listing and /offers/{id}
  packages: import.meta.env.VITE_API_PATH_PACKAGES || "/offers",
  bookings: import.meta.env.VITE_API_PATH_BOOKINGS || "/bookings",
  // Not present in Swagger; falls back to placeholder if missing
  me: import.meta.env.VITE_API_PATH_ME || "/users/me",
  // Company (protected) endpoints for offers create/update per Swagger
  company_offers: import.meta.env.VITE_API_PATH_COMPANY_OFFERS || "/company/offers",
  // Public search endpoint per Swagger
  search_offers: import.meta.env.VITE_API_PATH_SEARCH_OFFERS || "/search_offers",
  // Chat suggest endpoint
  chat_suggest: import.meta.env.VITE_API_PATH_CHAT_SUGGEST || "/chat/suggest",
};
