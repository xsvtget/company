import { useEffect, useMemo, useState } from "react";
import AppShell from "../components/layout/AppShell";
import SystemTable from "../components/systems/SystemTable";
import SystemSpotlight from "../components/systems/SystemSpotlight";
import SystemFormModal from "../components/systems/SystemFormModal";
import "../styles/systems.css";

const API_BASE = "http://localhost:3001/api/systems";

export default function SystemsPage() {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sensitivityFilter, setSensitivityFilter] = useState("");
  const [environmentFilter, setEnvironmentFilter] = useState("");

  const [selectedSystem, setSelectedSystem] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState(null);

  useEffect(() => {
    fetchSystems();
  }, []);

  async function fetchSystems() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error("Не вдалося завантажити systems");
      }

      const data = await response.json();
      setSystems(Array.isArray(data) ? data : []);

      if (Array.isArray(data) && data.length > 0) {
        setSelectedSystem(data[0]);
      } else {
        setSelectedSystem(null);
      }
    } catch (err) {
      setError(err.message || "Помилка завантаження systems");
    } finally {
      setLoading(false);
    }
  }

  const filteredSystems = useMemo(() => {
    return systems.filter((system) => {
      const matchesSearch =
        !search ||
        system.system_name?.toLowerCase().includes(search.toLowerCase()) ||
        system.system_code?.toLowerCase().includes(search.toLowerCase()) ||
        system.biz_owner?.toLowerCase().includes(search.toLowerCase()) ||
        system.tech_owner?.toLowerCase().includes(search.toLowerCase());

      const matchesSensitivity =
        !sensitivityFilter || system.sensitivity === sensitivityFilter;

      const matchesEnvironment =
        !environmentFilter || system.environment === environmentFilter;

      return matchesSearch && matchesSensitivity && matchesEnvironment;
    });
  }, [systems, search, sensitivityFilter, environmentFilter]);

  useEffect(() => {
    if (!selectedSystem && filteredSystems.length > 0) {
      setSelectedSystem(filteredSystems[0]);
    }

    if (
      selectedSystem &&
      !filteredSystems.find((item) => item.id === selectedSystem.id)
    ) {
      setSelectedSystem(filteredSystems[0] || null);
    }
  }, [filteredSystems, selectedSystem]);

  const stats = useMemo(() => {
    const total = systems.length;
    const active = systems.filter((s) => s.active === 1 || s.active === true).length;
    const inactive = systems.filter((s) => s.active === 0 || s.active === false).length;
    const filtered = filteredSystems.length;

    return { total, active, inactive, filtered };
  }, [systems, filteredSystems]);

  function handleView(system) {
    setSelectedSystem(system);
  }

  function handleEdit(system) {
    setEditingSystem(system);
    setIsModalOpen(true);
  }

  function handleCreate() {
    setEditingSystem(null);
    setIsModalOpen(true);
  }

  async function handleDeactivate(system) {
    try {
      const response = await fetch(`${API_BASE}/${system.id}/deactivate`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Не вдалося деактивувати system");
      }

      await fetchSystems();

      if (selectedSystem?.id === system.id) {
        const updated = systems.find((item) => item.id === system.id);
        if (updated) {
          setSelectedSystem({ ...updated, active: 0 });
        }
      }
    } catch (err) {
      alert(err.message || "Помилка деактивації");
    }
  }

  async function handleSave(formData) {
    try {
      const isEdit = Boolean(editingSystem);

      const url = isEdit ? `${API_BASE}/${editingSystem.id}` : API_BASE;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Не вдалося зберегти system");
      }

      setIsModalOpen(false);
      setEditingSystem(null);
      await fetchSystems();
    } catch (err) {
      alert(err.message || "Помилка збереження");
    }
  }

  const sensitivityOptions = [...new Set(systems.map((s) => s.sensitivity).filter(Boolean))];
  const environmentOptions = [...new Set(systems.map((s) => s.environment).filter(Boolean))];

  return (
    <AppShell
      title="Systems"
      subtitle="Assets, eierskap og admin footprint"
    >
      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <input
            type="text"
            className="toolbar-search"
            placeholder="Søk på systemer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={sensitivityFilter}
            onChange={(e) => setSensitivityFilter(e.target.value)}
            className="toolbar-select"
          >
            <option value="">Alle sensitivitetsnivåer</option>
            {sensitivityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={environmentFilter}
            onChange={(e) => setEnvironmentFilter(e.target.value)}
            className="toolbar-select"
          >
            <option value="">Alle environments</option>
            {environmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <button className="primary-button" onClick={handleCreate}>
          Nytt system
        </button>
      </div>

      {loading ? (
        <div className="empty-state-card">Laster systems...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span>SYSTEMS</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="stat-card">
              <span>ACTIVE</span>
              <strong>{stats.active}</strong>
            </div>
            <div className="stat-card">
              <span>INACTIVE</span>
              <strong>{stats.inactive}</strong>
            </div>
            <div className="stat-card">
              <span>FILTERED</span>
              <strong>{stats.filtered}</strong>
            </div>
          </div>

          <div className="content-grid two-columns">
            <SystemTable
              systems={filteredSystems}
              onView={handleView}
              onEdit={handleEdit}
              onDeactivate={handleDeactivate}
            />

            <SystemSpotlight
              system={selectedSystem}
              onEdit={handleEdit}
            />
          </div>
        </>
      )}

      <SystemFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSystem(null);
        }}
        onSave={handleSave}
        system={editingSystem}
      />
    </AppShell>
  );
}