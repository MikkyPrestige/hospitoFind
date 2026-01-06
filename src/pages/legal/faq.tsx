import React, { useState } from "react";
import { SEOHelmet } from "@/components/utils/seoUtils";
import Motion from "@/components/motion";
import { fadeUp } from "@/hooks/animations";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import style from "./styles/faq.module.css";

const faqData = [
    {
        question: "What is HospitoFind?",
        answer: "HospitoFind is a verified hospital directory that helps users locate trusted healthcare facilities worldwide. Every hospital in our database is manually researched and validated to ensure accuracy."
    },
    {
        question: "How do I search for hospitals?",
        answer: "Navigate to the 'Find a Hospital' page and use the search bar to filter by Hospital Name, City, or Country. Our real-time search helps you find care in seconds."
    },
    {
        question: "What information is available for each hospital?",
        answer: "Each verified profile includes the hospital's verified name, physical address, direct contact information, specialty services offered, and authentic user reviews."
    },
    {
        question: "Are the hospitals verified?",
        answer: "Yes. Unlike other directories that use automated bots, every hospital listed on HospitoFind has been manually verified by our team to protect user safety."
    },
    {
        question: "Is HospitoFind free to use?",
        answer: "Absolutely. HospitoFind is a free resource for users to search, share, and export healthcare information for personal use."
    },
    {
        question: "How can I add a new hospital to the database?",
        answer: "Registered users can submit new hospitals via the 'Add Hospital' button on their Dashboard. Note that all submissions undergo a manual review process before going live."
    },
    {
        question: "Does HospitoFind provide medical advice?",
        answer: "No. HospitoFind is strictly a directory service. We do not provide medical advice, diagnosis, or treatment. Please consult a qualified professional for any medical concerns."
    },
    {
        question: "Who can I contact for support or inquiries?",
        answer: "Our support team is available for data updates or inquiries via email at support@hospitofind.online."
    }
];

const FAQPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <SEOHelmet
                title="FAQ"
                description="Find answers to frequently asked questions about our manually verified global hospital directory."
                canonical="https://hospitofind.online/faq"
                schemaType="faq"
                schemaData={faqData}
            />

            <main className={style.faqContainer}>
                <Motion variants={fadeUp} className={style.content}>
                    <header className={style.header}>
                        <div className={style.titleGroup}>
                            <HelpCircle className={style.mainIcon} size={40} />
                            <h1 className={style.title}>Frequently Asked Questions</h1>
                        </div>
                        <p className={style.subtitle}>
                            Everything you need to know about using the HospitoFind verified healthcare directory.
                        </p>
                    </header>

                    <div className={style.faqList}>
                        {faqData.map((faq, index) => (
                            <div key={index} className={`${style.faqItem} ${openIndex === index ? style.activeItem : ""}`}>
                                <button
                                    className={style.faqQuestion}
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={openIndex === index}
                                >
                                    <span>{faq.question}</span>
                                    <span className={style.toggleIcon}>
                                        {openIndex === index ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                    </span>
                                </button>
                                <div
                                    className={`${style.faqAnswer} ${openIndex === index ? style.open : ""}`}
                                >
                                    <div className={style.answerInner}>
                                        <p>{faq.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Motion>
            </main>
        </>
    );
};

export default FAQPage;