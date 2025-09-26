import { API_BASE_URL } from "./config";

const DEBUG_API = (import.meta.env.VITE_DEBUG_API || "false").toLowerCase() === "true";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text();
  if (DEBUG_API) {
    // Shallow log to avoid noisy binary bodies
    // eslint-disable-next-line no-console
    console.log("[API] Response:", {
      status: res.status,
      ok: res.ok,
      url: res.url,
      contentType,
      preview: isJson ? body : String(body).slice(0, 200),
    });
  }
  if (!res.ok) {
    const error = new Error((body && body.message) || res.statusText || "Request failed");
    error.status = res.status;
    error.body = body;
    throw error;
  }
  return body;
}

export async function apiFetch(path, { method = "GET", params, body, headers } = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params && typeof params === "object") {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  if (DEBUG_API) {
    // eslint-disable-next-line no-console
    console.log("[API] Request:", {
      method,
      url: url.toString(),
      params: Object.fromEntries(url.searchParams.entries()),
      body: body !== undefined ? body : undefined,
      headers,
    });
  }
  const res = await fetch(url.toString(), {
    method,
    headers: { ...defaultHeaders, ...(headers || {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  return handleResponse(res);
}
