import { useEffect, useMemo, useState } from "react";
import "../styles/services.css";
import { getServices, createService, updateService, deactivateService, getServiceDrilldown } from "../services/serviceService";

const emptyForm = {
  service_code: "",
  name: "",
  service_name: "",
  category: "Managed Service",
  owner_team: "",
  criticality: "MEDIUM",
  description: "",
  active: true,
};

function normalizeService(service) {
  return {
    ...service,
    service_code:
      service.service_code ||
      service.code ||
      `SVC${String(service.id || "").padStart(3, "0")}`,
    name: service.name || service.service_name || "",
    category: service.category || service.service_type || "Managed Service",
    owner_team: service.owner_team || service.owner || "Ikke satt",
    criticality: service.criticality || service.risk_level || "MEDIUM",
    required_systems_count:
      service.required_systems_count ?? service.systems_count ?? 0,
    qualified_people_count:
      service.qualified_people_count ?? service.people_count ?? 0,
    coverage_percent:
      service.coverage_percent ?? service.coverage ?? 0,
    access_gaps_count:
      service.access_gaps_count ?? service.gaps_count ?? 0,
    description:
      service.description || service.notes || "Ingen beskrivelse",
    active: service.active ?? true,
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const data = await getServices();
      const normalized = data.map(normalizeService);

      setServices(normalized);
      setSelected((current) => current || normalized[0] || null);
    } catch (err) {
      setError(err.message || "Could not load services");
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    return ["all", ...new Set(services.map((s) => s.category).filter(Boolean))];
  }, [services]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return services.filter((service) => {
      const matchesSearch =
        !q ||
        service.name?.toLowerCase().includes(q) ||
        service.service_code?.toLowerCase().includes(q) ||
        service.category?.toLowerCase().includes(q) ||
        service.owner_team?.toLowerCase().includes(q);

      const matchesCategory = category === "all" || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, category]);

  const nextServiceCode = useMemo(() => {
    const max = services.reduce((highest, service) => {
      const number = Number(String(service.service_code || "").replace(/\D/g, ""));
      return Number.isFinite(number) && number > highest ? number : highest;
    }, 0);

    return `SVC${String(max + 1).padStart(3, "0")}`;
  }, [services]);

  function openCreate() {
    setEditing(null);
    setForm({
      ...emptyForm,
      service_code: nextServiceCode,
      name: "",
      service_name: "",
    });
    setModalOpen(true);
  }

  function openEdit(service) {
    setEditing(service);
    setForm({
      service_code: service.service_code || "",
      name: service.name || "",
      service_name: service.name || "",
      category: service.category || "Managed Service",
      owner_team: service.owner_team === "Ikke satt" ? "" : service.owner_team || "",
      criticality: service.criticality || "MEDIUM",
      description:
        service.description === "Ingen beskrivelse" ? "" : service.description || "",
      active: service.active ?? true,
    });
    setModalOpen(true);
  }

  async function saveService(event) {
    event.preventDefault();

    const cleanName = form.name?.trim() || form.service_name?.trim();

    const payload = {
      service_code: form.service_code ?? null,
      name: cleanName ?? null,
      service_name: cleanName ?? null,
      category: form.category ?? "Managed Service",
      service_type: form.category ?? "Managed Service",
      owner_team: form.owner_team?.trim() || null,
      owner: form.owner_team?.trim() || null,
      criticality: form.criticality ?? "MEDIUM",
      risk_level: form.criticality ?? "MEDIUM",
      description: form.description?.trim() || null,
      notes: form.description?.trim() || null,
      active: form.active ?? true,
    };

    try {
      if (editing) {
        await updateService(editing.id, payload);
      } else {
        await createService(payload);
      }

      setModalOpen(false);
      await loadServices();
    } catch (err) {
      alert(err.message || "Could not save service");
    }
  }

  async function handleDeactivate(service) {
    const confirmed = window.confirm(`Deactivate ${service.name}?`);
    if (!confirmed) return;

    try {
      await deactivateService(service.id);
      await loadServices();
    } catch (err) {
      alert(err.message || "Could not deactivate service");
    }
  }

  function getGap(service) {
  const min = Number(service.min_qualified || 0);
  const qualified = Number(service.qualified_people_count || 0);
  return Math.max(min - qualified, 0);
}

function getSpof(service) {
  return (
    Number(service.qualified_people_count || 0) <= 1 &&
    Number(service.required_systems_count || 0) > 0
  );
}

function getRisk(service) {
  const gap = getGap(service);
  const spof = getSpof(service);

  if (gap >= 2 || spof) return "RED";
  if (gap === 1) return "YELLOW";
  if (Number(service.required_systems_count || 0) === 0) return "N/A";
  return "GREEN";
}

function getActionsCount(service) {
  return getGap(service) + (getSpof(service) ? 1 : 0);
}

return (
    <div className="workbench">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">EP</div>
          <div>
            <h2>Competence & Risk Workbench</h2>
            <p>v2.3 · services · system mapping</p>
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
                className={`nav-link ${item.label === "Services" ? "active" : ""}`}
            >
                <span>{item.label}</span>
                <small>{item.label === "Oversikt" ? "Default" : "View"}</small>
            </button>
            ))}

        <div className="runtime-card">
          <h3>RUNTIME</h3>
          <p>Services kobler selskapets leveranser til nødvendige systemer, kompetanse og access-gaps.</p>
          <button>Eksporter JSON</button>
          <button>Importer JSON</button>
          <button className="warning">Reset til seed</button>
        </div>

        <div className="news-card">
          <h3>NESTE STEG</h3>
          <p>1) Services CRUD<br />2) Mapping service → required systems<br />3) Qualifications og coverage logic</p>
        </div>
      </aside>

      <main className="main services-main">
        <header className="topbar">
          <div>
            <h1>Services</h1>
            <p>Tjenester, eierskap, coverage og systemkrav</p>
          </div>

          <div className="top-actions">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Søk på tjenester, systemer, owner"
            />
            <button>Datakvalitet</button>
            <button>Audit-logg</button>
            <button className="blue">Data Editor</button>
          </div>
        </header>

        <div className="toolbar">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "Alle kategorier" : item}
              </option>
            ))}
          </select>

          <div>
            <button className="blue" onClick={openCreate}>Ny service</button>
            <button onClick={() => (window.location.hash = "#/mapping")}>
                Ny service/system-mapping
            </button>
          </div>
        </div>

        <section className="services-panel panel">
          <div className="panel-head">
            <h3>Tjenester / services</h3>
            <p>Hva selskapet leverer, hvem som eier tjenesten, og hvor god dekningen er.</p>
          </div>

          {loading && <p className="status">Loading services...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && (
            <div className="services-table">
              <div className="services-table-header">
                <span>Tjeneste</span>
                <span>Risk</span>
                <span>Qualified</span>
                <span>Fully</span>
                <span>Gap</span>
                <span>SPOF</span>
                <span>Maturity</span>
                <span>Actions</span>
                <span></span>
              </div>

              {filtered.map((service) => (
                <div
                  key={service.id}
                  className={`services-table-row ${selected?.id === service.id ? "selected" : ""}`}
                  onClick={() => setSelected(service)}
                >
                  <span>
                    <strong>{service.name}</strong>
                    <small>{service.service_code}</small>
                  </span>
                  <span>
                    <span className={`risk-pill risk-${getRisk(service).toLowerCase()}`}>
                        {getRisk(service)}
                    </span>
                    </span>

                    <span>
                    {service.qualified_people_count || 0} / min {service.min_qualified || "–"}
                    </span>

                    <span>{service.fully_people_count || 0}</span>

                    <span>{getGap(service)}</span>

                    <span>
                    <span className={`spof-pill ${getSpof(service) ? "spof-yes" : "spof-no"}`}>
                        {getSpof(service) ? "YES" : "NO"}
                    </span>
                    </span>

                    <span>
                    <div className="maturity-cell">
                        <div className="maturity-bar">
                        <div
                            className="maturity-fill"
                            style={{ width: `${service.coverage_percent || 0}%` }}
                        />
                        </div>
                        <small>{service.coverage_percent || 0}%</small>
                    </div>
                 </span>

                    <span>{getActionsCount(service)}</span>
                  <span className="row-buttons">
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            const data = await getServiceDrilldown(service.id);
                            setSelected(data);
                            setDrilldownOpen(true);
                        }}
                    >
                        Vis
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(service);
                      }}
                    >
                      Rediger
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

       {drilldownOpen && selected && (
            <aside className="service-drawer">
                <div className="drilldown-head">
                <div>
                    <h2>Service drilldown</h2>
                    <p>Explainable risk for {selected.name}</p>
                </div>

                <button onClick={() => setDrilldownOpen(false)}>×</button>
                </div>

                <div className="drill-card">
                <h3>{selected.name}</h3>
                <p>
                    {selected.service_code} · Crit {selected.criticality || "–"} · Owner{" "}
                    {selected.owner_name || selected.owner_team || "Ikke satt"}
                </p>
                </div>

                <div className="drill-chips">
                <span>Risk: {getRisk(selected)}</span>
                <span>Qualified: {selected.qualified_people_count || 0}</span>
                <span>Fully: {selected.fully_people_count || 0}</span>
                <span>Gap: {getGap(selected)}</span>
                <span>SPOF: {getSpof(selected) ? "YES" : "NO"}</span>
                </div>

                <div className="drill-maturity">
                <p>Maturity</p>
                <div className="maturity-bar wide">
                    <div
                    className="maturity-fill"
                    style={{ width: `${selected.coverage_percent || 0}%` }}
                    />
                </div>
                </div>

                <div className="drill-card">
                    <h3>Required systems</h3>

                    {selected.systems?.length ? (
                        selected.systems.map((system, index) => (
                        <p key={index}>
                            {system.system_code || ""} {system.system_code ? "—" : ""} {system.name}
                        </p>
                        ))
                    ) : (
                        <p>No required systems</p>
                    )}
                </div>

                <div className="drill-card">
                    <h3>Coverage breakdown</h3>

                    {selected.people?.length ? (
                        selected.people.map((person, index) => (
                        <p key={index}>
                            {person.name} — score {person.score} • {person.status}
                        </p>
                        ))
                    ) : (
                        <p>No people found</p>
                    )}
                </div>

                <button className="drill-edit" onClick={() => openEdit(selected)}>
                Rediger tjeneste
                </button>
            </aside>
            )}

      {modalOpen && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={saveService}>
            <div className="modal-head">
              <div>
                <h2>{editing ? "Rediger service" : "Ny service"}</h2>
                <p>Service code lages automatisk og kan ikke endres</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div className="form-grid">
              <label>
                Service code
                <input value={form.service_code} readOnly className="readonly-input" />
              </label>

              <label>
                Service name
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value, service_name: e.target.value })
                  }
                  required
                />
              </label>

              <label>
                Category
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="Managed Service">Managed Service</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Security">Security</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Application Management">Application Management</option>
                  <option value="Network as a Service">Network as a Service</option>
                  <option value="M365 Consultant">M365 Consultant</option>
                </select>
              </label>

              <label>
                Owner team
                <input
                  value={form.owner_team}
                  onChange={(e) => setForm({ ...form, owner_team: e.target.value })}
                  placeholder="Ikke satt"
                />
              </label>

              <label>
                Criticality
                <select
                  value={form.criticality}
                  onChange={(e) => setForm({ ...form, criticality: e.target.value })}
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </label>

              <label>
                Active
                <select
                  value={String(form.active)}
                  onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </label>

              <label className="wide">
                Description
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Ingen beskrivelse"
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
    </div>
  );
}
