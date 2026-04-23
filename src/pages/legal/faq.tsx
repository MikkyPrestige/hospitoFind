import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { faqData } from "@/components/constants/faqContants"
import { SEOHelmet } from "@/components/ui/SeoHelmet";
import Motion from "@/components/ui/Motion";
import { fadeUp } from "@/utils/animations";
import style from "./styles/faq.module.css";

const FAQPage: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <>
            <SEOHelmet
                title="Frequently Asked Questions"
                description="Find answers to the most common questions about our global hospital directory, verified healthcare facilities, search features, data accuracy, and how HospitoFind helps you find trusted medical care worldwide."
                canonical="https://hospitofind.online/faq"
                schemaType="faq"
                schemaData={faqData}
                autoBreadcrumbs={true}
                lang="en"
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