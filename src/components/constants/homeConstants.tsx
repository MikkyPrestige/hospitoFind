import { FiCheckCircle, FiHeart, FiSearch } from "react-icons/fi"

export const TYPEWRITER_PHRASES = [
  'Describe your symptoms.',
  'Find care near you.',
  'Get matched in seconds.',
  'Your health journey starts here.',
]

export const HOW_IT_WORKS = [
  {
    icon: <FiSearch size={22} />,
    step: '01',
    title: 'Describe Your Needs',
    desc: 'Tell our AI assistant your symptoms and location to get started.',
  },
  {
    icon: <FiCheckCircle size={22} />,
    step: '02',
    title: 'Get Matched',
    desc: 'We surface the best-fit verified hospitals based on your specific situation.',
  },
  {
    icon: <FiHeart size={22} />,
    step: '03',
    title: 'Get Care',
    desc: 'View profiles, get directions, and connect with the right facility fast.',
  },
]