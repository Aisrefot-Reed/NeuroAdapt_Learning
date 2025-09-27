const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.blob(); // For audio files
}

// --- Auth ---
export const login = (email: string, password: string) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

export const register = (email: string, password: string) => {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

// --- Content ---
export const adaptContent = (text: string, token: string) => {
  return request("/adapt-content", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });
};

// --- TTS ---
export const textToSpeech = (text: string, token: string) => {
  return request("/text-to-speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });
};

// --- Profile ---
export const setNeuroProfile = (profileId: number, token: string) => {
  return request("/users/profile", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ neuroprofile_id: profileId }),
  });
};

export const getNeuroProfiles = (token: string) => {
  return request("/neuroprofiles", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
