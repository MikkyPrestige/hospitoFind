import { useState } from "react";
import axios from "axios";
import style from "./style/shareExport/shareExport.module.css";
import { TiExport } from "react-icons/ti";

const BASE_URL = "https://carefinder.azurewebsites.net";

const ExportButton = ({ searchParams }: any) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleExport = async () => {
    try {
      setExporting(true);
      const { data } = await axios.get(`${BASE_URL}/hospitals/export`, {
        responseType: "blob",
        params: searchParams
      });
      if (!searchParams.city && !searchParams.state) {
        setError('Please enter a city or state');
        setExporting(false)
        return
      }
      // download file
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "hospitals.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setError("")
      setExporting(false);
    } catch (err: any) {
      setError(err.message);
      setExporting(false);
    }
  };

  return (
    <div className={style.cta}>
      <button disabled={exporting} onClick={handleExport} className={style.btn}>
        {exporting ? <div>Exporting...</div> : <TiExport className={style.icon} />}
        Export
      </button>
      {error && <p className={style.error}>{error}</p>}
    </div>
  );
}

export default ExportButton;