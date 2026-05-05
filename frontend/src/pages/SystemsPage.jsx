import { useEffect, useMemo, useState } from "react";
import {
  getSystems,
  createSystem,
  updateSystem,
  deactivateSystem,
} from "../services/systemService";
import "../styles/systems.css";

const emptyForm = {
  system_code: "",
  system_name: "",
  sensitivity: "MEDIUM",
  business_owner: "",
  technical_owner: "",
  comments: "",
  active: true,
};

function normalizeSystem(system) {
  return {
    ...system,
    system_code: system.system_code || system.code || `SYS${String(system.id || "").padStart(3, "0")}`,
    system_name: system.system_name || system.name || "",
    sensitivity: system.sensitivity || system.criticality || "Internal",
    business_owner: system.business_owner || system.biz_owner || system.owner_team || "Ikke satt",
    technical_owner: system.technical_owner || system.tech_owner || "Ikke satt",
    capable_count: system.capable_count ?? system.qualified_count ?? 0,
    admin_count: system.admin_count ?? system.admins_count ?? 0,
    used_by: system.used_by || system.used_by_services || system.services || "–",
    comments: system.comments || system.description || "Ingen kommentarer",
    active: system.active ?? true,
  };
}

export default function SystemsPage() {
  const [systems, setSystems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [sensitivity, setSensitivity] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [drilldownOpen, setDrilldownOpen] = useState(false);

  useEffect(() => {
    loadSystems();
  }, []);

  async function loadSystems() {
    try {
      setLoading(true);
      setError("");

      const data = await getSystems();
      const normalized = data.map(normalizeSystem);

      setSystems(normalized);
      setSelected((current) => current || normalized[0] || null);
    } catch (err) {
      setError(err.message || "Could not load systems");
    } finally {
      setLoading(false);
    }
  }

  const sensitivities = useMemo(() => {
    return ["all", ...new Set(systems.map((s) => s.sensitivity).filter(Boolean))];
  }, [systems]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return systems.filter((system) => {
      const matchesSearch =
        !q ||
        system.system_name?.toLowerCase().includes(q) ||
        system.system_code?.toLowerCase().includes(q) ||
        system.business_owner?.toLowerCase().includes(q) ||
        system.technical_owner?.toLowerCase().includes(q) ||
        system.used_by?.toLowerCase().includes(q);

      const matchesSensitivity =
        sensitivity === "all" || system.sensitivity === sensitivity;

      return matchesSearch && matchesSensitivity;
    });
  }, [systems, search, sensitivity]);

  const nextSystemCode = useMemo(() => {
    const max = systems.reduce((highest, system) => {
      const number = Number(String(system.system_code || "").replace(/\D/g, ""));
      return Number.isFinite(number) && number > highest ? number : highest;
    }, 0);

    return `SYS${String(max + 1).padStart(3, "0")}`;
  }, [systems]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, system_code: nextSystemCode });
    setModalOpen(true);
  }

  function openEdit(system) {
    setEditing(system);
    setForm({
      system_code: system.system_code || "",
      system_name: system.system_name || "",
      sensitivity: system.sensitivity || "Internal",
      business_owner: system.business_owner === "Ikke satt" ? "" : system.business_owner || "",
      technical_owner: system.technical_owner === "Ikke satt" ? "" : system.technical_owner || "",
      comments: system.comments === "Ingen kommentarer" ? "" : system.comments || "",
      active: system.active ?? true,
    });
    setModalOpen(true);
  }

  async function saveSystem(event) {
    event.preventDefault();

    const payload = {
      system_code: form.system_code ?? null,
      system_name: form.system_name ?? null,

      // нова логіка для UI
      sensitivity: form.sensitivity ?? "Internal",
      business_owner: form.business_owner?.trim() || null,
      technical_owner: form.technical_owner?.trim() || null,
      comments: form.comments?.trim() || null,

      // поля, які може чекати backend
      system_type: "System",
      owner_team: form.business_owner?.trim() || null,
      criticality: form.sensitivity ?? "Internal",
      description: form.comments?.trim() || null,

      active: form.active ?? true,
    };

    try {
      if (editing) {
        await updateSystem(editing.id, payload);
      } else {
        await createSystem(payload);
      }

      setModalOpen(false);
      await loadSystems();
    } catch (err) {
      alert(err.message || "Could not save system");
    }
  }

  async function handleDeactivate(system) {
    const confirmed = window.confirm(`Deactivate ${system.system_name}?`);
    if (!confirmed) return;

    try {
      await deactivateSystem(system.id);
      await loadSystems();
    } catch (err) {
      alert(err.message || "Could not deactivate system");
    }
  }

  return (
    <div className="workbench">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">EP</div>
          <div>
            <h2>Competence & Risk Workbench</h2>
            <p>v2.3 · editable · import wizard · bulk edit</p>
          </div>
        </div>

        <p className="side-title">HOVEDFLATER</p>

        {[
          { label: "Oversikt", path: "#/people" },
          { label: "Services", path: "#/services" },
          { label: "People", path: "#/people" },
          { label: "Systems", path: "#/systems" },
          { label: "Service/System Mapping", path: "#/mapping" },
          { label: "Actions & Reviews", path: "#/people" },
          { label: "Data Editor", path: "#/people" },
          { label: "Datakvalitet", path: "#/people" },
          { label: "Audit-logg", path: "#/people" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => (window.location.hash = item.path)}
            className={`nav-link ${item.label === "Systems" ? "active" : ""}`}
          >
            <span>{item.label}</span>
            <small>{item.label === "Oversikt" ? "Default" : "View"}</small>
          </button>
        ))}

        <div className="runtime-card">
          <h3>RUNTIME</h3>
          <p>Denne versjonen kombinerer moderne GUI, explainable risk, inline-redigering, direkte .xlsx-import, relasjonsoppdatering, audit-logg og bulk-redigering.</p>
          <button>Eksporter JSON</button>
          <button>Importer JSON</button>
          <button className="warning">Reset til seed</button>
        </div>

        <div className="news-card">
          <h3>NYHETER I V2.3</h3>
          <p>1) Direkte .xlsx-import i browser<br />2) Import-wizard med preview og validering<br />3) Bulk edit for qualifications/access<br />4) Audit-logg<br />5) CSV-eksport per datasett<br />6) Employee-spesifikke Excel-maler</p>
        </div>
      </aside>

      <main className="main systems-main">
        <header className="topbar">
          <div>
            <h1>Systems</h1>
            <p>Assets, eierskap og admin footprint</p>
          </div>

          <div className="top-actions">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Søk på ansatte, tjenester, systemer"
            />
            <button>Datakvalitet</button>
            <button>Audit-logg</button>
            <button className="blue">Data Editor</button>
          </div>
        </header>

        <div className="toolbar">
          <select value={sensitivity} onChange={(e) => setSensitivity(e.target.value)}>
            {sensitivities.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "Alle sensitiviteter" : item}
              </option>
            ))}
          </select>

          <div>
            <button className="blue" onClick={openCreate}>Nytt system</button>
            <button>Ny service/system-mapping</button>
          </div>
        </div>

        <section className="systems-panel panel">
          <div className="panel-head">
            <h3>Systemer / assets</h3>
            <p>Type, eierskap, capability, admin footprint og bruk i tjenester.</p>
          </div>

          {loading && <p className="status">Loading systems...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div className="systems-table">
              <div className="systems-table-header">
                <span>System</span>
                <span>Sensitivity</span>
                <span>Biz owner</span>
                <span>Tech owner</span>
                <span>Capable</span>
                <span>Admins</span>
                <span>Used by</span>
                <span>Kommentar</span>
                <span></span>
              </div>

              {filtered.map((system) => (
                <div
                  key={system.id}
                  className={`systems-table-row ${selected?.id === system.id ? "selected" : ""}`}
                  onClick={() => setSelected(system)}
                >
                  <span>
                    <strong>{system.system_name}</strong>
                    <small>{system.system_code}</small>
                  </span>
                  <span>{system.sensitivity}</span>
                  <span>{system.business_owner || "Ikke satt"}</span>
                  <span>{system.technical_owner || "Ikke satt"}</span>
                  <span>{system.capable_count}</span>
                  <span>{system.admin_count}</span>
                  <span>{system.used_by || "–"}</span>
                  <span className="muted">{system.comments || "Ingen kommentarer"}</span>
                  <span className="row-buttons">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(system);
                        setDrilldownOpen(true);
                      }}
                    >
                      Vis
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); openEdit(system); }}>Rediger</button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>


      {modalOpen && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={saveSystem}>
            <div className="modal-head">
              <div>
                <h2>{editing ? "Rediger system" : "Nytt system"}</h2>
                <p>System code lages automatisk og kan ikke endres</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div className="form-grid">
              <label>
                System code
                <input value={form.system_code} readOnly className="readonly-input" />
              </label>

              <label>
                System name
                <input
                  value={form.system_name}
                  onChange={(e) => setForm({ ...form, system_name: e.target.value })}
                  required
                />
              </label>

              <label>
                Sensitivity
                <select value={form.sensitivity} onChange={(e) => setForm({ ...form, sensitivity: e.target.value })}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </label>

              <label>
                Biz owner
                <input
                  value={form.business_owner}
                  onChange={(e) => setForm({ ...form, business_owner: e.target.value })}
                  placeholder="Ikke satt"
                />
              </label>

              <label>
                Tech owner
                <input
                  value={form.technical_owner}
                  onChange={(e) => setForm({ ...form, technical_owner: e.target.value })}
                  placeholder="Ikke satt"
                />
              </label>

              <label>
                Active
                <select value={String(form.active)} onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>

              <label className="wide">
                Kommentar
                <input
                  value={form.comments}
                  onChange={(e) => setForm({ ...form, comments: e.target.value })}
                  placeholder="Ingen kommentarer"
                />
              </label>
            </div>

            <div className="modal-actions">
              {editing && (
                <button type="button" className="danger" onClick={() => handleDeactivate(editing)}>
                  Deaktiver
                </button>
              )}
              <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="blue">Save</button>
            </div>
          </form>
        </div>
      )}

      {drilldownOpen && selected && (
        <aside className="system-drawer">
          <div className="drilldown-head">
            <div>
              <h2>System drilldown</h2>
              <p>Asset view for {selected.system_name}</p>
            </div>

            <button onClick={() => setDrilldownOpen(false)}>×</button>
          </div>

          <div className="drill-card">
            <h3>{selected.system_name}</h3>
            <p>{selected.system_code} · Sensitivity {selected.sensitivity} · Type System</p>
          </div>

          <div className="drill-card">
            <h3>Eierskap</h3>
            <p>Business owner: {selected.business_owner || "Ikke satt"}</p>
            <p>Technical owner: {selected.technical_owner || "Ikke satt"}</p>
          </div>

          <div className="drill-card">
            <h3>Capability / admin footprint</h3>
            <p>Capable personer: {selected.capable_count}</p>
            <p>Admins: {selected.admin_count}</p>
          </div>

          <div className="drill-card">
            <h3>Brukes av tjenester</h3>
            <p>{selected.used_by || "Ingen tjenester"}</p>
          </div>
        </aside>
      )}
    </div>
  );
}
