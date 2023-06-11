import axios from "axios";
import { SearchProps, statesAndCities } from "@/services/hospitalTypes";
import { useState } from "react"

const BASE_URL = "http://localhost:5000/hospitals/share"

const ShareButton = ({ searchParams }: SearchProps) => {

  const [shareableLink, setShareableLink] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [generating, setGenerating] = useState<boolean>(false);

  const handleShare = async () => {
    try {
      setGenerating(true)
      const { data } = await axios.post(`${BASE_URL}`, {
        searchParams: {
          city: searchParams.city,
          state: searchParams.state
        }
      })
      // validate search
      if (!searchParams.city && !searchParams.state) {
        setError('Please enter a city or state');
        setGenerating(false)
        return
      } else if (searchParams.city && !statesAndCities.find(
        (name) => name.city === searchParams.city)) {
        setError('Please enter a valid city');
        setGenerating(false)
        return
      }
      else if (searchParams.state && !statesAndCities.find(
        (name) => name.state === searchParams.state)) {
        setError('Please enter a valid state');
        setGenerating(false)
        return
      }
      else if (searchParams.city && searchParams.state && !statesAndCities.find(
        (name) => name.city === searchParams.city && name.state === searchParams.state)) {
        setError('Please enter a valid city and state');
        setGenerating(false)
        return
      }
      // set shareable link
      const generatedLink = data.shareableLink
      setShareableLink(generatedLink)
      setGenerating(false)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <button type="submit" onClick={handleShare} disabled={generating}>
        {generating ? "Getting Your Link..." : "Share Hospitals"}
      </button>
      {shareableLink && <p>
        <a href={shareableLink} target="_blank" rel="noreferrer">
          {shareableLink}
        </a>
      </p>}
      {error && <p>{error}</p>}
    </div>
  )
}

export default ShareButton;