import { shareHospital } from '@/services/api';
import { SearchProps } from '@/src/types/hospital';
import { useState, useEffect } from 'react';
import style from './styles/scss/shareExport/shareExport.module.scss';
import { CgShare, CgCopy, CgClose } from 'react-icons/cg';
import Motion from "@/components/ui/Motion";
import { fadeUp } from "@/utils/animations";
import { AnimatePresence } from "framer-motion";

const ShareButton = ({ searchParams }: SearchProps) => {
  const [shareableLink, setShareableLink] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // useEffect(() => {
  //   let timer: NodeJS.Timeout;
  //   if (shareableLink) {
  //     timer = setTimeout(() => setShareableLink(''), 15000);
  //   }
  //   return () => clearTimeout(timer);
  // }, [shareableLink]);

  const handleShare = async () => {
    if (!searchParams.city && !searchParams.state) {
      setToast({ message: 'Please select a location first', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setGenerating(true);
    try {
      const linkId = await shareHospital(searchParams);
      setShareableLink(linkId);
      setToast({ message: 'Link generated successfully', type: 'success' });
    } catch (error) {
      setToast({ message: 'Failed to generate link', type: 'error' });
    } finally {
      setGenerating(false);
      setTimeout(() => setToast(null), 3000);
    }
  };
  // const handleShare = async () => {
  //   const { city, state, address } = searchParams;
  //   if (!city && !state && !address) {
  //     setToast({ message: '⚠️ Select a location first', type: 'error' });
  //     return;
  //   }

  //   setGenerating(true);

  //   try {
  //     const linkId = await shareHospital(searchParams);

  //     if (typeof linkId !== 'string') {
  //       throw new Error("Invalid ID received");
  //     }

  //     setShareableLink(linkId);
  //     setToast({ message: '✅ Link generated!', type: 'success' });

  //   } catch (error) {
  //     setToast({ message: '❌ Link generation failed', type: 'error' });
  //   } finally {
  //     setGenerating(false);
  //     setTimeout(() => setToast(null), 4000);
  //   }
  // };

  const handleCopyLink = async () => {
    const fullPath = `${window.location.origin}/hospitals/share/${shareableLink}`;
    await navigator.clipboard.writeText(fullPath);
    setCopied(true);
    setToast({ message: 'Link copied to clipboard', type: 'success' });

    setTimeout(() => {
      setCopied(false);
      setShareableLink('');
    }, 2000);
  };
  // const handleCopyLink = async () => {
  //   try {
  //     const fullPath = `${window.location.origin}/hospitals/share/${shareableLink}`;
  //     await navigator.clipboard.writeText(fullPath);
  //     setCopied(true);
  //     setToast({ message: '📋 Link copied to clipboard!', type: 'success' });

  //     setTimeout(() => {
  //       setCopied(false);
  //       setShareableLink('');
  //       setToast(null);
  //     }, 2500);
  //   } catch {
  //     setToast({ message: '❌ Failed to copy link', type: 'error' });
  //   }
  // };

  return (
    <div className={style.cta}>
      <button
        onClick={handleShare}
        disabled={generating}
        className={`${style.btn} ${style.share}`}
      >
        <span className={style.span}>
          {generating ? 'Processing...' : 'Share Search'}
          <CgShare className={style.icon} />
        </span>
      </button>

      <AnimatePresence>
        {shareableLink && (
          <Motion variants={fadeUp} className={style.btnLink}>
            <div className={style.linkWrapper}>
              <button onClick={handleCopyLink} className={style.link}>
                <span>{copied ? 'Copied to clipboard!' : `ID: ${shareableLink.slice(0, 8)}...`}</span>
                <CgCopy />
              </button>
              <button onClick={() => setShareableLink('')} className={style.clearBtn}>
                <CgClose />
              </button>
            </div>
          </Motion>
        )}
      </AnimatePresence>

      {toast && (
        <Motion variants={fadeUp} className={`${style.toast} ${style[toast.type]}`}>
          {toast.message}
        </Motion>
      )}
    </div>
    // <div className={style.cta}>
    //   <button
    //     type="button"
    //     onClick={handleShare}
    //     disabled={generating}
    //     className={`${style.btn} ${style.share}`}
    //   >
    //     {generating ? (
    //       <span>Generating...</span>
    //     ) : (
    //       <span className={style.span}>
    //         Generate Link <CgShare className={style.icon} />
    //       </span>
    //     )}
    //   </button>

    //   <AnimatePresence>
    //     {shareableLink && (
    //       <Motion variants={fadeUp} className={style.btnLink}>
    //         <div className={style.linkWrapper}>
    //           <button onClick={handleCopyLink} className={style.link}>
    //             {copied ? 'Copied!' : `${shareableLink.substring(0, 15)}...`}
    //             <CgCopy className={style.copyIcon} />
    //           </button>
    //           <button onClick={() => setShareableLink('')} className={style.clearBtn}>
    //             <CgClose />
    //           </button>
    //         </div>
    //       </Motion>
    //     )}
    //   </AnimatePresence>

    //   {toast && <div className={`${style.toast} ${style[toast.type]}`}>{toast.message}</div>}
    // </div>
  );
};

export default ShareButton;