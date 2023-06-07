import { useState } from "react";
import axios from "axios";
import { ExportProps } from "@/services/types";

const BASE_URL = 'http://localhost:5000/hospitals/export'

const ExportButton = ({ searchParams }: ExportProps) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleExport = async () => {
    try {
      setExporting(true);
      const { data } = await axios.get(`${BASE_URL}`, {
        responseType: "blob",
        params: searchParams
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "hospitals.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    } catch (err) {
      setError(err.response.data.message || err.message);
      setExporting(false);
    }
  };

  return (
    <div>
      <button disabled={exporting} onClick={handleExport}>
        {exporting ? 'Exporting...' : 'Export Hospitals'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}

export default ExportButton;