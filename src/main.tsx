import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import "@/assets/styles/index.css";
import { ContextProvider } from "./context/userContext";
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HelmetProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </HelmetProvider>
  </React.StrictMode>
);
