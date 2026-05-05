const API_BASE = "http://localhost:3001/api/systems";

async function handleResponse(response, fallbackMessage) {
  if (!response.ok) {
    let message = fallbackMessage;
    try {
      const error = await response.json();
      message = error.error || fallbackMessage;
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function getSystems() {
  const res = await fetch(API_BASE);
  return handleResponse(res, "Failed to fetch systems");
}

export async function createSystem(data) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to create system");
}

export async function updateSystem(id, data) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res, "Failed to update system");
}

export async function deactivateSystem(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res, "Failed to delete system");
}