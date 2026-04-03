import { useState, useEffect } from 'react';
import { exportHospital } from '@/services/api';
import style from './styles/scss/shareExport/shareExport.module.scss';
import { TiExport, TiTick } from 'react-icons/ti';
import { SearchProps } from '@/src/types/hospital';
import Motion from '@/components/ui/Motion';
import { fadeUp } from '@/utils/animations';

const ExportButton = ({ searchParams }: SearchProps) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Automatically reset the "Downloaded" success state after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (downloaded) {
      timer = setTimeout(() => setDownloaded(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [downloaded]);

  const handleExport = async () => {
    if (!searchParams.city && !searchParams.state && !searchParams.address) {
      setToast({ message: '⚠️ Please search for hospitals first', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setExporting(true);
    try {
      const data = await exportHospital(searchParams);
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      // Dynamic filename based on date
      link.setAttribute('download', `hospitofind-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();

      // CleanRemove link and revoke URL to save memory
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloaded(true);
      setToast({ message: '✅ CSV Downloaded successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: '❌ Export failed. Try again.', type: 'error' });
    } finally {
      setExporting(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className={style.cta}>
      <button
        disabled={exporting}
        onClick={handleExport}
        className={`${style.btn} ${style.export} ${downloaded ? style.successBtn : ''}`}
      >
        {exporting ? (
          <span className={style.span}>Preparing CSV...</span>
        ) : downloaded ? (
          <span className={style.span}>
            Downloaded <TiTick className={style.icon} />
          </span>
        ) : (
          <span className={style.span}>
            Export Hospital List <TiExport className={style.icon} />
          </span>
        )}
      </button>

      {toast && (
        <Motion variants={fadeUp} className={`${style.toast} ${style[toast.type]}`}>
          {toast.message}
        </Motion>
      )}
    </div>
  );
};

export default ExportButton;