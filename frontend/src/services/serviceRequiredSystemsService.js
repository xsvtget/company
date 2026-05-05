const API_BASE = "http://localhost:3001/api/service-required-systems";

async function handleResponse(response, fallbackMessage) {
  if (!response.ok) {
    let message = fallbackMessage;

    try {
      const error = await response.json();
      message = error.error || error.message || fallbackMessage;
    } catch {
      // keep fallback
    }

    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function createServiceSystemLink(data) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(response, "Failed to create service-system link");
}

export async function updateServiceSystemLink(id, data) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(response, "Failed to update service-system link");
}

export async function getSystemsByService(serviceId) {
  const response = await fetch(`${API_BASE}/service/${serviceId}`);
  return handleResponse(response, "Failed to fetch required systems for service");
}

export async function getServicesBySystem(systemId) {
  const response = await fetch(`${API_BASE}/system/${systemId}`);
  return handleResponse(response, "Failed to fetch services for system");
}

export async function deleteServiceSystemLink(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });

  return handleResponse(response, "Failed to delete service-system link");
}
