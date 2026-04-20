import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="bottom-right" theme="colored" autoClose={3000} hideProgressBar={false} />
      <Analytics />
    </>
  );
}

export default App;
