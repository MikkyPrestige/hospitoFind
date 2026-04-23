import { ShieldCheck, Database, Eye, RefreshCcw, Mail } from "lucide-react";
import { SEOHelmet } from "@/components/ui/SeoHelmet";
import Motion from "@/components/ui/Motion";
import { fadeUp } from "@/utils/animations";
import style from "./styles/policy.module.css";

const Policy = () => {
    const lastUpdated = "January 20, 2026";

    return (
        <>
            <SEOHelmet
                title="Privacy Policy"
                description="Read HospitoFind's Privacy Policy to understand how we collect, use, protect, and share your personal information while helping you find verified hospitals and healthcare services worldwide."
                canonical="https://hospitofind.online/policy"
                schemaType="policy"
                autoBreadcrumbs={true}
                lang="en"
            />

            <main className={style.policyContainer}>
                <Motion variants={fadeUp} className={style.content}>
                    <header className={style.header}>
                        <h1 className={style.title}>Privacy Policy</h1>
                        <p className={style.updated}>Last Updated: {lastUpdated}</p>
                        <p className={style.introText}>
                            At <strong>HospitoFind</strong>, we are committed to making healthcare information accessible and secure.
                            This policy outlines our transparent approach to data handling within our manually verified directory.
                        </p>
                    </header>

                    <section className={style.section}>
                        <div className={style.headingGroup}>
                            <Database className={style.icon} size={24} />
                            <h2>Information We Collect</h2>
                        </div>
                        <p>
                            We collect minimal data to ensure a streamlined experience. This may include your name and email
                            address when you register for an account or contact our support team. Most directory features
                            are accessible without requiring any personal identification.
                        </p>
                    </section>

                    <section className={style.section}>
                        <div className={style.headingGroup}>
                            <RefreshCcw className={style.icon} size={24} />
                            <h2>How We Use Your Data</h2>
                        </div>
                        <p>The limited information we collect is used strictly for:</p>
                        <ul className={style.list}>
                            <li>Securely managing your account and authentication via trusted providers.</li>
                            <li>Maintaining the integrity of our verified hospital database.</li>
                            <li>Improving platform performance based on anonymized usage patterns.</li>
                            <li>Responding directly to your healthcare-related inquiries or feedback.</li>
                        </ul>
                    </section>

                    <section className={style.section}>
                        <div className={style.headingGroup}>
                            <ShieldCheck className={style.icon} size={24} />
                            <h2>Data Protection & Integrity</h2>
                        </div>
                        <p>
                            We take the security of our users and our manually verified data seriously. Your information is
                            stored in secure, encrypted databases. As HospitoFind expands its global reach, we continue
                            to implement enterprise-grade security protocols to safeguard every interaction.
                        </p>
                    </section>

                    <section className={style.section}>
                        <div className={style.headingGroup}>
                            <Eye className={style.icon} size={24} />
                            <h2>Zero Sharing Policy</h2>
                        </div>
                        <p>
                            We do not sell, trade, or rent your personal information to third parties. Data is only
                            processed by essential, trusted services (such as our hosting and authentication partners)
                            strictly as needed to keep the platform operational.
                        </p>
                    </section>

                    <footer className={style.contactNote}>
                        <div className={style.headingGroup} style={{ justifyContent: 'center' }}>
                            <Mail className={style.icon} size={20} />
                            <h3>Privacy Support</h3>
                        </div>
                        <p>
                            For privacy concerns or data requests, reach us at
                            <a href="mailto:hospitofind@outlook.com"> hospitofind@outlook.com</a>
                        </p>
                    </footer>
                </Motion>
            </main>
        </>
    );
};

export default Policy;
