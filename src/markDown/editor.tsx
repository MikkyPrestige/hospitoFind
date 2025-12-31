import { useState } from 'react';
import axios from 'axios';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { Hospital } from '@/services/hospital';
import { Button } from '@/components/button';
import style from './style/editor.module.css';
import { MdOutlineLibraryAdd, MdOutlineRestartAlt, MdErrorOutline, MdCheckCircleOutline } from 'react-icons/md';
import { useAuthContext } from "@/context/userContext";
import { motion, AnimatePresence } from 'framer-motion';
import { zoomIn } from '@/hooks/animations';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Omitting server-side fields to satisfy TypeScript
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

    // --- MAPPING LOGIC: UI COUNTRY -> DB STATE ---
    const addressMatch = /- Street:\s*([\s\S]*?)\s*- City:\s*([\s\S]*?)\s*- Country:\s*([\s\S]*?)(?=# Phone)/.exec(markdown);
    const country = addressMatch ? addressMatch[3].trim() : '';

    const hospitalData: HospitalSubmission = {
      name: getValue(/# Name:\s*([\s\S]*?)(?=# Address)/),
      address: {
        street: addressMatch ? addressMatch[1].trim() : '',
        city: addressMatch ? addressMatch[2].trim() : '',
        state: country, // Maps UI Country to DB state field
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
      await axios.post(`${BASE_URL}/hospitals`, hospitalData);
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
              <MdOutlineLibraryAdd className={style.btnIcon} />
            </span>
          </Button>
        </div>
      </form>

      {/* --- PREMIUM SUCCESS MODAL --- */}
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

// import { useState } from 'react'
// import axios from 'axios'
// import ReactMde, { Suggestion } from 'react-mde'
// import ReactMarkdown from 'react-markdown'
// import 'react-mde/lib/styles/css/react-mde-all.css'
// import { Hospital } from '@/services/hospital'
// import { Button } from '@/components/button'
// import style from '../components/style/random.module.css'

// const BASE_URL = import.meta.env.VITE_BASE_URL

// // load suggestions
// const loadSuggestions = async (text: string) => {
//   return new Promise<Suggestion[]>((accept) => {
//     setTimeout(() => {
//       const suggestions: Suggestion[] = [
//         { preview: 'Public', value: 'Public' },
//         { preview: 'Private', value: 'Private' },
//         { preview: 'Nigeria', value: 'Nigeria' },
//         { preview: 'Ghana', value: 'Ghana' },
//         { preview: 'Kenya', value: 'Kenya' },
//         { preview: 'Angola', value: 'Angola' },
//         { preview: 'South Korea', value: 'South Korea' },
//         { preview: 'United States', value: 'United States' },
//         { preview: 'United Kingdom', value: 'United Kingdom' },
//         { preview: 'Sweden', value: 'Sweden' },
//         { preview: 'Spain', value: 'Spain' },
//         { preview: 'Belgium', value: 'Belgium' },
//         { preview: 'Thailand', value: 'Thailand' },
//         { preview: 'Denmark', value: 'Denmark' },
//         { preview: 'China', value: 'China' },
//         { preview: 'Japan', value: 'Japan' },
//         { preview: 'Egypt', value: 'Egypt' },
//       ].filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()))
//       accept(suggestions)
//     }, 250)
//   })
// }

// const suggestionTriggerCharacters = ['A', 'N', 'G', 'S', 'K', 'P', 'U', 'B', 'C', 'J', 'E', 'T', 'D']

// const Editor = () => {
//   const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write')
//   const [error, setError] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [markdown, setMarkdown] = useState(`
//   Please verify the hospital information before submitting to help keep our data accurate. Thank you!

//   # Name:

//   # Address

//   - Street:
//   - City:
//   - Country:

//   # Phone:

//   # Website:

//   # Email:

//   # Photo-Url:

//   # Type:

//   # Services:

//   # Comments:

//   # Hours

//   - Day: Monday
//   - Open - Close:

//   - Day: Tuesday
//   - Open - Close:

//   - Day: Wednesday
//   - Open - Close:

//   - Day: Thursday
//   - Open - Close:

//   - Day: Friday
//   - Open - Close:

//   - Day: Saturday
//   - Open - Close:

//   - Day: Sunday
//   - Open - Close:
//   `)

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     const nameMatch = /# Name:\s*([\s\S]*?)(?=# Address)/.exec(markdown)
//     const name = nameMatch ? nameMatch[1].trim() : ''

//     const addressMatch =
//       /- Street:\s*([\s\S]*?)\s*- City:\s*([\s\S]*?)\s*- Country:\s*([\s\S]*?)(?=# Phone)/.exec(
//         markdown
//       )

//     const street = addressMatch ? addressMatch[1].trim() : ''
//     const city = addressMatch ? addressMatch[2].trim() : ''
//     const country = addressMatch ? addressMatch[3].trim() : ''

//     const phoneNumberMatch = /# Phone:\s*([\s\S]*?)(?=# Website)/.exec(markdown)
//     const phoneNumber = phoneNumberMatch ? phoneNumberMatch[1].trim() : ''

//     const websiteMatch = /# Website:\s*([\s\S]*?)(?=# Email)/.exec(markdown)
//     const website = websiteMatch ? websiteMatch[1].trim() : ''

//     const emailMatch = /# Email:\s*([\s\S]*?)(?=# Photo-Url)/.exec(markdown)
//     const email = emailMatch ? emailMatch[1].trim() : ''

//     const photoUrlMatch = /# Photo-Url:\s*([\s\S]*?)(?=# Type)/.exec(markdown)
//     const photoUrl = photoUrlMatch ? photoUrlMatch[1].trim() : ''

//     const typeMatch = /# Type:\s*([\s\S]*?)(?=# Services)/.exec(markdown)
//     const type = typeMatch ? typeMatch[1].trim() : ''

//     const servicesMatch = /# Services:\s*([\s\S]*?)(?=# Comments)/.exec(markdown)
//     const services = servicesMatch ? servicesMatch[1].trim() : ''

//     const commentsMatch = /# Comments:\s*([\s\S]*?)(?=# Hours)/.exec(markdown)
//     const comments = commentsMatch ? commentsMatch[1].trim() : ''

//     const hoursMatches = /- Day:\s*(.*?)\s*- Open - Close:\s*(.*?)$/gm
//     const hoursData: { day: string; open: string }[] = []
//     let hoursMatch
//     while ((hoursMatch = hoursMatches.exec(markdown))) {
//       const day = hoursMatch[1].trim()
//       const open = hoursMatch[2].trim()
//       hoursData.push({ day, open })
//     }

//     const hospital = {
//       name,
//       address: {
//         street,
//         city,
//         state: country,
//       },
//       phoneNumber,
//       website,
//       email,
//       photoUrl,
//       type,
//       services,
//       comments,
//       hours: hoursData,
//     }

//     // validations unchanged
//     const isValidPhoneNumber = (num: string) =>
//       /^(?:\+?\d{1,3})?[-. (]?\d{2,4}[-. )]?\d{3,4}[-. ]?\d{3,4}$/.test(num)

//     const isValidWebsite = (w: string) =>
//       /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}$/i.test(w)

//     const isValidEmail = (e: string) =>
//       /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(e)

//     const isValidPhotoUrl = (u: string) =>
//       /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(u)

//     const isValidType = (t: string) => /^(Public|Private)$/.test(t)

//     if (!hospital.name) {
//       setError('Enter hospital name on the markdown')
//       return
//     } else if (!hospital.address.city) {
//       setError('Enter city where the hospital is located')
//       return
//     } else if (!hospital.address.state) {
//       setError('Enter country where the hospital is located')
//       return
//     } else if (hospital.phoneNumber && !isValidPhoneNumber(hospital.phoneNumber)) {
//       setError('Enter valid hospital phone number (no spaces)')
//       return
//     } else if (hospital.website && !isValidWebsite(hospital.website)) {
//       setError('Enter valid hospital website URL')
//       return
//     } else if (hospital.email && !isValidEmail(hospital.email)) {
//       setError('Enter valid hospital email address')
//       return
//     } else if (hospital.photoUrl && !isValidPhotoUrl(hospital.photoUrl)) {
//       setError('Enter valid hospital photo link (jpg/png/gif)')
//       return
//     } else if (!hospital.type || !isValidType(hospital.type)) {
//       setError('Enter valid hospital type (Public or Private)')
//       return
//     }

//     try {
//       setLoading(true)
//       await axios.post<Hospital>(`${BASE_URL}/hospitals`, hospital)
//       setMarkdown(`${hospital?.name} was added successfully — thank you for helping others find care!`)
//       setError('')
//       setLoading(false)
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong')
//       setLoading(false)
//     }
//   }

//   return (
//     <section className={style.editor}>
//       <h1 className={style.title}>
//         Help others find care faster — add a hospital to the map.
//       </h1>
//       <form onSubmit={handleSubmit} className={style.form}>
//         <ReactMde
//           value={markdown}
//           onChange={setMarkdown}
//           selectedTab={selectedTab}
//           onTabChange={setSelectedTab}
//           generateMarkdownPreview={(markdown) =>
//             Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
//           }
//           loadSuggestions={loadSuggestions}
//           suggestionTriggerCharacters={suggestionTriggerCharacters}
//           minEditorHeight={500}
//         />
//         {error && <p className={style.error}>{error}</p>}
//         <div className={style.cta}>
//            <Button disabled={loading}
//                     children={<span className={style.btn}>
//                         {loading ? (
//                           'Adding hospital...'
//                         ) : (
//                           <span className={style.btn_span}>
//                             Add Hospital
//                           </span>
//                         )}
//                       </span>
//                     }
//                   />
//                 </div>
//       </form>
//     </section>
//   )
// }

// export default Editor
