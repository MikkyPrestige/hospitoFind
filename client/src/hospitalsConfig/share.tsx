import axios from "axios";
import { SearchProps, statesAndCities } from "@/services/hospitalTypes";
import { useState } from "react";
import style from "./style/shareExport/shareExport.module.css";
import { CgShare } from "react-icons/cg";

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
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className={style.cta}>
      <button type="submit" onClick={handleShare} disabled={generating} className={style.btn}>
        {generating ? <div className={style.loader}>Getting Your Link...</div> : <CgShare className={style.icon} />}
        Share
      </button>
      {shareableLink &&
        <a href={shareableLink} target="_blank" rel="noreferrer" className={style.link}>
          Copy Link: {shareableLink}
        </a>}
      {error && <p className={style.error}>{error}</p>}
    </div>
  )
}

export default ShareButton;