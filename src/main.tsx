import { createHashRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { I18nProvider } from "./i18n/index";
import App from "./App";
import Dashboard from "./pages/Dashboard";
import EasingEditor from "./pages/EasingEditor";
import Durations from "./pages/Durations";
import Presets from "./pages/Presets";
import ExportPage from "./pages/ExportPage";

const router = createHashRouter([{
  path: "/",
  element: <App />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: "easing", element: <EasingEditor /> },
    { path: "durations", element: <Durations /> },
    { path: "presets", element: <Presets /> },
    { path: "export", element: <ExportPage /> },
  ],
}]);

createRoot(document.getElementById("root")!).render(
  <I18nProvider><RouterProvider router={router} /></I18nProvider>
);
