export async function getServiceDrilldown(id) {
  const response = await fetch(`${API_BASE}/${id}/drilldown`);
  return handleResponse(response, "Failed to fetch service drilldown");
}

const API_BASE = "http://localhost:3001/api/services";

async function handleResponse(response, fallbackMessage) {
  if (!response.ok) {
    let message = fallbackMessage;

    try {
      const error = await response.json();
      message = error.error || error.message || fallbackMessage;
    } catch {
      // keep fallback message
    }

    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function getServices() {
  const response = await fetch(API_BASE);
  return handleResponse(response, "Failed to fetch services");
}

export async function getServiceById(id) {
  const response = await fetch(`${API_BASE}/${id}`);
  return handleResponse(response, "Failed to fetch service");
}

export async function createService(serviceData) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serviceData),
  });

  return handleResponse(response, "Failed to create service");
}

export async function updateService(id, serviceData) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(serviceData),
  });

  return handleResponse(response, "Failed to update service");
}

export async function deactivateService(id) {
  const response = await fetch(`${API_BASE}/${id}/deactivate`, {
    method: "PATCH",
  });

  return handleResponse(response, "Failed to deactivate service");
}
