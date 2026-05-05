import { useEffect, useMemo, useState } from "react";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from "../services/employeeService";

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

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!selected?.id) {
      setDetails(null);
      return;
    }

    getEmployeeById(selected.id)
      .then(setDetails)
      .catch(() => setDetails(null));
  }, [selected]);

  async function loadEmployees() {
    try {
      setLoading(true);
      setError("");
      const data = await getEmployees();
      setEmployees(data);
      setSelected((current) => current || data[0] || null);
    } catch (err) {
      setError(err.message || "Could not load employees");
    } finally {
      setLoading(false);
    }
  }

  const departments = useMemo(() => {
    return ["all", ...new Set(employees.map((e) => e.department).filter(Boolean))];
  }, [employees]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return employees.filter((e) => {
      const matchesSearch =
        !q ||
        e.full_name?.toLowerCase().includes(q) ||
        e.employee_code?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.role_title?.toLowerCase().includes(q);

      const matchesDepartment = department === "all" || e.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  const nextEmployeeCode = useMemo(() => {
    const max = employees.reduce((highest, e) => {
      const number = Number(String(e.employee_code || "").replace(/\D/g, ""));
      return Number.isFinite(number) && number > highest ? number : highest;
    }, 0);

    return `EMP${String(max + 1).padStart(3, "0")}`;
  }, [employees]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm, employee_code: nextEmployeeCode });
    setModalOpen(true);
  }

  function openEdit(employee) {
    setEditing(employee);
    setForm({
      employee_code: employee.employee_code || "",
      full_name: employee.full_name || "",
      email: employee.email || "",
      role_title: employee.role_title || "",
      department: employee.department || "",
      location: employee.location || "",
      availability_percent: employee.availability_percent ?? 100,
      active: employee.active ?? true,
      notes: employee.notes || "",
    });
    setModalOpen(true);
  }

  async function saveEmployee(event) {
    event.preventDefault();

    const payload = {
      ...form,
      availability_percent: Number(form.availability_percent),
      active: Boolean(form.active),
    };

    try {
      if (editing) {
        await updateEmployee(editing.id, payload);
      } else {
        await createEmployee(payload);
      }

      setModalOpen(false);
      await loadEmployees();
    } catch (err) {
      alert(err.message || "Could not save employee");
    }
  }

  async function handleDeactivate(employee) {
    const confirmed = window.confirm(`Deactivate ${employee.full_name}?`);
    if (!confirmed) return;

    try {
      await deactivateEmployee(employee.id);
      await loadEmployees();
    } catch (err) {
      alert(err.message || "Could not deactivate employee");
    }
  }

  const spotlight = details || selected;

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

        {["Oversikt", "Services", "People", "Systems", "Coverage Matrix", "Actions & Reviews", "Data Editor", "Datakvalitet", "Audit-logg"].map((item) => (
          <button key={item} className={`nav-link ${item === "People" ? "active" : ""}`}>
            <span>{item}</span>
            <small>{item === "Oversikt" ? "Default" : "View"}</small>
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
          <p>1) Direkte .xlsx-import i browser<br />2) Import-wizard med preview og validering<br />3) Bulk edit for qualifications/access<br />4) Audit-logg<br />5) CSV-eksport per datasett</p>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>People</h1>
            <p>Ansatte, kapasitet og access-gaps</p>
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
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep === "all" ? "Alle avdelinger" : dep}
              </option>
            ))}
          </select>

          <div>
            <button className="blue" onClick={openCreate}>Ny ansatt</button>
            <button>Ny qualification</button>
            <button>Ny access</button>
          </div>
        </div>

        <section className="content-grid">
          <div className="panel table-panel">
            <div className="panel-head">
              <h3>Ansatte og kapasitet</h3>
              <p>Hvor mye reell tjenestedekning hver person gir</p>
            </div>

            {loading && <p className="status">Loading employees...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
              <div className="people-table">
                <div className="table-header">
                  <span>Ansatt</span>
                  <span>Avd.</span>
                  <span>Avail</span>
                  <span>Qualified</span>
                  <span>Fully</span>
                  <span>Expert</span>
                  <span>Access gaps</span>
                  <span></span>
                </div>

                {filtered.map((employee) => (
                  <div
                    key={employee.id}
                    className={`table-row ${selected?.id === employee.id ? "selected" : ""}`}
                    onClick={() => setSelected(employee)}
                  >
                    <span>
                      <strong>{employee.full_name}</strong>
                      <small>{employee.employee_code}</small>
                    </span>
                    <span>{employee.department || "–"}</span>
                    <span>{employee.availability_percent ?? 100}%</span>
                    <span>{employee.qualified_count ?? 0}</span>
                    <span>{employee.fully_count ?? 0}</span>
                    <span>{employee.expert_count ?? 0}</span>
                    <span>{employee.access_gap_count ?? 0}</span>
                    <span className="row-buttons">
                      <button onClick={(e) => { e.stopPropagation(); setSelected(employee); }}>Vis</button>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(employee); }}>Rediger</button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="panel spotlight">
            <div className="panel-head">
              <h3>People spotlight</h3>
              <p>Hvem kan mest, og hvor er hullene</p>
            </div>

            {spotlight ? (
              <>
                <div className="spotlight-box">
                  <h4>{spotlight.full_name}</h4>
                  <p>{spotlight.employee_code} · {spotlight.department || "No department"} · Availability {spotlight.availability_percent ?? 100}%</p>
                </div>

                <div className="chips">
                  <span>Qualified services: {spotlight.qualified_count ?? 0}</span>
                  <span>Fully capable: {spotlight.fully_count ?? 0}</span>
                  <span>Expert footprint: {spotlight.expert_count ?? 0}</span>
                  <span>Access gaps: {spotlight.access_gap_count ?? 0}</span>
                </div>

                <p className="small-text">
                  Sterkeste tjenestetilknytninger:<br />
                  · {spotlight.role_title || "Role not set"} — score {spotlight.availability_percent ?? 100}
                </p>

                <div className="spotlight-actions">
                  <button className="blue">Åpne drilldown</button>
                  <button onClick={() => openEdit(spotlight)}>Rediger</button>
                  <button>Ny qualification</button>
                </div>

                <button className="danger" onClick={() => handleDeactivate(spotlight)}>
                  Deaktiver ansatt
                </button>
              </>
            ) : (
              <p className="status">Velg en ansatt</p>
            )}
          </aside>
        </section>
      </main>

      {modalOpen && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={saveEmployee}>
            <div className="modal-head">
              <div>
                <h2>{editing ? "Rediger ansatt" : "Ny ansatt"}</h2>
                <p>Legg inn eller endre informasjon om personen</p>
              </div>
              <button type="button" onClick={() => setModalOpen(false)}>×</button>
            </div>

            <div className="form-grid">
              <label>
                Employee code
                <input
                  value={form.employee_code}
                  readOnly
                  className="readonly-input"
                />
              </label>
              <label>Full name<input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
              <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
              <label>Role<input value={form.role_title} onChange={(e) => setForm({ ...form, role_title: e.target.value })} /></label>
              <label>
                Department
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  required
                >
                  <option value="">Velg department</option>
                  {departments
                    .filter((dep) => dep !== "all")
                    .map((dep) => (
                      <option key={dep} value={dep}>
                        {dep}
                      </option>
                    ))}
                </select>
              </label>
              <label>Location<input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
              <label>Availability %<input type="number" min="0" max="100" value={form.availability_percent} onChange={(e) => setForm({ ...form, availability_percent: e.target.value })} /></label>
              <label>Active<select value={String(form.active)} onChange={(e) => setForm({ ...form, active: e.target.value === "true" })}><option value="true">Active</option><option value="false">Inactive</option></select></label>
              <label className="wide">Notes<input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></label>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="blue">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
