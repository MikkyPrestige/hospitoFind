import { useState } from 'react'
import axios from 'axios'
import ReactMde, { Suggestion } from 'react-mde'
import ReactMarkdown from 'react-markdown'
import 'react-mde/lib/styles/css/react-mde-all.css'
import { Hospital } from '@/services/hospital'
import { Button } from '@/components/button'
import style from '../components/style/random.module.css'

const BASE_URL = 'https://hospitofind-server.onrender.com'

// load suggestions
const loadSuggestions = async (text: string) => {
  return new Promise<Suggestion[]>((accept) => {
    setTimeout(() => {
      const suggestions: Suggestion[] = [
        {
          preview: 'Public',
          value: 'Public',
        },
        {
          preview: 'Private',
          value: 'Private',
        },
        {
          preview: 'Delta',
          value: 'Delta',
        },
        {
          preview: 'Lagos',
          value: 'Lagos',
        },
        {
          preview: 'Benin',
          value: 'Benin',
        },
        {
          preview: 'Nasarawa',
          value: 'Nasarawa',
        },
        {
          preview: 'Kogi',
          value: 'Kogi',
        },
        {
          preview: 'Abuja',
          value: 'Abuja',
        },
        {
          preview: 'Benue',
          value: 'Benue',
        },
        {
          preview: 'Bayelsa',
          value: 'Bayelsa',
        },
        {
          preview: 'Anambra',
          value: 'Anambra',
        },
        {
          preview: 'Enugu',
          value: 'Enugu',
        },
      ].filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()))
      accept(suggestions)
    }, 250)
  })
}

// suggestionTriggerCharacters
const suggestionTriggerCharacters = [
  'D',
  'A',
  'L',
  'B',
  'N',
  'K',
  'E',
  'P',
  'S',
  'T',
  'O',
  'I',
]

