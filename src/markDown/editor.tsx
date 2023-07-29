import { useState } from "react";
import axios from "axios";
import ReactMde, { Suggestion } from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css"
import { Hospital } from "@/services/hospitalTypes";
import { Button } from "@/components/button";
import style from "@/components/style/random.module.css";

const BASE_URL = "https://strange-blue-battledress.cyclic.app";

// load suggestions
const loadSuggestions = async (text: string) => {
  return new Promise<Suggestion[]>((accept) => {
    setTimeout(() => {
      const suggestions: Suggestion[] = [
        {
          preview: "Public",
          value: "Public",
        },
        {
          preview: "Private",
          value: "Private",
        },
        {
          preview: "Delta",
          value: "Delta",
        },
        {
          preview: "Lagos",
          value: "Lagos",
        },
        {
          preview: "Benin",
          value: "Benin",
        },
        {
          preview: "Nasarawa",
          value: "Nasarawa",
        },
        {
          preview: "Kogi",
          value: "Kogi",
        },
        {
          preview: "Abuja",
          value: "Abuja",
        },
        {
          preview: "Benue",
          value: "Benue",
        },
        {
          preview: "Bayelsa",
          value: "Bayelsa",
        },
        {
          preview: "Anambra",
          value: "Anambra",
        },
        {
          preview: "Enugu",
          value: "Enugu",
        }
      ].filter((i) => i.preview.toLowerCase().includes(text.toLowerCase()));
      accept(suggestions);
    }, 250);
  });
};

// suggestionTriggerCharacters
const suggestionTriggerCharacters = ["D", "A", "L",
  "B", "N", "K", "E", "P", "S", "T", "O", "I"
];

const Editor = () => {
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState(`
  **Help us add hospitals you know!!!**

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
  `);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameMatch = /# Name:\s*([\s\S]*?)(?=# Address)/.exec(markdown);
    const name = nameMatch ? nameMatch[1].trim() : "";
    const addressMatch = /- Street:\s*([\s\S]*?)\s*- City:\s*([\s\S]*?)\s*- State:\s*([\s\S]*?)(?=# Phone)/.exec(markdown);
    const street = addressMatch ? addressMatch[1].trim() : "";
    const city = addressMatch ? addressMatch[2].trim() : "";
    const state = addressMatch ? addressMatch[3].trim() : "";
    const phoneNumberMatch = /# Phone:\s*([\s\S]*?)(?=# Website)/.exec(markdown);
    const phoneNumber = phoneNumberMatch ? phoneNumberMatch[1].trim() : "";
    const websiteMatch = /# Website:\s*([\s\S]*?)(?=# Email)/.exec(markdown);
    const website = websiteMatch ? websiteMatch[1].trim() : "";
    const emailMatch = /# Email:\s*([\s\S]*?)(?=# Type)/.exec(markdown);
    const email = emailMatch ? emailMatch[1].trim() : "";
    const photoUrlMatch = /# Photo-Url:\s*([\s\S]*?)(?=# Type)/.exec(markdown);
    const photoUrl = photoUrlMatch ? photoUrlMatch[1].trim() : "";
    const typeMatch = /# Type:\s*([\s\S]*?)(?=# Services)/.exec(markdown);
    const type = typeMatch ? typeMatch[1].trim() : "";
    const servicesMatch = /# Services:\s*([\s\S]*?)(?=# Comments)/.exec(markdown);
    const services = servicesMatch ? servicesMatch[1].trim() : "";
    const commentsMatch = /# Comments:\s*([\s\S]*?)(?=# Hours)/.exec(markdown);
    const comments = commentsMatch ? commentsMatch[1].trim() : "";
    const hoursMatches = /- Day:\s*(.*?)\s*- Open - Close:\s*(.*?)$/gm;
    const hoursData: { day: string; open: string }[] = [];
    let hoursMatch;
    while ((hoursMatch = hoursMatches.exec(markdown))) {
      const day = hoursMatch[1].trim();
      const open = hoursMatch[2].trim();
      hoursData.push({ day, open });
    }

    // Create a hospital object
    const hospital = {
      name,
      address: {
        street,
        city,
        state
      },
      phoneNumber,
      website,
      email,
      photoUrl,
      type,
      services,
      comments,
      hours: hoursData
    };

    const isValidPhoneNumber = (phoneNumber: string) => {
      const phoneRegex = /^\d{11}$/; // Assumes the phone number should be 11 digits
      return phoneRegex.test(phoneNumber);
    };

    // Validate form fields
    if (!hospital.name) {
      setError("Please enter a hospital name");
      return
    } else if (!hospital.address.city) {
      setError("Please enter a city the hospital is located");
      return
    } else if (!hospital.address.state) {
      setError("Please enter a state the hospital is located");
      return
    } else if (hospital.phoneNumber && !isValidPhoneNumber(hospital.phoneNumber)) {
      setError("Please enter a valid phone number");
      return
    } else if (hospital.website && !hospital.website.startsWith("https")) {
      setError("Please enter a valid website address");
      return
    } else if (hospital.photoUrl && !hospital.photoUrl.startsWith("https")) {
      setError("Please enter a valid photo url");
      return
    } else if (!hospital.type) {
      setError("Please enter the type of hospital (Public or Private)");
      return
    } else {
      try {
        setLoading(true);
        await axios.post<Hospital>(`${BASE_URL}/hospitals`, hospital)
        setMarkdown("Hospital added. Thanks for your contribution!");
        setError("");
        setLoading(false);
      } catch (error: any) {
        setError(error.response.data.message);
        setLoading(false);
      }
    }
  };


  return (
    <>
      <form onSubmit={handleSubmit} className={style.editor}>
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
              tabIndex: -1
            }
          }}
          loadingPreview={<div className="loading-preview">
            <p>Loading...</p></div>}
        />
        {error && <p className={style.error}>{error}</p>}
        <div className={style.cta}>
          <Button
            disabled={loading}
            children={<span className={style.btn_span}>Add</span>}
          />
        </div>
      </form>
    </>
  )
}
export default Editor;
