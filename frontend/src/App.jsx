import { useEffect, useState } from "react";

import EmployeesPage from "./pages/EmployeesPage";
import SystemsPage from "./pages/SystemsPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceSystemMappingPage from "./pages/ServiceSystemMappingPage";
import DataEditorPage from "./pages/DataEditorPage";

function getPageFromHash() {
  return window.location.hash.replace("#/", "") || "people";
}

export default function App() {
  const [page, setPage] = useState(getPageFromHash());

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash());

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (page === "services") return <ServicesPage />;
  if (page === "systems") return <SystemsPage />;
  if (page === "mapping") return <ServiceSystemMappingPage />;
  if (page === "data-editor") return <DataEditorPage />;
  if (page === "people") return <EmployeesPage />;

  return <EmployeesPage />;
}