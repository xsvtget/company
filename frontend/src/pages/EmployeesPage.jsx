import { useMemo, useState } from "react";
import "../styles/employees.css";

const initialEmployees = [
  {
    id: 19,
    name: "Alexander Fløtre Waaland",
    department: "Infra",
    role: "Infrastructure Engineer",
    location: "Stavanger",
    availability: 100,
    qualified: 1,
    fully: 0,
    expert: 0,
    accessGaps: 1,
    serviceFootprint: "Network as a Service — score 7",
    systems: [
      "Network Design — score 9",
      "Cisco — score 9",
      "Fortigate — score 7",
    ],
  },
  {
    id: 8,
    name: "Andreas Thorsen",
    department: "Infra",
    role: "Systems Consultant",
    location: "Bergen",
    availability: 100,
    qualified: 1,
    fully: 0,
    expert: 0,
    accessGaps: 1,
    serviceFootprint: "Identity & Access — score 6",
    systems: ["Active Directory — score 6"],
  },
  {
    id: 4,
    name: "Eskil N. Jakobsen",
    department: "Sales & Marketing",
    role: "Solution Architect",
    location: "Oslo",
    availability: 100,
    qualified: 2,
    fully: 2,
    expert: 2,
    accessGaps: 0,
    serviceFootprint: "Presales Enablement — score 10",
    systems: ["Microsoft 365 — score 10", "Azure — score 9"],
  },
  {
    id: 2,
    name: "Thomas Hemnes Alveskjær",
    department: "OPS",
    role: "Platform Specialist",
    location: "Oslo",
    availability: 70,
    qualified: 6,
    fully: 2,
    expert: 5,
    accessGaps: 4,
    serviceFootprint: "Cloud Operations — score 22",
    systems: ["Azure — score 10", "M365 — score 8", "Veeam — score 4"],
  },
];

