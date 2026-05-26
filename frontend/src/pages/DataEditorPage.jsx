import { useEffect, useMemo, useState } from "react";
import "../styles/dataEditor.css";

const API = "http://localhost:3001/api";

const DATASETS = {
  services: {
    label: "Tjenester",
    addLabel: "Legg til i tjenester",
    endpoint: "/services",
    idField: "id",
    columns: [
      { key: "service_code", label: "Service ID" },
      { key: "name", label: "Navn" },
      { key: "owner_name", label: "Owner" },
      { key: "criticality", label: "Criticality" },
      { key: "min_qualified", label: "Minimum qualified", type: "number" },
      { key: "preferred_qualified", label: "Preferred qualified", type: "number" }
    ]
  },

  employees: {
    label: "Ansatte",
    addLabel: "Legg til i ansatte",
    endpoint: "/employees",
    idField: "id",
    columns: [
      { key: "employee_code", label: "Employee ID" },
      { key: "full_name", label: "Navn" },
      { key: "role_title", label: "Rolle" },
      { key: "department", label: "Avdeling" },
      { key: "location", label: "Lokasjon" },
      { key: "availability_percent", label: "Availability %", type: "number" }
    ]
  },

  systems: {
    label: "Systemer",
    addLabel: "Legg til i systemer",
    endpoint: "/systems",
    idField: "id",
    columns: [
      { key: "system_code", label: "System ID" },
      { key: "name", label: "Navn" },
      { key: "environment", label: "Environment", type: "select", options: ["Prod", "Test", "Dev"] },
      { key: "legacy_owner", label: "Legacy owner" },
      { key: "type", label: "Type", type: "select", options: ["System", "Application", "Platform"] },
      { key: "sensitivity", label: "Sensitivity", type: "select", options: ["Internal", "Confidential", "Public"] },
      { key: "business_owner", label: "Business owner" },
      { key: "technical_owner", label: "Technical owner" },
      {
        key: "admin_owner",
        label: "Admin owner",
        type: "select",
        options: employees.map(
            e => `${e.employee_code} - ${e.full_name}`
        )
        }
    ]
  },

  "required-systems": {
    label: "Required systems",
    addLabel: "Legg til i required systems",
    endpoint: "/service-required-systems",
    idField: "id",
    columns: [
        { key: "service_id", label: "Service", type: "service" },
        { key: "system_id", label: "System", type: "system" },
        { key: "display_order", label: "Order", type: "number" }
    ]
  },

  qualifications: {
    label: "Qualifications",
    addLabel: "Legg til i qualifications",
    endpoint: "/qualifications",
    idField: "id",
    columns: [
      { key: "employee_id", label: "Employee", type: "employee" },
      { key: "system_id", label: "System", type: "system" },
      { key: "experience_score", label: "Experience", type: "number" },
      {
        key: "certification_points",
        label: "Certification",
        type: "select",
        options: ["None", "Associate", "Advanced", "Expert"]
        },
      { key: "knowledge_score", label: "Knowledge", type: "number" },
      { key: "entry_date", label: "Entry date", type: "date" },
      { key: "review_due_date", label: "Review due", type: "date" },
      { key: "reviewed_on", label: "Reviewed on", type: "date", readonly: true },
    ]
  },

  access: {
    label: "Access",
    addLabel: "Legg til i access",
    endpoint: "/access",
    idField: "id",
    columns: [
      { key: "employee_id", label: "Employee", type: "employee" },
      { key: "system_id", label: "System", type: "system" },
      { key: "access_type", label: "Access type", type: "select", options: ["Tom", "User", "Admin"] },
      { key: "requested", label: "Requested", type: "select", options: ["Tom", "User", "Admin"] }
    ]
  },

  actions: {
    label: "Actions",
    addLabel: "Legg til i actions",
    endpoint: "/actions",
    idField: "id",
    columns: [
      { key: "action_code", label: "Action ID" },
      { key: "service_id", label: "Service", type: "service" },
      { key: "title", label: "Tittel" },
      { key: "owner_id", label: "Owner", type: "employee" },
      { key: "due_date", label: "Forfall", type: "date" },
      { key: "status", label: "Status", type: "select", options: ["Planned", "In progress", "Done"] },
      { key: "notes", label: "Notat", type: "textarea" }
    ]
  }
};

