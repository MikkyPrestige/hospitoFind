import { BsGlobe2 } from "react-icons/bs";
import { FaMapMarkedAlt, FaNotesMedical } from "react-icons/fa";
import { MdOutlineManageSearch } from "react-icons/md";
import Stethoscope from "@/assets/images/stethoscope.jpg";
import Handset from "@/assets/images/handset.jpg";
import Laptop from "@/assets/images/laptop.jpg";
import Search from "@/assets/images/hospitalSearch.png";
import Reviewer2 from "@/assets/images/man1.jpg";
import Reviewer4 from "@/assets/images/man2.jpg";
import Reviewer7 from "@/assets/images/woman3.jpg";
import Reviewer9 from "@/assets/images/woman5.jpg";
import Reviewer8 from "@/assets/images/woman8.jpg";
import Reviewer10 from "@/assets/images/woman9.jpg";

export const features = [
    { icon: <FaNotesMedical />, title: "Comprehensive Profiles", text: "Access detailed facility records, including specialized services, accreditation status, and direct contact channels." },
    { icon: <FaMapMarkedAlt />, title: "Interactive Mapping", text: "Visualize healthcare density in your region with our precision mapping tools and get instant turn-by-turn directions." },
    { icon: <BsGlobe2 />, title: "Global Directory", text: "Seamlessly switch between countries to find care while traveling or for family members abroad." },
    { icon: <MdOutlineManageSearch />, title: "Agent Intelligence", text: "Utilize our intelligent routing agent to navigate healthcare networks and find the most suitable, verified facilities tailored to your specific needs." },
];

export const steps = [
    { img: Search, head: "Search & Discover", text: "Enter your city or region to instantly view a curated list of verified medical facilities near you.", pos: "content1" },
    { img: Stethoscope, head: "Create Profile", text: "Sign up to save critical contacts, track your history, and unlock advanced search filters.", pos: "content2" },
    { img: Handset, head: "Save & Share", text: "Export facility details to PDF or share secure links with family members in emergencies.", pos: "content3" },
    { img: Laptop, head: "Contribute Data", text: "Help the community by submitting new facilities or updating existing records for verification.", pos: "content4" },
];

export const reviews = [
    {
        text: "While traveling abroad, HospitoFind helped me quickly locate hospitals in a new country. The map and distance area made it stress free to get care when I needed it most.",
        img: Reviewer7,
        name: "Abena A.",
        role: "International Traveler"
    },
    {
        text: "Creating an account was a game-changer. I tracked my searches, downloaded lists, and shared options with my family while planning a surgery abroad. It’s intuitive and genuinely helpful.",
        img: Reviewer9,
        name: "Elena Marquez",
        role: "Caregiver"
    },
    {
        text: "HospitoFind gave me more than directions. From services to daily health tips, it feels like having a healthcare guide in my pocket.",
        img: Reviewer2,
        name: "Oliver Ray",
        role: "Health Enthusiast"
    },
    {
        text: "The outbreak alerts kept me informed during a local health scare. HospitoFind isn’t just about finding hospitals—it’s about staying safe, prepared, and ahead of the curve.",
        img: Reviewer8,
        name: "Bolu Adeboye",
        role: "Community Member"
    },
    {
        text: "I love that I can contribute by adding verified hospitals. Knowing my input helps others in my community find trusted care makes me feel part of a global movement.",
        img: Reviewer4,
        name: "Emeka O.",
        role: "Contributor"
    },
    {
        text: "The ‘recently viewed’ feature saved me so much time. I didn’t have to repeat searches; I could quickly compare hospitals I checked earlier and finalize my choice.",
        img: Reviewer10,
        name: "Amira Solano",
        role: "Patient"
    }
];