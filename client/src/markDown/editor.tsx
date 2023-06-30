import { useState } from "react";
import axios from "axios";
import ReactMde, { Suggestion } from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css"
import { Hospital } from "@/services/hospitalTypes";
import { Button } from "@/components/button";
import style from "@/components/style/random.module.css";

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
      type,
      services,
      comments,
      hours: hoursData
    };

    // Validate form fields
    if (hospital.name === "") {
      setError("Please enter a hospital name");
    } else if (hospital.address.city === "") {
      setError("Please enter a city the hospital is located");
    } else if (hospital.address.state === "") {
      setError("Please enter a state the hospital is located");
    } else if (hospital.phoneNumber === "" && hospital.email === "" && hospital.email === "") {
      setError("Please enter at least one contact detail (phone number, email or website)");
    } else if (hospital.type === "") {
      setError("Please enter the type of hospital (Public or Private)");
    } else {
      try {
        await axios.post<Hospital>("http://localhost:5000/hospitals", hospital)
        // console.log("Hospital data saved:", hospital);
        setMarkdown("Hospital added. Thanks for your contribution!");
        setError("");
      } catch (error) {
        setError(error.response.data.message);
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
        <div className={style.cta}>
          <Button
            children={<span className={style.btn_span}>Add</span>}
          />
        </div>
      </form>
      {error && <p className={style.red}>{error}</p>}
    </>
  )
}
export default Editor;
