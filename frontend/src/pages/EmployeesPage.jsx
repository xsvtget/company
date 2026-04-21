import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import EmployeeStats from "../components/employees/EmployeeStats";
import EmployeeTable from "../components/employees/EmployeeTable";
import EmployeeSpotlight from "../components/employees/EmployeeSpotlight";
import EmployeeFormModal from "../components/employees/EmployeeFormModal";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deactivateEmployee,
} from "../services/employeeService";
import "../styles/employees.css";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [selected, setSelected] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selected?.id) {
      loadEmployeeDetails(selected.id);
    } else {
      setSelectedDetails(null);
    }
  }, [selected]);

  async function loadEmployees() {
    try {
      setLoading(true);
      setError("");
      const data = await getEmployees();
      setEmployees(data);

      if (data.length > 0 && !selected) {
        setSelected(data[0]);
      }
    } catch (err) {
      setError(err.message || "Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  async function loadEmployeeDetails(id) {
    try {
      const data = await getEmployeeById(id);
      setSelectedDetails(data);
    } catch (err) {
      console.error(err);
    }
  }

  const departments = useMemo(
    () => ["all", ...new Set(employees.map((e) => e.department).filter(Boolean))],
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const q = search.toLowerCase().trim();

      const matchesSearch =
        employee.full_name?.toLowerCase().includes(q) ||
        employee.employee_code?.toLowerCase().includes(q) ||
        employee.email?.toLowerCase().includes(q) ||
        employee.role_title?.toLowerCase().includes(q) ||
        employee.location?.toLowerCase().includes(q);

      const matchesDepartment =
        department === "all" || employee.department === department;

      return matchesSearch && matchesDepartment;
    });
  }, [employees, search, department]);

  function openCreateModal() {
    setModalMode("create");
    setEditingEmployee(null);
    setModalOpen(true);
  }

  function openEditModal(employee) {
    setModalMode("edit");
    setEditingEmployee(employee);
    setModalOpen(true);
  }

  async function handleSave(formData) {
    try {
      if (modalMode === "edit" && editingEmployee) {
        await updateEmployee(editingEmployee.id, {
          full_name: formData.full_name,
          email: formData.email,
          role_title: formData.role_title,
          department: formData.department,
          location: formData.location,
          availability_percent: Number(formData.availability_percent),
          active: formData.active,
          notes: formData.notes,
        });
      } else {
        await createEmployee({
          employee_code: formData.employee_code,
          full_name: formData.full_name,
          email: formData.email,
          role_title: formData.role_title,
          department: formData.department,
          location: formData.location,
          availability_percent: Number(formData.availability_percent),
          active: formData.active,
          notes: formData.notes,
        });
      }

      setModalOpen(false);
      setEditingEmployee(null);
      await loadEmployees();
    } catch (err) {
      alert(err.message || "Save failed");
    }
  }

  async function handleDeactivate(employee) {
    const confirmed = window.confirm(
      `Deactivate ${employee.full_name}?`
    );

    if (!confirmed) return;

    try {
      await deactivateEmployee(employee.id);
      await loadEmployees();

      if (selected?.id === employee.id) {
        setSelected(null);
        setSelectedDetails(null);
      }
    } catch (err) {
      alert(err.message || "Failed to deactivate employee");
    }
  }
  const nextEmployeeCode = useMemo(() => {
    const maxNumber = employees.reduce((max, employee) => {
      const match = String(employee.employee_code || "").match(/\d+/);
      const number = match ? Number(match[0]) : 0;
      return number > max ? number : max;
    }, 0);

    return `EMP${String(maxNumber + 1).padStart(3, "0")}`;
  }, [employees]);
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

      {loading && <p>Loading employees...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <section className="content-grid">
          <EmployeeTable
            employees={filteredEmployees}
            selectedEmployeeId={selected?.id}
            onSelect={setSelected}
            onEdit={openEditModal}
            onDeactivate={handleDeactivate}
          />

          <EmployeeSpotlight employee={selectedDetails || selected} />
        </section>
      )}

      <EmployeeFormModal
        open={modalOpen}
        mode={modalMode}
        employee={editingEmployee}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        nextEmployeeCode={nextEmployeeCode}
      />
    </AppShell>
  );
}