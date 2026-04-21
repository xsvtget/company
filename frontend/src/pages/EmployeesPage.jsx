import { useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import EmployeeStats from "../components/employees/EmployeeStats";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeSpotlight from "../components/employees/EmployeeSpotlight";
import EmployeeFormModal from "../components/employees/EmployeeFormModal";
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
    systems: ["Network Design — score 9", "Cisco — score 9", "Fortigate — score 7"],
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingEmployee, setEditingEmployee] = useState(null);

  const departments = useMemo(
    () => ["all", ...new Set(employees.map((e) => e.department))],
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const q = search.toLowerCase().trim();

      const matchesSearch =
        employee.name.toLowerCase().includes(q) ||
        employee.role.toLowerCase().includes(q) ||
        employee.location.toLowerCase().includes(q) ||
        String(employee.id).includes(q);

      const matchesDepartment =
        department === "all" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  const spotlight =
    filteredEmployees.find((e) => e.id === selected?.id) || filteredEmployees[0] || null;

  function openCreateModal() {
    setModalMode("create");
    setEditingEmployee(null);
    setModalOpen(true);
  }

  function openEditModal(employee) {
    setSelected(employee);
    setModalMode("edit");
    setEditingEmployee(employee);
    setModalOpen(true);
  }

  function handleSave(employeeData) {
    if (modalMode === "edit") {
      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === employeeData.id ? employeeData : employee
        )
      );
      setSelected(employeeData);
    } else {
      setEmployees((prev) => [employeeData, ...prev]);
      setSelected(employeeData);
    }

    setModalOpen(false);
    setEditingEmployee(null);
  }

  return (
    <AppShell>
      <section className="page-header">
        <div>
          <h1>People</h1>
          <p>Ansatte, kapasitet og access-gaps</p>
        </div>

        <div className="header-actions">
          <input
            className="search-input"
            placeholder="Søk på ansatte..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="primary-btn" onClick={openCreateModal}>
            Ny ansatt
          </button>
        </div>
      </section>

      <EmployeeStats employees={employees} />

      <section className="toolbar">
        <select
          className="department-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep === "all" ? "Alle avdelinger" : dep}
            </option>
          ))}
        </select>
      </section>

      <section className="content-grid">
        <EmployeeTable
          employees={filteredEmployees}
          selectedEmployeeId={spotlight?.id}
          onSelect={setSelected}
          onEdit={openEditModal}
        />
        <EmployeeSpotlight employee={spotlight} />
      </section>

      <EmployeeFormModal
        open={modalOpen}
        mode={modalMode}
        employee={editingEmployee}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </AppShell>
  );
}