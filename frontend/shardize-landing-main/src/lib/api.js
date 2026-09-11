// ============================================================
// API CLIENT — talks to the Shardize Django REST backend
// ============================================================
// Configure the backend base URL via a Vite env var, e.g.:
//   VITE_API_URL=http://192.168.29.121:8000/api
// Falls back to localhost for local development.

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const TOKEN_KEY = 'shardize_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Core request helper. Automatically attaches the DRF token
 * (Authorization: Token <key>) when present, and JSON-encodes
 * plain object bodies. FormData bodies (file uploads) are sent
 * as-is so the browser sets the correct multipart boundary.
 */
async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {};
  const token = getToken();

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  let payload = body;

  if (body && !isForm) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: payload,
    });
  } catch (networkError) {
    throw new Error(
      `Could not reach the backend at ${API_BASE_URL}. Is the Django server running? (${networkError.message})`
    );
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    // Binary response (e.g. file download/view)
    return response;
  }

  const data = await response.json();

  if (!response.ok || data.success === false) {
    const message =
      data.message ||
      (data.errors && JSON.stringify(data.errors)) ||
      'Request failed.';
    const error = new Error(message);
    error.data = data;
    error.status = response.status;
    throw error;
  }

  return data;
}

// ------------------------------------------------------------
// AUTH
// ------------------------------------------------------------

export const authApi = {
  register: (username, email, password, password2) =>
    request('/auth/register/', {
      method: 'POST',
      body: { username, email, password, password2 },
    }),

  login: (username, password) =>
    request('/auth/login/', {
      method: 'POST',
      body: { username, password },
    }),

  logout: () =>
    request('/auth/logout/', {
      method: 'POST',
    }),

  me: () => request('/auth/me/'),
};

// ------------------------------------------------------------
// FILES
// ------------------------------------------------------------

export const filesApi = {
  list: () => request('/files/'),

  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/files/upload/', {
      method: 'POST',
      body: formData,
      isForm: true,
    });
  },

  detail: (fileId) => request(`/files/${fileId}/`),

  delete: (fileId) =>
    request(`/files/${fileId}/delete/`, {
      method: 'DELETE',
    }),

  // Download/view are authenticated binary endpoints — fetched
  // directly (with the auth header) rather than via <a href>,
  // since the backend requires the DRF token to serve the file.
  downloadBlob: async (fileId) => {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/files/${fileId}/download/`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    });
    if (!res.ok) throw new Error('Download failed.');
    return res.blob();
  },

  viewBlob: async (fileId) => {
    const token = getToken();
    const res = await fetch(`${API_BASE_URL}/files/${fileId}/view/`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    });
    if (!res.ok) throw new Error('Could not open file.');
    return res.blob();
  },
};

// ------------------------------------------------------------
// PROVIDER
// ------------------------------------------------------------

export const providerApi = {
  becomeProvider: () =>
    request('/become-provider/', {
      method: 'POST',
    }),

  getNode: () => request('/provider/node/'),

  registerNode: (displayName, allocatedStorageGb) =>
    request('/provider/node/register/', {
      method: 'POST',
      body: {
        display_name: displayName,
        allocated_storage_gb: allocatedStorageGb,
      },
    }),
};

// ------------------------------------------------------------
// NETWORK
// ------------------------------------------------------------

export const networkApi = {
  stats: () => request('/network/stats/'),
};

export { API_BASE_URL };
