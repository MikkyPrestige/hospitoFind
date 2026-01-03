import { useState } from 'react';
import useAxiosPrivate from "@/hooks/user/useAxiosPrivate";
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { Hospital } from '@/services/hospital';
import { Button } from '@/components/button';
import style from './style/editor.module.css';
import { MdOutlineRestartAlt, MdErrorOutline, MdCheckCircleOutline } from 'react-icons/md';
import { useAuthContext } from "@/context/userContext";
import { motion, AnimatePresence } from 'framer-motion';
import { zoomIn } from '@/hooks/animations';

type HospitalSubmission = Omit<Hospital, '_id' | 'slug' | 'longitude' | 'latitude'>;

const INITIAL_TEMPLATE = `
Please verify the hospital information before submitting to help keep our data accurate. Thank you!

# Name:

# Address
- Street:
- City:
- Country:

# Phone:
# Website:
# Email:
# Photo-Url:

# Type:
(Options: Public or Private)

# Services:
(Eg: Dental consultation, Outpatient consultations etc.)

# Comments:

# Hours
- Day: Monday | Open - Close:
- Day: Tuesday | Open - Close:
- Day: Wednesday | Open - Close:
- Day: Thursday | Open - Close:
- Day: Friday | Open - Close:
- Day: Saturday | Open - Close:
- Day: Sunday | Open - Close:
`;

const Editor = () => {
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [markdown, setMarkdown] = useState(INITIAL_TEMPLATE);
  const { state } = useAuthContext();
  const axiosPrivate = useAxiosPrivate();

  const resetTemplate = () => {
    setMarkdown(INITIAL_TEMPLATE);
    setError('');
    setShowSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const getValue = (regex: RegExp) => {
      const match = regex.exec(markdown);
      return match ? match[1].trim() : '';
    };

    const addressMatch = /- Street:\s*([\s\S]*?)\s*- City:\s*([\s\S]*?)\s*- Country:\s*([\s\S]*?)(?=# Phone)/.exec(markdown);
    const country = addressMatch ? addressMatch[3].trim() : '';

    const hospitalData: HospitalSubmission = {
      name: getValue(/# Name:\s*([\s\S]*?)(?=# Address)/),
      address: {
        street: addressMatch ? addressMatch[1].trim() : '',
        city: addressMatch ? addressMatch[2].trim() : '',
        state: country,
        country: country,
      },
      phoneNumber: getValue(/# Phone:\s*([\s\S]*?)(?=# Website)/),
      website: getValue(/# Website:\s*([\s\S]*?)(?=# Email)/),
      email: getValue(/# Email:\s*([\s\S]*?)(?=# Photo-Url)/),
      photoUrl: getValue(/# Photo-Url:\s*([\s\S]*?)(?=# Type)/),
      type: getValue(/# Type:\s*([\s\S]*?)\n/),
      services: getValue(/# Services:\s*([\s\S]*?)(?=# Comments)/).split(',').map(s => s.trim()),
      comments: [getValue(/# Comments:\s*([\s\S]*?)(?=# Hours)/)],
      hours: [],
      verified: false
    };

    // Hours Parsing
    const hoursMatches = /- Day:\s*(.*?)\s*\|\s*Open - Close:\s*(.*?)$/gm;
    let hMatch;
    while ((hMatch = hoursMatches.exec(markdown))) {
      hospitalData.hours?.push({ day: hMatch[1].trim(), open: hMatch[2].trim() });
    }

    if (!hospitalData.name || !hospitalData.address.city || !country) {
      setError("Name, City, and Country are required.");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.post(`/hospitals`, hospitalData);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style.editorContainer}>
      <header className={style.editorHeader}>
        <h1 className={style.title}>
          Help Others Find Care Faster — <span className={style.accent}>Add A Hospital To The Map.</span>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className={style.editorForm}>
        <div className={style.toolbar}>
          <button type="button" onClick={resetTemplate} className={style.resetBtn}>
            <MdOutlineRestartAlt /> Reset Template
          </button>
        </div>

        <ReactMde
          value={markdown}
          onChange={setMarkdown}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(md) =>
            Promise.resolve(<div className={style.markdownBody}><ReactMarkdown>{md}</ReactMarkdown></div>)
          }
          minEditorHeight={450}
        />

        {error && <div className={style.errorBox}><MdErrorOutline /> {error}</div>}

        <div className={style.formActions}>
          <Button disabled={loading} type="submit">
            <span className={style.btnContent}>
              {loading ? 'Processing...' : 'Submit Facility'}
            </span>
          </Button>
        </div>
      </form>

      {/* --- SUCCESS MODAL --- */}
      <AnimatePresence>
        {showSuccess && (
          <div className={style.modalOverlay}>
            <motion.div variants={zoomIn} initial="hidden" animate="visible" exit="hidden" className={style.successModal}>
              <div className={style.checkWrapper}>
                <MdCheckCircleOutline className={style.checkIcon} />
              </div>
              <h2>Submission Received!</h2>
              <p>Thank you, <strong>{state?.username}</strong>. The facility data has been sent to our team for verification. It will appear on the map once approved.</p>
              <button onClick={resetTemplate} className={style.closeModalBtn}>Great, Got it!</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Editor;