export default function EmployeesPage() {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [selected, setSelected] = useState(initialEmployees[0]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(initialEmployees[0]);

  const departments = useMemo(() => {
    return ["all", ...new Set(employees.map((e) => e.department))];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.role.toLowerCase().includes(search.toLowerCase()) ||
        employee.location.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        department === "all" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  const spotlight = selected || filteredEmployees[0] || employees[0];

  const openEditModal = (employee) => {
    setEditData(employee);
    setIsEditOpen(true);
  };

  const saveEdit = () => {
    const updated = employees.map((employee) =>
      employee.id === editData.id ? editData : employee
    );
    setEmployees(updated);
    setSelected(editData);
    setIsEditOpen(false);
  };

  const totalPeople = employees.length;
  const totalQualified = employees.reduce((sum, e) => sum + e.qualified, 0);
  const totalExperts = employees.reduce((sum, e) => sum + e.expert, 0);
  const totalGaps = employees.reduce((sum, e) => sum + e.accessGaps, 0);

  return (
    <div className="employees-page">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">EP</div>
          <div>
            <p className="brand-top">Competence & Risk</p>
            <h2>Workbench</h2>
          </div>
        </div>

        <nav className="nav-menu">
          <button className="nav-item">Oversikt</button>
          <button className="nav-item">Services</button>
          <button className="nav-item active">People</button>
          <button className="nav-item">Systems</button>
        </nav>

        <div className="sidebar-card">
          <h3>Runtime</h3>
          <p>Employees page mockup with search, spotlight and edit modal.</p>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-header">
          <div>
            <h1>People</h1>
            <p>Ансати, капасітет, кваліфікації та access gaps.</p>
          </div>
          <button className="primary-btn">+ New employee</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>People</span>
            <strong>{totalPeople}</strong>
          </div>
          <div className="stat-card">
            <span>Qualified services</span>
            <strong>{totalQualified}</strong>
          </div>
          <div className="stat-card">
            <span>Expert footprints</span>
            <strong>{totalExperts}</strong>
          </div>
          <div className="stat-card">
            <span>Access gaps</span>
            <strong>{totalGaps}</strong>
          </div>
        </div>

        <div className="toolbar">
          <input
            type="text"
            placeholder="Пошук по імені, ролі або локації"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="department-select"
          >
            {departments.map((dep) => (
              <option key={dep} value={dep}>
                {dep === "all" ? "Всі відділи" : dep}
              </option>
            ))}
          </select>
        </div>

        <div className="content-grid">
          <section className="table-card">
            <div className="card-header">
              <h3>Ansatte og kapasitet</h3>
              <p>Краща версія таблиці з spotlight і drilldown.</p>
            </div>

            <div className="employees-table">
              <div className="table-head">
                <div>Ansatt</div>
                <div>Avd.</div>
                <div>Avail</div>
                <div>Qualified</div>
                <div>Fully</div>
                <div>Expert</div>
                <div>Gaps</div>
                <div>Actions</div>
              </div>

              {filteredEmployees.map((employee) => (
                <div
                  key={employee.id}
                  className={`table-row ${
                    spotlight?.id === employee.id ? "selected-row" : ""
                  }`}
                >
                  <div className="employee-main">
                    <button
                      className="employee-name-btn"
                      onClick={() => setSelected(employee)}
                    >
                      <strong>{employee.name}</strong>
                      <span>
                        #{employee.id} • {employee.role}
                      </span>
                    </button>
                  </div>
                  <div>{employee.department}</div>
                  <div>{employee.availability}%</div>
                  <div>{employee.qualified}</div>
                  <div>{employee.fully}</div>
                  <div>{employee.expert}</div>
                  <div>{employee.accessGaps}</div>
                  <div className="row-actions">
                    <button
                      className="secondary-btn small"
                      onClick={() => setSelected(employee)}
                    >
                      View
                    </button>
                    <button
                      className="secondary-btn small"
                      onClick={() => openEditModal(employee)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="spotlight-card">
            <div className="card-header">
              <h3>People spotlight</h3>
              <p>Хто зараз у фокусі і де в нього strongest fit.</p>
            </div>

            <div className="spotlight-box">
              <h4>{spotlight.name}</h4>
              <p>
                #{spotlight.id} • {spotlight.department} • Availability{" "}
                {spotlight.availability}%
              </p>
            </div>

            <div className="pill-row">
              <span className="pill">Qualified: {spotlight.qualified}</span>
              <span className="pill">Fully: {spotlight.fully}</span>
              <span className="pill">Experts: {spotlight.expert}</span>
              <span className="pill">Gaps: {spotlight.accessGaps}</span>
            </div>

            <div className="info-box">
              <h4>Service footprint</h4>
              <p>{spotlight.serviceFootprint}</p>
            </div>

            <div className="info-box">
              <h4>System qualifications</h4>
              <ul>
                {spotlight.systems.map((system) => (
                  <li key={system}>{system}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      <aside className="drilldown-panel">
        <div className="card-header">
          <h3>People drilldown</h3>
          <p>Кваліфікації, service footprint і access profile.</p>
        </div>

        <div className="spotlight-box">
          <h4>{spotlight.name}</h4>
          <p>
            #{spotlight.id} • {spotlight.department} • Availability{" "}
            {spotlight.availability}%
          </p>
        </div>

        <div className="pill-row">
          <span className="pill">Qualified services: {spotlight.qualified}</span>
          <span className="pill">Fully capable: {spotlight.fully}</span>
          <span className="pill">Experts: {spotlight.expert}</span>
          <span className="pill">Access gaps: {spotlight.accessGaps}</span>
        </div>

        <div className="info-box">
          <h4>Service footprint</h4>
          <p>{spotlight.serviceFootprint}</p>
        </div>

        <div className="info-box">
          <h4>System qualifications</h4>
          <ul>
            {spotlight.systems.map((system) => (
              <li key={system}>{system}</li>
            ))}
          </ul>
        </div>
      </aside>

      {isEditOpen && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <div className="modal-header">
              <div>
                <h3>Редагувати працівника</h3>
                <p>Оновити дані працівника.</p>
              </div>
              <button className="close-btn" onClick={() => setIsEditOpen(false)}>
                ✕
              </button>
            </div>

            <div className="modal-grid">
              <div>
                <label>Employee ID</label>
                <input value={editData.id} disabled />
              </div>

              <div>
                <label>Name</label>
                <input
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Role</label>
                <input
                  value={editData.role}
                  onChange={(e) =>
                    setEditData({ ...editData, role: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Department</label>
                <input
                  value={editData.department}
                  onChange={(e) =>
                    setEditData({ ...editData, department: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Location</label>
                <input
                  value={editData.location}
                  onChange={(e) =>
                    setEditData({ ...editData, location: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Availability %</label>
                <input
                  type="number"
                  value={editData.availability}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      availability: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="danger-btn">Delete</button>
              <div className="modal-right-actions">
                <button
                  className="secondary-btn"
                  onClick={() => setIsEditOpen(false)}
                >
                  Cancel
                </button>
                <button className="primary-btn" onClick={saveEdit}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}