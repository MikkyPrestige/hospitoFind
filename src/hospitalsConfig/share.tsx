import { shareHospital } from '@/services/api';
import { SearchProps } from '@/services/hospital';
import { useState, useEffect } from 'react';
import style from './style/shareExport/shareExport.module.scss';
import { CgShare, CgCopy, CgClose } from 'react-icons/cg';
import Motion from "@/components/motion";
import { fadeUp } from "@/hooks/animations";
import { AnimatePresence } from "framer-motion";

const ShareButton = ({ searchParams }: SearchProps) => {
  const [shareableLink, setShareableLink] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (shareableLink) {
      timer = setTimeout(() => setShareableLink(''), 15000);
    }
    return () => clearTimeout(timer);
  }, [shareableLink]);

  const handleShare = async () => {
    // 1. Validation
    const { city, state, address } = searchParams;
    if (!city && !state && !address) {
      setToast({ message: '⚠️ Select a location first', type: 'error' });
      return;
    }

    setGenerating(true);

    try {
      const linkId = await shareHospital(searchParams);

      if (typeof linkId !== 'string') {
        throw new Error("Invalid ID received");
      }

      setShareableLink(linkId);
      setToast({ message: '✅ Link generated!', type: 'success' });

    } catch (error) {
      setToast({ message: '❌ Link generation failed', type: 'error' });
    } finally {
      setGenerating(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleCopyLink = async () => {
    try {
      const fullPath = `${window.location.origin}/hospitals/share/${shareableLink}`;
      await navigator.clipboard.writeText(fullPath);
      setCopied(true);
      setToast({ message: '📋 Link copied to clipboard!', type: 'success' });

      setTimeout(() => {
        setCopied(false);
        setShareableLink('');
        setToast(null);
      }, 2500);
    } catch {
      setToast({ message: '❌ Failed to copy link', type: 'error' });
    }
  };

  return (
    <div className={style.cta}>
      <button
        type="button"
        onClick={handleShare}
        disabled={generating}
        className={`${style.btn} ${style.share}`}
      >
        {generating ? (
          <span>Generating...</span>
        ) : (
          <span className={style.span}>
            Generate Link <CgShare className={style.icon} />
          </span>
        )}
      </button>

      <AnimatePresence>
        {shareableLink && (
          <Motion variants={fadeUp} className={style.btnLink}>
            <div className={style.linkWrapper}>
              <button onClick={handleCopyLink} className={style.link}>
                {copied ? 'Copied!' : `${shareableLink.substring(0, 15)}...`}
                <CgCopy className={style.copyIcon} />
              </button>
              <button onClick={() => setShareableLink('')} className={style.clearBtn}>
                <CgClose />
              </button>
            </div>
          </Motion>
        )}
      </AnimatePresence>

      {toast && <div className={`${style.toast} ${style[toast.type]}`}>{toast.message}</div>}
    </div>
  );
};

export default ShareButton;

// import { shareHospital } from '@/services/api'
// import { SearchProps } from '@/services/hospital'
// import { useState, useEffect } from 'react'
// import style from './style/shareExport/shareExport.module.scss'
// import { CgShare, CgCopy, CgClose } from 'react-icons/cg'
// import { AnimatePresence } from 'framer-motion'
// import Motion from "../components/motion";
// import { fadeUp } from "@/hooks/animations";

// const ShareButton = ({ searchParams }: SearchProps) => {
//   const [shareableLink, setShareableLink] = useState<string>('')
//   const [error, setError] = useState<string>('')
//   const [generating, setGenerating] = useState<boolean>(false)
//   const [copied, setCopied] = useState<boolean>(false)
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

//   // CLEANUP LOGIC: Automatically clear link after 10 seconds
//   useEffect(() => {
//     let timer: NodeJS.Timeout;
//     if (shareableLink) {
//       timer = setTimeout(() => {
//         setShareableLink('');
//       }, 10000); // Increased to 10s to give user time to copy
//     }
//     return () => clearTimeout(timer);
//   }, [shareableLink]);

//   const handleShare = async () => {
//     const { city, state, address } = searchParams;
//     if (!city && !state && !address) {
//       setToast({ message: '⚠️ Missing search parameters', type: 'error' });
//       return;
//     }

//     setGenerating(true);
//     try {
//       const res = await shareHospital(searchParams);
//       setShareableLink(res);
//       setError('');
//       setToast({ message: '✅ Link generated!', type: 'success' });
//     } catch (err: any) {
//       setToast({ message: '❌ Generation failed', type: 'error' });
//     } finally {
//       setGenerating(false);
//       setTimeout(() => setToast(null), 3000);
//     }
//   };

//   const handleCopyLink = async () => {
//     try {
//       const fullLink = `${window.location.origin}/hospitals/share/${shareableLink}`;
//       await navigator.clipboard.writeText(fullLink);
//       setCopied(true);
//       setToast({ message: '📋 Copied to clipboard!', type: 'success' });

//       // Auto-clear link immediately after a successful copy
//       setTimeout(() => {
//         setCopied(false);
//         setShareableLink('');
//         setToast(null);
//       }, 2000);
//     } catch {
//       setToast({ message: '❌ Copy failed', type: 'error' });
//     }
//   };

//   return (
//     <div className={style.cta}>
//       <button
//         type="button"
//         onClick={handleShare}
//         disabled={generating}
//         className={`${style.btn} ${style.share}`}
//       >
//         {generating ? (
//           <span>Generating...</span>
//         ) : (
//           <span className={style.span}>
//             Generate Link <CgShare className={style.icon} />
//           </span>
//         )}
//       </button>

//       {/* REFINED LINK VIEW WITH COPY ICON */}
//       <AnimatePresence>
//         {shareableLink && (
//           <Motion
//             variants={fadeUp}
//             className={style.btnLink}
//           >
//             <div className={style.linkWrapper}>
//               <button onClick={handleCopyLink} className={style.link}>
//                 {copied ? 'Copied!' : `${shareableLink.substring(0, 12)}...`}
//                 <CgCopy className={style.copyIcon} />
//               </button>
//               <button
//                 onClick={() => setShareableLink('')}
//                 className={style.clearBtn}
//                 title="Clear link"
//               >
//                 <CgClose />
//               </button>
//             </div>
//           </Motion>
//         )}
//       </AnimatePresence>

//       {toast && <div className={`${style.toast} ${style[toast.type]}`}>{toast.message}</div>}
//     </div>
//   )
// }

// export default ShareButton;