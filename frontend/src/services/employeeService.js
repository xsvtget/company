const API_BASE = "http://localhost:3001/api/employees";

export async function getEmployees() {
  const response = await fetch(API_BASE);

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }

  return response.json();
}

export async function getEmployeeById(id) {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch employee");
  }

  return response.json();
}

export async function createEmployee(employeeData) {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create employee");
  }

  return response.json();
}

export async function updateEmployee(id, employeeData) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update employee");
  }

  return response.json();
}

export async function deactivateEmployee(id) {
  const response = await fetch(`${API_BASE}/${id}/deactivate`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to deactivate employee");
  }

  return response.json();
}