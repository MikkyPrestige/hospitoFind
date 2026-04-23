import { useState } from 'react';
import { AnimatePresence } from "framer-motion";
import { CgShare, CgCopy, CgClose } from 'react-icons/cg';
import { shareHospital } from '@/services/api';
import { SearchProps } from '@/types/hospital';
import Motion from "@/components/ui/Motion";
import { fadeUp } from "@/utils/animations";
import style from './styles/scss/shareExport/shareExport.module.scss';

const ShareButton = ({ searchParams }: SearchProps) => {
  const [shareableLink, setShareableLink] = useState<string>('');
  const [generating, setGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
  );
};

export default ShareButton;