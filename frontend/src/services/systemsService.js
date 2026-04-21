const API_BASE = "http://localhost:3001/api/systems";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function getSystems() {
  const response = await fetch(API_BASE);
  return handleResponse(response);
}

export async function getSystemById(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  return handleResponse(response);
}

export async function createSystem(systemData) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(systemData),
  });

  return handleResponse(response);
}

export async function updateSystem(id, systemData) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(systemData),
  });

  return handleResponse(response);
}

export async function deactivateSystem(id) {
  const response = await fetch(`${API_BASE}/${id}/deactivate`, {
    method: "PATCH",
  });

  return handleResponse(response);
}