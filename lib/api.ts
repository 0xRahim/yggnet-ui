const BASE_URL = "http://localhost:3000";

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: unknown, options: RequestInit = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: unknown, options: RequestInit = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string, options: RequestInit = {}) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
