import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.tsx";
import "@/assets/styles/index.css";
import { ContextProvider } from "./context/userContext";
import { ThemeProvider } from "./context/themeContext"
import { HelmetProvider } from "react-helmet-async";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
    <HelmetProvider>
      <ContextProvider>
        <App />
      </ContextProvider>
    </HelmetProvider>
  </ThemeProvider>
  </React.StrictMode>
);
