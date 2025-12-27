import { useState, useEffect } from 'react';
import { exportHospital } from '@/services/api';
import style from './style/shareExport/shareExport.module.scss';
import { TiExport, TiTick } from 'react-icons/ti'; // Added TiTick for success
import { SearchProps } from '@/services/hospital';
import Motion from '@/components/motion';
import { fadeUp } from '@/hooks/animations';

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
    // Validation: Require search context before allowing export
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

      // Cleanup: Remove link and revoke URL to save memory
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

      {/* Toast Notification */}
      {toast && (
        <Motion variants={fadeUp} className={`${style.toast} ${style[toast.type]}`}>
          {toast.message}
        </Motion>
      )}
    </div>
  );
};

export default ExportButton;

// import { useState } from 'react'
// import { exportHospital } from '@/services/api'
// import style from './style/shareExport/shareExport.module.scss'
// import { TiExport } from 'react-icons/ti'
// import { SearchProps } from '@/services/hospital'

// const ExportButton = ({ searchParams }: SearchProps) => {
//   const [exporting, setExporting] = useState<boolean>(false)
//   const [error, setError] = useState<string>('')
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

//   const handleExport = async () => {
//     if (!searchParams.city && !searchParams.state && !searchParams.address) {
//       setError('Please enter a city, state, and/or hospital name')
//       setToast({ message: 'Missing search parameters', type: 'error' })
//       return
//     }

//     setExporting(true)
//     try {
//       const data = await exportHospital(searchParams)
//       const url = window.URL.createObjectURL(new Blob([data]))
//       const link = document.createElement('a')
//       link.href = url
//       link.setAttribute('download', 'hospitals.csv')
//       document.body.appendChild(link)
//       link.click()
//       document.body.removeChild(link)
//       setToast({ message: '✅ Export successful — file downloaded!', type: 'success' })
//     } catch (err: any) {
//       setError(err.message || 'Failed to export hospitals.')
//       setToast({ message: '❌ Export failed. Try again.', type: 'error' })
//     } finally {
//       setExporting(false)
//       setTimeout(() => setToast(null), 3000)
//     }
//   }

//   return (
//     <div className={style.cta}>
//       <button
//         disabled={exporting}
//         onClick={handleExport}
//         className={`${style.btn} ${style.export}`}
//       >
//         {exporting ? (
//           <div>Download...</div>
//         ) : (
//           <div className={style.span}>
//             Export Hospital List <TiExport className={style.icon} />
//           </div>
//         )}
//       </button>

//       {toast && <div className={`${style.toast} ${style[toast.type]}`}>{toast.message}</div>}
//       {error && <p className={style.error}>{error}</p>}
//     </div>
//   )
// }

// export default ExportButton