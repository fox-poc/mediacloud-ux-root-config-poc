// pkg
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerApplication, start, getAppNames, addErrorHandler, getAppStatus, LOAD_ERROR } from "single-spa";

import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html?raw";

// app load error handling
addErrorHandler((err) => {
  if (getAppStatus(err.appOrParcelName) === LOAD_ERROR) {
    console.log(err.appOrParcelName)
  }
});

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return import(/* @vite-ignore */ name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

const getUserGroups = () => {
  return ["admin"];
}

applications.forEach((application) =>
  registerApplication({ ...application, customProps: { token: "123", groups: getUserGroups() } })
);
layoutEngine.activate();

if (process.env.NODE_ENV === "development") {
  console.log("APPLICATIONS", getAppNames());
  // enable the single spa import map override panel in dev mode
  localStorage.setItem("imo-ui", "true");
}
start();

createRoot(document.getElementById("root")!).render(
  <StrictMode>{/* INSERT ANY COMPONENTS TO MOUNT HERE */}</StrictMode>
);
