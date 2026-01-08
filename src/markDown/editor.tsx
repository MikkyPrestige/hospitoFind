import { useState } from 'react';
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { Hospital } from '@/services/hospital';
import { Button } from '@/components/ui/Button';
import style from './styles/editor.module.css';
import { MdOutlineRestartAlt, MdErrorOutline, MdCheckCircleOutline } from 'react-icons/md';
import { useAuthContext } from "@/context/UserProvider";
import { motion, AnimatePresence } from 'framer-motion';
import { zoomIn } from '@/utils/animations';

type HospitalSubmission = Omit<Hospital, '_id' | 'slug' | 'longitude' | 'latitude'>;

const INITIAL_TEMPLATE = `
**Instructions:** Please fill in the details below. Do not remove the headers (lines starting with #).

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
(Public / Private / Missionary)

# Services:
(e.g., Emergency, Dental, Pediatrics - separate with commas)

# Comments:
(Any additional details about the facility)

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
    setSelectedTab('write');
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
      setError("Please ensure the Name, City, and Country fields are filled out.");
      return;
    }

    try {
      setLoading(true);
      await axiosPrivate.post(`/hospitals`, hospitalData);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to submit hospital data. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={style.editorContainer}>
      <header className={style.editorHeader}>
        <h1 className={style.title}>
          Submit a New Facility
        </h1>
        <p className={style.subtitle}>
          Help us expand our reach. Add verified hospital details below to assist users in finding the care they need.
        </p>
      </header>

      <form onSubmit={handleSubmit} className={style.editorForm}>
        <div className={style.toolbar}>
          <button type="button" onClick={resetTemplate} className={style.resetBtn}>
            <MdOutlineRestartAlt /> Reset Form
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

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={style.errorBox}>
            <MdErrorOutline size={20} /> {error}
          </motion.div>
        )}

        <div className={style.formActions}>
          <Button disabled={loading} type="submit">
            <span className={style.btnContent}>
              {loading ? 'Submitting...' : 'Submit for Verification'}
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
              <p>Thank you, <strong>{state?.username}</strong>. The facility data has been sent to our team for verification. It will appear on the map once verified.</p>
              <button onClick={resetTemplate} className={style.closeModalBtn}>Submit Another</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Editor;