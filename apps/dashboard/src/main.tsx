/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
import Dashboard from "./app/dashboard/dashboard";
import "@ezgrid/grid-core/styles.css";
import "@ezgrid/grid-core/icons.css";
import { GRID_CONSTANTS } from "@ezgrid/grid-core";

GRID_CONSTANTS.LICENSE_KEY="WFaqsGqRX4FWypmH1HHUgQzIPsY3kj+yizJGUEs1J1p7/vK6MT4f3fSL3mKDBoF4fuW7moWu6jXKNU3V8r+mugLjDqVt2k51WY00/hoQvhiKwU7cdFQiTxzGB+dzZoEbm5PlF93DLmjjZVVpPl1UOthP70+owkrLNOCzNJIK796dm3e/wXufYVue8YvZfkrycOiaUFVWzLOpDinRStqfAUCVOKp8drAX86e1bQeeGdUKB+NmUdxrB1tfHfMpbCdAct2+pxJ0ufy4HinCgfdbhDzB8LZtcQ9QvZ+ix2R9g8f3IERP3E6eG2x0ljFSG0Fk8h5SnR4EXk30w+ee9BgAUw==";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StrictMode>
    <Dashboard />
  </StrictMode>
);
