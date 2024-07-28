import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./App.css";
import "./index.css";
import BasicPage from "./pages/basic/index.tsx";
import AdvancedPage from "./pages/advanced/index.tsx";
import ScreenSharePage from "./pages/screen-share/index.tsx";
import Index from "./pages/index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/basic",
    element: <BasicPage />,
  },
  {
    path: "/advanced",
    element: <AdvancedPage />,
  },
  {
    path: "/screen-share",
    element: <ScreenSharePage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
