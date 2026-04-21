import { useEffect, useState } from "react";

const emptyForm = {
  id: "",
  name: "",
  department: "",
  role: "",
  location: "",
  availability: 100,
  qualified: 0,
  fully: 0,
  expert: 0,
  accessGaps: 0,
  serviceFootprint: "",
  systems: [],
};

export default function EmployeeFormModal({
  open,
  mode,
  employee,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(emptyForm);
  const [systemsText, setSystemsText] = useState("");

  useEffect(() => {
    if (!open) return;

    if (employee) {
      setForm({
        ...emptyForm,
        ...employee,
      });
      setSystemsText((employee.systems || []).join(", "));
    } else {
      setForm(emptyForm);
      setSystemsText("");
    }
  }, [open, employee]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        ["availability", "qualified", "fully", "expert", "accessGaps", "id"].includes(
          name
        )
          ? Number(value)
          : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      systems: systemsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    onSave(payload);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{mode === "edit" ? "Rediger Ansatt" : "Ny Ansatt"}</h2>
            <p>{mode === "edit" ? "Oppdater eksisterende rad" : "Opprett ny rad"}</p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              <span>Employee ID</span>
              <input
                name="id"
                type="number"
                value={form.id}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Navn</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Rolle</span>
              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Avdeling</span>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Lokasjon</span>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Availability %</span>
              <input
                name="availability"
                type="number"
                min="0"
                max="100"
                value={form.availability}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Qualified</span>
              <input
                name="qualified"
                type="number"
                min="0"
                value={form.qualified}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Fully</span>
              <input
                name="fully"
                type="number"
                min="0"
                value={form.fully}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Expert</span>
              <input
                name="expert"
                type="number"
                min="0"
                value={form.expert}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Access gaps</span>
              <input
                name="accessGaps"
                type="number"
                min="0"
                value={form.accessGaps}
                onChange={handleChange}
              />
            </label>

            <label className="full-width">
              <span>Service footprint</span>
              <input
                name="serviceFootprint"
                value={form.serviceFootprint}
                onChange={handleChange}
              />
            </label>

            <label className="full-width">
              <span>System qualifications (comma separated)</span>
              <input
                value={systemsText}
                onChange={(e) => setSystemsText(e.target.value)}
                placeholder="Cisco — score 9, Azure — score 8"
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