const Editor = () => {
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [markdown, setMarkdown] = useState(`
  Please verify the hospital information before submitting to help keep our data accurate. Thank you!

  # Name:

  # Address

  - Street:
  - City:
  - State:

  # Phone:

  # Website:

  # Email:

  # Photo-Url:

  # Type:

  # Services:

  # Comments:

  # Hours

  - Day: Monday
  - Open - Close:

  - Day: Tuesday
  - Open - Close:

  - Day: Wednesday
  - Open - Close:

  - Day: Thursday
  - Open - Close:

  - Day: Friday
  - Open - Close:

  - Day: Saturday
  - Open - Close:

  - Day: Sunday
  - Open - Close:
  `)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const nameMatch = /# Name:\s*([\s\S]*?)(?=# Address)/.exec(markdown)
    const name = nameMatch ? nameMatch[1].trim() : ''
    const addressMatch =
      /- Street:\s*([\s\S]*?)\s*- City:\s*([\s\S]*?)\s*- State:\s*([\s\S]*?)(?=# Phone)/.exec(
        markdown
      )
    const street = addressMatch ? addressMatch[1].trim() : ''
    const city = addressMatch ? addressMatch[2].trim() : ''
    const state = addressMatch ? addressMatch[3].trim() : ''
    const phoneNumberMatch = /# Phone:\s*([\s\S]*?)(?=# Website)/.exec(markdown)
    const phoneNumber = phoneNumberMatch ? phoneNumberMatch[1].trim() : ''
    const websiteMatch = /# Website:\s*([\s\S]*?)(?=# Email)/.exec(markdown)
    const website = websiteMatch ? websiteMatch[1].trim() : ''
    const emailMatch = /# Email:\s*([\s\S]*?)(?=# Photo-Url)/.exec(markdown)
    const email = emailMatch ? emailMatch[1].trim() : ''
    const photoUrlMatch = /# Photo-Url:\s*([\s\S]*?)(?=# Type)/.exec(markdown)
    const photoUrl = photoUrlMatch ? photoUrlMatch[1].trim() : ''
    const typeMatch = /# Type:\s*([\s\S]*?)(?=# Services)/.exec(markdown)
    const type = typeMatch ? typeMatch[1].trim() : ''
    const servicesMatch = /# Services:\s*([\s\S]*?)(?=# Comments)/.exec(
      markdown
    )
    const services = servicesMatch ? servicesMatch[1].trim() : ''
    const commentsMatch = /# Comments:\s*([\s\S]*?)(?=# Hours)/.exec(markdown)
    const comments = commentsMatch ? commentsMatch[1].trim() : ''
    const hoursMatches = /- Day:\s*(.*?)\s*- Open - Close:\s*(.*?)$/gm
    const hoursData: { day: string; open: string }[] = []
    let hoursMatch
    while ((hoursMatch = hoursMatches.exec(markdown))) {
      const day = hoursMatch[1].trim()
      const open = hoursMatch[2].trim()
      hoursData.push({ day, open })
    }

    // Create a hospital object
    const hospital = {
      name,
      address: {
        street,
        city,
        state,
      },
      phoneNumber,
      website,
      email,
      photoUrl,
      type,
      services,
      comments,
      hours: hoursData,
    }

    const isValidPhoneNumber = (phoneNumber: string) => {
      const phoneRegex =
        /^(?:\+?([0-9]{2})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{3})[-. ]?([0-9]{4,6})$/
      return phoneRegex.test(phoneNumber)
    }

    const isValidWebsite = (website: string) => {
      const websiteRegex =
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}$/
      return websiteRegex.test(website)
    }

    const isValidEmail = (email: string) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      return emailRegex.test(email)
    }

    const isValidPhotoUrl = (photoUrl: string) => {
      const photoUrlRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/
      return photoUrlRegex.test(photoUrl)
    }

    const isValidType = (type: string) => {
      const typeRegex = /^(Public|Private)$/
      return typeRegex.test(type)
    }

    if (!hospital.name) {
      setError('Enter hospital name on  the markdown')
      return
    } else if (!hospital.address.city) {
      setError('Enter city the hospital is located on  the markdown')
      return
    } else if (!hospital.address.state) {
      setError('Enter state the hospital is located on  the markdown')
      return
    } else if (
      hospital.phoneNumber &&
      !isValidPhoneNumber(hospital.phoneNumber)
    ) {
      setError('Enter hospital phone number on  the markdown (Remove all whitespace)')
      return
    } else if (hospital.website && !isValidWebsite(hospital.website)) {
      setError('Enter hospital website on  the markdown')
      return
    } else if (hospital.email && !isValidEmail(hospital.email)) {
      setError('Enter hospital email address on  the markdown')
      return
    } else if (hospital.photoUrl && !isValidPhotoUrl(hospital.photoUrl)) {
      setError('Enter hospital photo link on  the markdown')
      return
    } else if (!hospital.type) {
      setError('Enter hospital type on  the markdown')
      return
    } else if (!isValidType(hospital.type)) {
      setError('Enter valid hospital type (Public or Private) on  the markdown')
      return
    } else {
      try {
        setLoading(true)
        await axios.post<Hospital>(`${BASE_URL}/hospitals`, hospital)
        setMarkdown(
          `${hospital?.name} was added successfully — thank you for helping others find care!`
        )
        setError('')
        setLoading(false)
      } catch (error: any) {
        setError(error.response.data.message)
        setLoading(false)
      }
    }
  }

  return (
    <section className={style.editor}>
      <h1 className={style.title}>Help others find care faster — add a hospital to the map.</h1>
      <form onSubmit={handleSubmit} className={style.form}>
        <ReactMde
          value={markdown}
          onChange={setMarkdown}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) =>
            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
          }
          loadSuggestions={loadSuggestions}
          suggestionTriggerCharacters={suggestionTriggerCharacters}
          minEditorHeight={500}
          childProps={{
            writeButton: {
              tabIndex: -1,
            },
          }}
          loadingPreview={
            <div className="loading-preview">
              <p
                style={{
                  color: '#00FF00',
                  fontSize: '1.5rem',
                  margin: '5rem auto',
                }}
              >
                Loading...
              </p>
            </div>
          }
        />
        {error && <p className={style.error}>{error}</p>}
        <div className={style.cta}>
          <Button
            disabled={loading}
            children={
              <span className={style.btn}>
                {loading ? (
                  'Adding hospital...'
                ) : (
                  <span className={style.btn_span}>
                    Add Hospital
                  </span>
                )}
              </span>
            }
          />
        </div>
      </form>
    </section>
  )
}
export default Editor
