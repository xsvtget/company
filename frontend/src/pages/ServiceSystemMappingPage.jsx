import { useEffect, useMemo, useState } from "react";
import { getServices } from "../services/serviceService";
import { getSystems } from "../services/systemService";
import {
  createServiceSystemLink,
  updateServiceSystemLink,
  getSystemsByService,
  deleteServiceSystemLink,
} from "../services/serviceRequiredSystemsService";
import "../styles/serviceSystemMapping.css";

const emptyForm = {
  service_id: "",
  system_id: "",
  required_level: "QUALIFIED",
  min_score: 0,
  is_critical: "1",
  notes: "",
};

function normalizeService(service) {
  return {
    id: service.id,
    code: service.service_code || service.code || `SVC${String(service.id).padStart(3, "0")}`,
    name: service.name || service.service_name || "",
  };
}

function normalizeSystem(system) {
  return {
    id: system.id,
    code: system.system_code || system.code || `SYS${String(system.id).padStart(3, "0")}`,
    name: system.name || system.system_name || "",
  };
}

export default function ServiceSystemMappingPage() {
  const [services, setServices] = useState([]);
  const [systems, setSystems] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [linksLoading, setLinksLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      loadLinks(selectedServiceId);
      setForm((current) => ({ ...current, service_id: selectedServiceId }));
    }
  }, [selectedServiceId]);

  async function loadBaseData() {
    try {
      setLoading(true);
      setError("");

      const [serviceRows, systemRows] = await Promise.all([
        getServices(),
        getSystems(),
      ]);

      const normalizedServices = serviceRows.map(normalizeService);
      const normalizedSystems = systemRows.map(normalizeSystem);

      setServices(normalizedServices);
      setSystems(normalizedSystems);

      if (normalizedServices[0]) {
        setSelectedServiceId(String(normalizedServices[0].id));
        setForm((current) => ({
          ...current,
          service_id: String(normalizedServices[0].id),
        }));
      }
    } catch (err) {
      setError(err.message || "Could not load mapping data");
    } finally {
      setLoading(false);
    }
  }

  async function loadLinks(serviceId) {
    try {
      setLinksLoading(true);
      const rows = await getSystemsByService(serviceId);
      setLinks(rows);
    } catch (err) {
      alert(err.message || "Could not load service mappings");
    } finally {
      setLinksLoading(false);
    }
  }

  const availableSystems = useMemo(() => {
    const usedSystemIds = new Set(
      links
        .filter((link) => !editing || link.id !== editing.id)
        .map((link) => Number(link.system_id))
    );

    return systems.filter((system) => !usedSystemIds.has(Number(system.id)));
  }, [systems, links, editing]);

  function startCreate() {
    setEditing(null);
    setForm({
      ...emptyForm,
      service_id: selectedServiceId,
      system_id: "",
    });
  }

  function startEdit(link) {
    setEditing(link);
    setForm({
      service_id: String(link.service_id),
      system_id: String(link.system_id),
      required_level: link.required_level || "QUALIFIED",
      min_score: link.min_score ?? 0,
      is_critical: String(link.is_critical || 1),
      notes: link.notes || "",
    });
  }

  async function saveLink(event) {
    event.preventDefault();

    const payload = {
      service_id: Number(form.service_id),
      system_id: Number(form.system_id),
      required_level: form.required_level || "QUALIFIED",
      min_score: Number(form.min_score ?? 0),
      is_critical: Number(form.is_critical),
      notes: form.notes?.trim() || null,
    };

    try {
      if (editing) {
        await updateServiceSystemLink(editing.id, payload);
      } else {
        await createServiceSystemLink(payload);
      }

      setEditing(null);
      setForm({
        ...emptyForm,
        service_id: selectedServiceId,
      });

      await loadLinks(selectedServiceId);
    } catch (err) {
      alert(err.message || "Could not save mapping");
    }
  }

  async function removeLink(link) {
    const confirmed = window.confirm(`Remove ${link.system_name} from this service?`);
    if (!confirmed) return;

    try {
      await deleteServiceSystemLink(link.id);
      await loadLinks(selectedServiceId);
    } catch (err) {
      alert(err.message || "Could not delete mapping");
    }
  }

  const selectedService = services.find(
    (service) => String(service.id) === String(selectedServiceId)
  );

  return (
    <div className="workbench">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">EP</div>
          <div>
            <h2>Competence & Risk Workbench</h2>
            <p>v2.3 · service/system mapping</p>
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
                className={`nav-link ${item.label === "Service/System Mapping" ? "active" : ""}`}
            >
                <span>{item.label}</span>
                <small>{item.label === "Oversikt" ? "Default" : "View"}</small>
            </button>
            ))}

        <div className="runtime-card">
          <h3>NÅ GJØR VI</h3>
          <p>Her kobler vi tjenester til systemene de krever. Dette er grunnlaget for risk, maturity og access gaps.</p>
        </div>
      </aside>

      <main className="main mapping-main">
        <header className="topbar">
          <div>
            <h1>Service/System Mapping</h1>
            <p>Koble hver tjeneste til systemene som kreves for å levere den.</p>
          </div>
        </header>

        {loading && <p className="status">Loading mapping data...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <section className="mapping-grid">
            <div className="panel mapping-left">
              <div className="panel-head">
                <h3>Velg tjeneste</h3>
                <p>Systemkravene vises for valgt tjeneste.</p>
              </div>

              <select
                className="big-select"
                value={selectedServiceId}
                onChange={(e) => {
                  setSelectedServiceId(e.target.value);
                  setEditing(null);
                }}
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.code} · {service.name}
                  </option>
                ))}
              </select>

              <div className="selected-service-card">
                <h2>{selectedService?.name}</h2>
                <p>{selectedService?.code}</p>
                <span>{links.length} required systems</span>
              </div>

              <form className="mapping-form" onSubmit={saveLink}>
                <h3>{editing ? "Rediger mapping" : "Ny service/system-mapping"}</h3>

                <label>
                  System
                  <select
                    value={form.system_id}
                    onChange={(e) => setForm({ ...form, system_id: e.target.value })}
                    required
                  >
                    <option value="">Velg system</option>
                    {availableSystems.map((system) => (
                      <option key={system.id} value={system.id}>
                        {system.code} · {system.name}
                      </option>
                    ))}
                    {editing && (
                      <option value={form.system_id}>
                        Current selected system
                      </option>
                    )}
                  </select>
                </label>

                <label>
                  Required level
                  <select
                    value={form.required_level}
                    onChange={(e) => setForm({ ...form, required_level: e.target.value })}
                  >
                    <option value="QUALIFIED">QUALIFIED</option>
                    <option value="FULLY">FULLY</option>
                    <option value="EXPERT">EXPERT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </label>

                <label>
                  Min score
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={form.min_score}
                    onChange={(e) => setForm({ ...form, min_score: e.target.value })}
                  />
                </label>

                <label>
                    Critical level
                    <select
                        value={form.is_critical}
                        onChange={(e) => setForm({ ...form, is_critical: e.target.value })}
                    >
                        <option value="1">1 - Low</option>
                        <option value="2">2 - Medium</option>
                        <option value="3">3 - High</option>
                        <option value="4">4 - Critical</option>
                    </select>
                </label>

                <label className="wide">
                  Notes
                  <input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Optional"
                  />
                </label>

                <div className="mapping-actions">
                  <button type="button" onClick={startCreate}>Reset</button>
                  <button className="blue" type="submit">
                    {editing ? "Save changes" : "Add mapping"}
                  </button>
                </div>
              </form>
            </div>

            <div className="panel mapping-right">
              <div className="panel-head">
                <h3>Required systems</h3>
                <p>Systemer som kreves for valgt tjeneste.</p>
              </div>

              {linksLoading && <p className="status">Loading links...</p>}

              {!linksLoading && (
                <div className="mapping-table">
                  <div className="mapping-table-header">
                    <span>System</span>
                    <span>Level</span>
                    <span>Score</span>
                    <span>Critical</span>
                    <span>Notes</span>
                    <span></span>
                  </div>

                  {links.map((link) => (
                    <div key={link.id} className="mapping-table-row">
                      <span>
                        <strong>{link.system_name}</strong>
                        <small>{link.system_code}</small>
                      </span>
                      <span>{link.required_level}</span>
                      <span>{link.min_score}</span>
                      <span>{link.is_critical || 1}</span>
                      <span>{link.notes || "–"}</span>
                      <span className="row-buttons">
                        <button onClick={() => startEdit(link)}>Rediger</button>
                        <button onClick={() => removeLink(link)}>Slett</button>
                      </span>
                    </div>
                  ))}

                  {links.length === 0 && (
                    <p className="empty-state">Ingen systemer er koblet til denne tjenesten ennå.</p>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