export default function DataEditorPage() {
  const [active, setActive] = useState("services");
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(false);

  const config = DATASETS[active];

  useEffect(() => {
    loadLookups();
  }, []);

  useEffect(() => {
    loadRows();
  }, [active]);

  async function loadLookups() {
    try {
      const [s, e, sys] = await Promise.all([
        fetch(`${API}/services`).then((r) => r.json()).catch(() => []),
        fetch(`${API}/employees`).then((r) => r.json()).catch(() => []),
        fetch(`${API}/systems`).then((r) => r.json()).catch(() => [])
      ]);

      setServices(Array.isArray(s) ? s : []);
      setEmployees(Array.isArray(e) ? e : []);
      setSystems(Array.isArray(sys) ? sys : []);
    } catch {
      // fallback empty
    }
  }

  async function loadRows() {
    setLoading(true);
    try {
      const res = await fetch(`${API}${config.endpoint}`);
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  function updateCell(index, key, value) {
    setRows((current) =>
      current.map((row, i) =>
        i === index ? { ...row, [key]: value, __dirty: true } : row
      )
    );
  }

  function addRow() {
    const empty = { __isNew: true, __dirty: true };

    config.columns.forEach((col) => {
      empty[col.key] = "";
    });

    setRows((current) => [empty, ...current]);
  }

  async function saveRow(row) {
    const payload = { ...row };
    delete payload.__isNew;
    delete payload.__dirty;

    const id = row[config.idField];

    const url = row.__isNew
      ? `${API}${config.endpoint}`
      : `${API}${config.endpoint}/${id}`;

    const method = row.__isNew ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Could not save row");
      }

      await loadRows();
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteRow(row) {
    if (!confirm("Slette denne raden?")) return;

    if (row.__isNew) {
      setRows((current) => current.filter((r) => r !== row));
      return;
    }

    try {
      const res = await fetch(`${API}${config.endpoint}/${row[config.idField]}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Could not delete row");

      await loadRows();
    } catch (err) {
      alert(err.message);
    }
  }

  function exportCsv() {
    const headers = config.columns.map((c) => c.label).join(",");
    const body = filteredRows
      .map((row) =>
        config.columns
          .map((c) => `"${String(row[c.key] ?? "").replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([headers + "\n" + body], {
      type: "text/csv;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "").toLowerCase().includes(q)
      )
    );
  }, [rows, search]);

  function renderInput(row, rowIndex, col) {
    const value = row[col.key] ?? "";

    if (col.type === "service") {
      return (
        <select value={value} onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}>
          <option value="">Velg service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.service_code || s.id} — {s.name}
            </option>
          ))}
        </select>
      );
    }

    if (col.type === "employee") {
      return (
        <select value={value} onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}>
          <option value="">Velg ansatt</option>
          {employees.map((e) => (
            <option key={e.id} value={e.id}>
              {e.employee_code || e.id} — {e.full_name || e.name}
            </option>
          ))}
        </select>
      );
    }

    if (col.type === "system") {
      return (
        <select value={value} onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}>
          <option value="">Velg system</option>
          {systems.map((s) => (
            <option key={s.id} value={s.id}>
              {s.system_code || s.id} — {s.name}
            </option>
          ))}
        </select>
      );
    }

    if (col.type === "select") {
      return (
        <select value={value} onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}>
          {col.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (col.type === "textarea") {
      return (
        <textarea
          value={value}
          onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
        />
      );
    }

    return (
      <input
        type={col.type || "text"}
        value={value}
        onChange={(e) => updateCell(rowIndex, col.key, e.target.value)}
      />
    );
  }

  return (
    <div className="de-shell">
      <aside className="de-sidebar">
        <div className="de-logo">
          <span>EP</span>
          <div>
            <strong>Competence & Risk Workbench</strong>
            <small>v2.3 · editable · import wizard · bulk edit</small>
          </div>
        </div>

        <p className="de-section-title">HOVEDFLATER</p>

        {[
          ["Oversikt", "overview"],
          ["Services", "services"],
          ["People", "people"],
          ["Systems", "systems"],
          ["Coverage Matrix", "matrix"],
          ["Actions & Reviews", "actions-review"],
          ["Data Editor", "data-editor"],
          ["Datakvalitet", "quality"],
          ["Audit-logg", "audit"]
        ].map(([label, hash]) => (
          <a
            key={hash}
            className={hash === "data-editor" ? "active" : ""}
            href={`#/${hash}`}
          >
            <span>{label}</span>
            <small>{hash === "overview" ? "Default" : "View"}</small>
          </a>
        ))}

        <div className="de-info-card">
          <h4>RUNTIME</h4>
          <p>
            Denne versjonen kombinerer moderne GUI, explainable risk,
            inline-redigering, relasjonsoppdatering, audit-logg og bulk-redigering.
          </p>
          <button>Eksporter JSON</button>
          <button className="secondary">Importer JSON</button>
          <button className="warning">Reset til seed</button>
        </div>

        <div className="de-info-card">
          <h4>NYHETER I V2.3</h4>
          <p>
            1) Direkte xlsx-import i browser<br />
            2) Import-wizard med preview<br />
            3) Bulk edit for qualifications/access<br />
            4) Audit-logg<br />
            5) CSV-eksport per datasett<br />
            6) Employee-spesifikke Excel-maler
          </p>
        </div>
      </aside>

      <main className="de-main">
        <header className="de-topbar">
          <div>
            <h1>Data Editor</h1>
            <p>Inline-redigering av masterdata og relasjoner</p>
          </div>

          <div className="de-top-actions">
            <input placeholder="Søk på ansatte, tjenester, systemer" />
            <button>Datakvalitet</button>
            <button>Audit-logg</button>
            <button className="primary">Data Editor</button>
          </div>
        </header>

        <section className="de-card">
          <div className="de-card-head">
            <div>
              <h2>Data Editor</h2>
              <p>Inline-redigering, validering, CSV/xlsx-import og bulk edit</p>
            </div>
          </div>

          <div className="de-tabs">
            {Object.entries(DATASETS).map(([key, item]) => (
              <button
                key={key}
                className={active === key ? "active" : ""}
                onClick={() => setActive(key)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {(active === "qualifications" || active === "access") && (
            <div className="de-bulkbar">
              <button>Bulk edit for {active}</button>
              <button>Velg alle synlige</button>
              <button>Fjern valg</button>
              <select>
                <option>{active === "access" ? "Access type" : "Certification"}</option>
              </select>
              <select>
                <option>None</option>
                <option>Associate</option>
                <option>Advanced</option>
                <option>Expert</option>
            </select>
              <button className="primary">Bruk på valgte rader</button>
            </div>
          )}

          <div className="de-toolbar">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Søk i valgt datasett ..."
            />

            <button onClick={exportCsv}>Eksporter CSV</button>

            <button className="primary push-right" onClick={addRow}>
              {config.addLabel}
            </button>
          </div>

          <div className="de-table-wrap">
            <table className="de-table">
              <thead>
                <tr>
                  {(active === "qualifications" || active === "access") && <th className="check-col"></th>}
                  {config.columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={config.columns.length + 2}>Loading...</td>
                  </tr>
                ) : (
                  filteredRows.map((row, index) => (
                    <tr key={row.id || row.__tempId || index}>
                      {(active === "qualifications" || active === "access") && (
                        <td className="check-col">
                          <input type="checkbox" />
                        </td>
                      )}

                      {config.columns.map((col) => (
                        <td key={col.key}>
                          {renderInput(row, index, col)}
                        </td>
                      ))}

                      <td className="de-row-actions">
                        <button className="save" onClick={() => saveRow(row)}>Lagre</button>
                        <button>Modal</button>
                        <button className="delete" onClick={() => deleteRow(row)}>Slett</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}