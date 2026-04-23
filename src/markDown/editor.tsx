import { useState } from 'react';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { MdOutlineRestartAlt, MdErrorOutline, MdCheckCircleOutline, MdViewList, MdCode } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from "@/context/UserProvider";
import { useSubmitHospital } from '@/hooks/useSubmitHospital';
import { HospitalSubmission } from '@/types/hospital';
import { Button } from '@/components/ui/Button';
import { zoomIn } from '@/utils/animations';
import style from './styles/editor.module.css';

const INITIAL_TEMPLATE = `---
**Instructions:** Please fill in the details below. Do not remove the headers (lines starting with #).

## 🏥 Basic Information
# Name:

## 📍 Location Details
# Address
- Street:
- City:
- Country:

## 📞 Contact & Media
# Phone:
# Website:
# Email:
# Photo-Url:

## ⚕️ Facility Specs
# Type:
(Public / Private / Missionary)

# Services:
(e.g., Emergency, Dental, Pediatrics - separate with commas)

# Comments:
(Additional details about the facility)

## ⏰ Operating Hours
- Day: Monday    | Open - Close:
- Day: Tuesday   | Open - Close:
- Day: Wednesday | Open - Close:
- Day: Thursday  | Open - Close:
- Day: Friday    | Open - Close:
- Day: Saturday  | Open - Close:
- Day: Sunday    | Open - Close:
---`;

