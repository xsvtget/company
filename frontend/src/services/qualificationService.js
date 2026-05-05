const API_BASE = "http://localhost:3001/api/qualifications";

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

export async function createQualification(data) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return handleResponse(response, "Failed to create qualification");
}

export async function getQualificationsByEmployee(employeeId) {
  const response = await fetch(`${API_BASE}/employee/${employeeId}`);
  return handleResponse(response, "Failed to fetch qualifications");
}