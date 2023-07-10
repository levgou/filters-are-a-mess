import React from "react";
import ReactDOM from "react-dom/client";
import FiltersComponent from "./FiltersComponent.tsx";
import "./index.css";
import { getFilters } from "./api/filters";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FiltersComponent filters={getFilters(100_000_000)} />
  </React.StrictMode>
);