const Editor = () => {
  const { state } = useAuthContext();
  const { submitHospital, loading, error, showSuccess, resetNetworkState, setError } = useSubmitHospital();
  const [entryMode, setEntryMode] = useState<'form' | 'markdown'>('form');
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [markdown, setMarkdown] = useState(INITIAL_TEMPLATE);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    country: '',
    phone: '',
    website: '',
    email: '',
    photoUrl: '',
    type: 'Private',
    services: '',
    comments: '',
    hours: ''
  });

  const resetState = () => {
    setMarkdown(INITIAL_TEMPLATE);
    setFormData({
      name: '', street: '', city: '', country: '', phone: '', website: '', email: '', photoUrl: '', type: 'Private', services: '', comments: '', hours: ''
    });
    resetNetworkState();
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let payload: HospitalSubmission;

    if (entryMode === 'markdown') {
      const getValue = (regex: RegExp) => {
        const match = regex.exec(markdown);
        return match ? match[1].trim() : '';
      };

      const addressMatch = /- Street:\s*([\s\S]*?)\s*- City:\s*([\s\S]*?)\s*- Country:\s*([\s\S]*?)(?=# Phone)/.exec(markdown);
      const country = addressMatch ? addressMatch[3].trim() : '';

      payload = {
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
        services: getValue(/# Services:\s*([\s\S]*?)(?=# Comments)/).split(',').map(s => s.trim()).filter(Boolean),
        comments: [getValue(/# Comments:\s*([\s\S]*?)(?=# Hours|---)/)].filter(Boolean),
        hours: [],
        verified: false
      };

      // Hours Parsing for Markdown
      const hoursMatches = /- Day:\s*(.*?)\s*\|\s*Open - Close:\s*(.*?)$/gm;
      let hMatch;
      while ((hMatch = hoursMatches.exec(markdown))) {
        payload.hours?.push({ day: hMatch[1].trim(), open: hMatch[2].trim() });
      }

    } else {
      payload = {
        name: formData.name,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.country,
          country: formData.country,
        },
        phoneNumber: formData.phone,
        website: formData.website,
        email: formData.email,
        photoUrl: formData.photoUrl,
        type: formData.type,
        services: formData.services.split(',').map(s => s.trim()).filter(Boolean),
        comments: [formData.comments].filter(Boolean),
        hours: formData.hours ? [{ day: "Standard Operating Hours", open: formData.hours }] : [],
        verified: false
      };
    }

    // Validation Guardrail
    if (!payload.name || !payload.address.city || !payload.address.country) {
      setError("Data Integrity Error: Facility Name, City, and Country are strictly required.");
      return;
    }

    await submitHospital(payload);
  };

  return (
    <section className={style.editorContainer}>
      <header className={style.editorHeader}>
        <h1 className={style.title}>Submit a New Facility</h1>
        <p className={style.subtitle}>
          Help us expand our trusted network. Ensure data accuracy to assist users safely.
        </p>

        <div className={style.modeSwitcher}>
          <button
            type="button"
            onClick={() => setEntryMode('form')}
            className={`${style.modeBtn} ${entryMode === 'form' ? style.modeBtnActive : ''}`}
          >
            <MdViewList size={20} /> Guided Form
          </button>
          <button
            type="button"
            onClick={() => setEntryMode('markdown')}
            className={`${style.modeBtn} ${entryMode === 'markdown' ? style.modeBtnActive : ''}`}
          >
            <MdCode size={20} /> Advanced Editor
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className={style.editorForm}>
        <div className={style.toolbar}>
          <button type="button" onClick={resetState} className={style.resetBtn}>
            <MdOutlineRestartAlt size={20} /> Clear Data
          </button>
        </div>

        {entryMode === 'markdown' ? (
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
        ) : (
          <div className={style.guidedForm}>
            {/* Basic Info & Location */}
            <div className={style.formContainer}>
              <h3 className={style.sectionTitle}>Basic Information</h3>
              <div className={style.formSection}>
                <div className={style.inputGroup}>
                  <label>Facility Name *</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleFormChange} className={style.inputField} placeholder="e.g., General Hospital" />
                </div>

                <div className={`${style.formGrid} ${style.threeCol}`}>
                  <div className={style.inputGroup}>
                    <label>Street Address</label>
                    <input type="text" name="street" value={formData.street} onChange={handleFormChange} className={style.inputField} placeholder="123 Medical Way" />
                  </div>
                  <div className={style.inputGroup}>
                    <label>City *</label>
                    <input required type="text" name="city" value={formData.city} onChange={handleFormChange} className={style.inputField} placeholder="City" />
                  </div>
                  <div className={style.inputGroup}>
                    <label>Country *</label>
                    <input required type="text" name="country" value={formData.country} onChange={handleFormChange} className={style.inputField} placeholder="Country" />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Media */}
            <div className={style.formContainer}>
              <h3 className={style.sectionTitle}>Contact & Media</h3>
              <div className={style.formSection}>
                <div className={`${style.formGrid} ${style.twoCol}`}>
                  <div className={style.inputGroup}>
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className={style.inputField} placeholder="+1 234 567 8900" />
                  </div>
                  <div className={style.inputGroup}>
                    <label>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} className={style.inputField} placeholder="contact@hospital.com" />
                  </div>
                  <div className={style.inputGroup}>
                    <label>Website URL</label>
                    <input type="url" name="website" value={formData.website} onChange={handleFormChange} className={style.inputField} placeholder="https://www.hospital.com" />
                  </div>
                  <div className={style.inputGroup}>
                    <label>Photo URL</label>
                    <input type="url" name="photoUrl" value={formData.photoUrl} onChange={handleFormChange} className={style.inputField} placeholder="https://link-to-image.jpg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Facility Specs */}
            <div className={style.formContainer}>
            <h3 className={style.sectionTitle}>Facility Specifications</h3>
            <div className={style.formSection}>
              <div className={style.inputGroup}>
                <label>Facility Type</label>
                <select name="type" value={formData.type} onChange={handleFormChange} className={style.inputField}>
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Missionary">Missionary</option>
                </select>
              </div>
              <div className={style.inputGroup}>
                <label>Clinical Services (Comma separated)</label>
                    <textarea name="services" rows={3} value={formData.services} onChange={handleFormChange} className={style.inputField} placeholder="e.g., Emergency, Dental, Surgery, Pediatrics"></textarea>
              </div>
              <div className={`${style.formGrid} ${style.twoCol}`}>
                <div className={style.inputGroup}>
                  <label>Additional Comments / Notes</label>
                  <textarea name="comments" rows={3} value={formData.comments} onChange={handleFormChange} className={style.inputField} placeholder="Any critical information users should know..."></textarea>
                </div>
                <div className={style.inputGroup}>
                  <label>Operating Hours</label>
                  <textarea name="hours" rows={3} value={formData.hours} onChange={handleFormChange} className={style.inputField} placeholder="e.g., Mon - Fri: 8:00 AM - 5:00 PM, Emergency 24/7"></textarea>
                </div>
              </div>
            </div>
              </div>
          </div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={style.errorBox}>
            <MdErrorOutline size={20} /> {error}
          </motion.div>
        )}

        <div className={style.formActions}>
          <Button disabled={loading} type="submit">
            <span className={style.btnContent}>
              {loading ? 'Securing Submission...' : 'Submit for Verification'}
            </span>
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {showSuccess && (
          <div className={style.modalOverlay}>
            <motion.div variants={zoomIn} initial="hidden" animate="visible" exit="hidden" className={style.successModal}>
              <div className={style.checkWrapper}>
                <MdCheckCircleOutline className={style.checkIcon} />
              </div>
              <h2>Submission Received!</h2>
              <p>Thank you, <strong>{state?.username || 'Contributor'}</strong>. The facility data has been securely transmitted for verification.</p>
              <button onClick={resetState} className={style.closeModalBtn}>Submit Another</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section >
  );
};

export default Editor;