import { useState } from 'react';
import { TiExport, TiTick } from 'react-icons/ti';
import { exportHospital } from '@/services/api';
import { SearchProps } from '@/types/hospital';
import Motion from '@/components/ui/Motion';
import { fadeUp } from '@/utils/animations';
import style from './styles/scss/shareExport/shareExport.module.scss';

const ExportButton = ({ searchParams }: SearchProps) => {
  const [exporting, setExporting] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleExport = async () => {
    if (!searchParams.city && !searchParams.state) {
      setToast({ message: 'Perform a search to export data', type: 'error' });
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
      link.download = `Hospitals_${searchParams.city || 'Export'}_${new Date().toLocaleDateString()}.csv`;
      link.click();

      window.URL.revokeObjectURL(url);
      setDownloaded(true);
      setToast({ message: 'Export complete!', type: 'success' });

      setTimeout(() => setDownloaded(false), 4000);
    } catch (err) {
      setToast({ message: 'Export failed. Please try again.', type: 'error' });
    } finally {
      setExporting(false);
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <div className={style.cta}>
      <button
        disabled={exporting}
        onClick={handleExport}
        className={`${style.btn} ${style.export} ${downloaded ? style.successBtn : ''}`}
      >
        <span className={style.span}>
          {exporting ? 'Generating CSV...' : downloaded ? 'Downloaded' : 'Export Results'}
          {downloaded ? <TiTick className={style.icon} /> : <TiExport className={style.icon} />}
        </span>
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