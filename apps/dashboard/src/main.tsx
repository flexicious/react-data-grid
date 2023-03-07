/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import Dashboard from "./app/dashboard/dashboard";
import "@euxdt/grid-core/styles.css";
import "@euxdt/grid-core/icons.css";


const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <Dashboard />
  </StrictMode>
);
