import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const API_URL = "http://192.168.1.109:4000";
  // process.env.EXPO_PUBLIC_API_URL ||
  // (Platform.OS === "android" ? "http://10.0.2.2:4000" : "http://127.0.0.1:4000");

const ACCESS_TOKEN_KEY = "cost-green-access-token";
const REFRESH_TOKEN_KEY = "cost-green-refresh-token";

let accessToken: string | null = null;
let refreshToken: string | null = null;
const memoryStorage = new Map<string, string>();

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

async function storageGet(key: string) {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return memoryStorage.get(key) ?? null;
  }
}

async function storageSet(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    memoryStorage.set(key, value);
  }
}

async function storageRemove(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    memoryStorage.delete(key);
  }
}

export async function hydrateTokens() {
  accessToken = await storageGet(ACCESS_TOKEN_KEY);
  refreshToken = await storageGet(REFRESH_TOKEN_KEY);
  return { accessToken, refreshToken };
}

export async function persistTokens(next: {
  accessToken: string;
  refreshToken?: string;
}) {
  accessToken = next.accessToken;
  await storageSet(ACCESS_TOKEN_KEY, next.accessToken);
  if (next.refreshToken) {
    refreshToken = next.refreshToken;
    await storageSet(REFRESH_TOKEN_KEY, next.refreshToken);
  }
}

export async function clearTokens() {
  accessToken = null;
  refreshToken = null;
  await storageRemove(ACCESS_TOKEN_KEY);
  await storageRemove(REFRESH_TOKEN_KEY);
}

async function refreshAccessToken() {
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    await clearTokens();
    throw new Error("Unable to refresh access token");
  }

  const data = (await response.json()) as { accessToken: string };
  await persistTokens({ accessToken: data.accessToken });
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const makeRequest = async () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (options.auth !== false && accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? (options.body ? "POST" : "GET"),
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    return response;
  };

  let response = await makeRequest();
  if (response.status === 401 && options.auth !== false && refreshToken) {
    await refreshAccessToken();
    response = await makeRequest();
  }

  if (!response.ok) {
    const raw = await response.text();
    throw new Error(raw || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function getApiUrl() {
  return API_URL;
}

export function getRefreshToken() {
  return refreshToken;
}
