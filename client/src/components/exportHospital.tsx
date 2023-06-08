import { useState } from "react";
import axios from "axios";
import { SearchProps, statesAndCities } from "@/services/types";

const BASE_URL = "http://localhost:5000/hospitals/export"

const ExportButton = ({ searchParams }: SearchProps) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleExport = async () => {
    try {
      setExporting(true);
      const { data } = await axios.get(`${BASE_URL}`, {
        responseType: "blob",
        params: searchParams
      });
      // validate search
      if (!searchParams.city && !searchParams.state) {
        setError('Please enter a city or state');
        setExporting(false)
        return
      } else if (searchParams.city && !statesAndCities.find(
        (name) => name.city === searchParams.city)) {
        setError('Please enter a valid city');
        setExporting(false)
        return
      }
      else if (searchParams.state && !statesAndCities.find(
        (name) => name.state === searchParams.state)) {
        setError('Please enter a valid state');
        setExporting(false)
        return
      }
      else if (searchParams.city && searchParams.state && !statesAndCities.find(
        (name) => name.city === searchParams.city && name.state === searchParams.state)) {
        setError('Please enter a valid city and state');
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
    } catch (err) {
      setError(err.response.data.message || err.message);
      // console.log(err)
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