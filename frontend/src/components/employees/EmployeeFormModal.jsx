import { useEffect, useState } from "react";

const departmentOptions = [
  "Administration",
  "Customer Service",
  "Infrastructure",
  "Operations",
  "Support",
  "Utvikling",
  "Infra",
  "OPS",
  "Sales & Marketing",
];

const emptyForm = {
  employee_code: "",
  full_name: "",
  email: "",
  role_title: "",
  department: "",
  location: "",
  availability_percent: 100,
  active: true,
  notes: "",
};

export default function EmployeeFormModal({
  open,
  mode,
  employee,
  onClose,
  onSave,
  nextEmployeeCode,
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (employee) {
      setForm({
        employee_code: employee.employee_code || "",
        full_name: employee.full_name || "",
        email: employee.email || "",
        role_title: employee.role_title || "",
        department: employee.department || "",
        location: employee.location || "",
        availability_percent: employee.availability_percent ?? 100,
        active: Number(employee.active) === 1 || employee.active === true,
        notes: employee.notes || "",
      });
    } else {
      setForm({
        ...emptyForm,
        employee_code: nextEmployeeCode || "",
      });
    }
  }, [open, employee, nextEmployeeCode]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "availability_percent"
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{mode === "edit" ? "Rediger Ansatt" : "Ny Ansatt"}</h2>
            <p>{mode === "edit" ? "Oppdater employee" : "Opprett employee"}</p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Employee code</span>
              <input
                name="employee_code"
                value={form.employee_code}
                readOnly
                disabled
              />
            </label>

            <label>
              <span>Full name</span>
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Role title</span>
              <input
                name="role_title"
                value={form.role_title}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Department</span>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Velg avdeling</option>
                {departmentOptions.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Location</span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Availability %</span>
              <input
                name="availability_percent"
                type="number"
                min="0"
                max="100"
                value={form.availability_percent}
                onChange={handleChange}
              />
            </label>

            <label className="checkbox-label">
              <span>Active</span>
              <input
                name="active"
                type="checkbox"
                checked={form.active}
                onChange={handleChange}
              />
            </label>

            <label className="full-width">
              <span>Notes</span>
              <input
                name="notes"
                value={form.notes}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="ghost-btn" onClick={onClose}>
              Avbryt
            </button>
            <button type="submit" className="primary-btn">
              Lagre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}