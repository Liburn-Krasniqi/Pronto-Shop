import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:3333";

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = Cookies.get("refresh_token");
    if (!refreshToken) return null;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Refresh token failed");
    }

    const { access_token, refresh_token } = await response.json();
    Cookies.set("access_token", access_token);
    if (refresh_token) {
      Cookies.set("refresh_token", refresh_token);
    }
    return access_token;
  } catch (error) {
    // Clear tokens and redirect to login if refresh fails
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    window.location.href = "/login";
    return null;
  }
};

const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  retry = true
): Promise<any> => {
  try {
    const token = Cookies.get("access_token");
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    // If unauthorized and we haven't tried refreshing yet
    if (response.status === 401 && retry) {
      // Ensure only one refresh request happens at a time
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }

      const newToken = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (newToken) {
        // Retry the original request with new token
        return fetchWithRetry(url, options, false);
      }
    }

    return handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const apiClient = {
  get: async (url: string) => fetchWithRetry(url, { method: "GET" }),

  post: async (url: string, body: any) =>
    fetchWithRetry(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),

  put: async (url: string, body: any) =>
    fetchWithRetry(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),

  patch: async (url: string, body: any) =>
    fetchWithRetry(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }),

  delete: async (url: string) => fetchWithRetry(url, { method: "DELETE" }),
};
