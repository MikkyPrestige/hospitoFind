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


// import React from "react";
// import ReactDOM from "react-dom/client";
// import { HelmetProvider } from "react-helmet-async";
// import { ContextProvider } from "./context/userContext";
// import { RouterProvider } from "react-router-dom";
// import { router } from "./routes/router";
// import AuthProvider from "@/config/auth0";
// import "@/assets/styles/index.css";

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <HelmetProvider>
//       <AuthProvider>
//         <ContextProvider>
//           <RouterProvider router={router} />
//         </ContextProvider>
//       </AuthProvider>
//     </HelmetProvider>
//   </React.StrictMode>
// );
