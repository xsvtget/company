import { useEffect, useState } from "react";

const emptyForm = {
  system_code: "",
  system_name: "",
  environment: "PROD",
  owner_name: "",
  type: "System",
  sensitivity: "HIGH",
  biz_owner: "",
  tech_owner: "",
  active: true,
  notes: "",
};

export default function SystemFormModal({ isOpen, onClose, onSave, system }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (system) {
      setForm({
        system_code: system.system_code || "",
        system_name: system.system_name || "",
        environment: system.environment || "PROD",
        owner_name: system.owner_name || "",
        type: system.type || "System",
        sensitivity: system.sensitivity || "HIGH",
        biz_owner: system.biz_owner || "",
        tech_owner: system.tech_owner || "",
        active: system.active === 1 || system.active === true,
        notes: system.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [system, isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...form,
      active: form.active ? 1 : 0,
    });
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>{system ? "Rediger system" : "Nytt system"}</h2>
            <p>{system ? "Oppdater valgt system" : "Opprett ny rad"}</p>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-grid">
          <div className="form-field">
            <label>System ID</label>
            <input
              name="system_code"
              value={form.system_code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Navn</label>
            <input
              name="system_name"
              value={form.system_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Environment</label>
            <select name="environment" value={form.environment} onChange={handleChange}>
              <option value="PROD">PROD</option>
              <option value="TEST">TEST</option>
              <option value="DEV">DEV</option>
            </select>
          </div>

          <div className="form-field">
            <label>Owner name</label>
            <input name="owner_name" value={form.owner_name} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="System">System</option>
              <option value="Application">Application</option>
              <option value="Platform">Platform</option>
            </select>
          </div>

          <div className="form-field">
            <label>Sensitivity</label>
            <select name="sensitivity" value={form.sensitivity} onChange={handleChange}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          <div className="form-field">
            <label>Business owner</label>
            <input name="biz_owner" value={form.biz_owner} onChange={handleChange} />
          </div>

          <div className="form-field">
            <label>Technical owner</label>
            <input name="tech_owner" value={form.tech_owner} onChange={handleChange} />
          </div>

          <div className="form-field checkbox-field">
            <label>
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              Active
            </label>
          </div>

          <div className="form-field full-width">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} />
          </div>

          <div className="modal-actions full-width">
            <button type="button" className="ghost-button" onClick={onClose}>
              Avbryt
            </button>
            <button type="submit" className="primary-button">
              Lagre
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}