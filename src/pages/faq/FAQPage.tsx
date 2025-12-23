import React from "react";
import { useState } from "react";
import { SEOHelmet } from "@/components/utils/seoUtils";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import style from "./FAQPage.module.css";

const faqData = [
    {
        question: "What is HospitoFind?",
        answer: "HospitoFind is a trusted hospital finder that helps users locate nearby hospitals and healthcare facilities quickly and easily."
    },
    {
        question: "How do I search for hospitals?",
        answer: "You can search for hospitals by entering Hospital name, City, or Country in the search bar on the Find a Hospital page."
    },
    {
        question: "What information is available for each hospital?",
        answer: "Each hospital profile includes details such as the hospital's name, address, contact information, services offered, and reviews and more."
    },
    {
        question: "Are the hospitals verified?",
        answer: "Yes, we strive to ensure that all hospitals listed on HospitoFind are verified by a human and provide accurate information."
    },
    {
        question: "Is HospitoFind free to use?",
        answer: "Yes, HospitoFind is completely free for users to search, share, export and access hospitals information."
    },
    {
        question: "Can I share hospital information with others?",
        answer: "Yes, you can share or export hospital information by using the share/export button available on your dashboard."
    },
    {
        question: "How can I add a new hospital to the database?",
        answer: "You can add a new hospital by clicking on the 'Add Hospital' button in your dashboard (accessible after logging in) and filling out the required information in the submission form."
    },
    {
        question: "How often is the hospital database updated?",
        answer: "Our hospital database is regularly updated to ensure that users have access to the most accurate and up-to-date information."
    },
    {
        question: "Does HospitoFind provide medical advice?",
        answer: "No, HospitoFind is a hospital finder service and does not provide medical advice. Please consult a healthcare professional for medical concerns."
    },
    {
        question: "Who can I contact for support or inquiries?",
        answer: "For support or inquiries, you can reach out to our support team via email at hospitoFind@outlook.com."
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
                description="Find answers to frequently asked questions about HospitoFind, the trusted hospital finder that helps you locate nearby hospitals and healthcare facilities fast and easy."
                canonical="https://hospitofind.online/faq"
                schemaType="faq"
                schemaData={faqData}
                autoBreadcrumbs={true}
            />
            <Header />
            <main className={style.faqSection}>
                <div className={style.container}>
                    <h1 className={style.pageTitle}>Frequently Asked Questions (FAQ)</h1>
                    <div className={style.faqList}>
                        {faqData.map((faq, index) => (
                            <div key={index} className={style.faqItem}>
                                <button
                                    className={style.faqQuestion}
                                    onClick={() => toggleFAQ(index)}
                                >
                                    {faq.question}
                                    <span className={style.icon}>
                                        {openIndex === index ? "−" : "+"}
                                    </span>
                                </button>
                                <div
                                    className={`${style.faqAnswer} ${openIndex === index ? style.open : ""
                                        }`}
                                >
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default FAQPage;