import { useEffect, useMemo, useState } from "react";
import { getSystems } from "../../services/systemService";
import { createQualification } from "../../services/qualificationService";

function today() {
  return new Date().toISOString().slice(0, 10);
}

function nextYear() {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().slice(0, 10);
}

function calculateLevel(totalScore) {
  if (totalScore >= 12) return "EXPERT";
  if (totalScore >= 8) return "FULLY_CAPABLE";
  return "BASIC";
}

export default function QualificationModal({ employee, onClose, onSaved }) {
  const [systems, setSystems] = useState([]);
  const [form, setForm] = useState({
    system_id: "",
    experience_score: 0,
    certification_points: 0,
    knowledge_score: 0,
    entry_date: today(),
    review_due_date: nextYear(),
    is_reviewed: false,
    notes: "",
  });

  useEffect(() => {
    getSystems()
      .then((rows) => setSystems(rows))
      .catch((err) => alert(err.message || "Could not load systems"));
  }, []);

  const totalScore = useMemo(() => {
    return (
      Number(form.experience_score || 0) +
      Number(form.certification_points || 0) +
      Number(form.knowledge_score || 0)
    );
  }, [form.experience_score, form.certification_points, form.knowledge_score]);

  const qualificationLevel = useMemo(() => {
    return calculateLevel(totalScore);
  }, [totalScore]);

  async function saveQualification(event) {
    event.preventDefault();

    const payload = {
      employee_id: Number(employee.id),
      system_id: Number(form.system_id),
      experience_score: Number(form.experience_score || 0),
      certification_points: Number(form.certification_points || 0),
      knowledge_score: Number(form.knowledge_score || 0),
      total_score: totalScore,
      qualification_level: qualificationLevel,
      entry_date: form.entry_date || null,
      review_due_date: form.review_due_date || null,
      is_reviewed: form.is_reviewed ? 1 : 0,
      notes: form.notes?.trim() || null,
    };

    try {
      await createQualification(payload);
      onSaved?.();
      onClose();
    } catch (err) {
      alert(err.message || "Could not save qualification");
    }
  }

  if (!employee) return null;

  return (
    <div className="modal-backdrop">
      <form className="modal qualification-modal" onSubmit={saveQualification}>
        <div className="modal-head">
          <div>
            <h2>Ny Qualification</h2>
            <p>Opprett ny rad</p>
          </div>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <div className="form-grid">
          <label>
            Employee
            <input
              value={`${employee.employee_code || employee.id} — ${employee.full_name}`}
              readOnly
              className="readonly-input"
            />
          </label>

          <label>
            System
            <select
              value={form.system_id}
              onChange={(e) => setForm({ ...form, system_id: e.target.value })}
              required
            >
              <option value="">Velg system</option>
              {systems.map((system) => (
                <option key={system.id} value={system.id}>
                  {(system.system_code || system.code || `SYS${system.id}`)} — {(system.name || system.system_name)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Experience
            <input
              type="number"
              min="0"
              max="5"
              value={form.experience_score}
              onChange={(e) => setForm({ ...form, experience_score: e.target.value })}
            />
          </label>

          <label>
            Certification
            <select
              value={form.certification_points}
              onChange={(e) => setForm({ ...form, certification_points: e.target.value })}
            >
              <option value="0">None</option>
              <option value="1">Basic certificate</option>
              <option value="2">Relevant certificate</option>
              <option value="3">Advanced certificate</option>
            </select>
          </label>

          <label>
            Knowledge
            <input
              type="number"
              min="0"
              max="5"
              value={form.knowledge_score}
              onChange={(e) => setForm({ ...form, knowledge_score: e.target.value })}
            />
          </label>

          <label>
            Entry date
            <input
              type="date"
              value={form.entry_date}
              onChange={(e) => setForm({ ...form, entry_date: e.target.value })}
            />
          </label>

          <label>
            Review due
            <input
              type="date"
              value={form.review_due_date}
              onChange={(e) => setForm({ ...form, review_due_date: e.target.value })}
            />
          </label>

          <label>
            Reviewed
            <select
              value={String(form.is_reviewed)}
              onChange={(e) => setForm({ ...form, is_reviewed: e.target.value === "true" })}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </label>

          <label>
            Total score
            <input value={totalScore} readOnly className="readonly-input" />
          </label>

          <label>
            Qualification level
            <input value={qualificationLevel} readOnly className="readonly-input" />
          </label>

          <label className="wide">
            Notes
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional"
            />
          </label>
        </div>

        <div className="modal-actions">
          <button type="button" onClick={onClose}>Avbryt</button>
          <button type="submit" className="blue">Lagre</button>
        </div>
      </form>
    </div>
  );
}
