import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import IndexPage from "@/pages/Index";
import NotFound from "@/pages/NotFound";

const router = createBrowserRouter([
  { path: "/", element: <IndexPage /> },
  { path: "*", element: <NotFound /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
