import { API_URL } from "@/lib/auth-client";
import { authClient } from "@/lib/auth-client";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

async function getToken() {
  const sessionRes = await (authClient as any).getSession?.();
  return (
    sessionRes?.data?.session?.token ?? sessionRes?.data?.token ?? null
  ) as string | null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const token = await getToken();

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(json?.error ?? "Request failed");
  }

  return json as T;
}

export async function apiUpload(fileUri: string, name = "image.jpg") {
  const token = await getToken();
  const formData = new FormData();

  formData.append("file", {
    uri: fileUri,
    name,
    type: "image/jpeg",
  } as any);

  const response = await fetch(`${API_URL}/api/v1/upload`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(json?.error ?? "Upload failed");
  }

  return json as { success: boolean; url: string; publicId: string };
}
