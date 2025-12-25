import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import { SEOHelmet } from "@/components/utils/seoUtils";
import Motion from "@/components/motion";
import { fadeUp } from "@/hooks/animations";
import style from "./styles/terms.module.css";

const Terms = () => {
    const lastUpdated = "December 24, 2025";

    return (
        <>
            <SEOHelmet
                title="Terms of Service"
                description="Read the terms and conditions for using the HospitoFind hospital directory simulation."
            />
            <Header />

            <main className={style.termsContainer}>
                <Motion variants={fadeUp} className={style.content}>
                    <header className={style.header}>
                        <h1 className={style.title}>Terms of Service</h1>
                        <p className={style.updated}>Last Updated: {lastUpdated}</p>
                    </header>

                    <section className={style.section}>
                        <h2>1. Our Service</h2>
                        <p>
                            HospitoFind provides a manually verified directory of hospitals and healthcare
                            facilities. Each entry in our database is researched and validated to ensure
                            users have access to reliable healthcare information.
                        </p>
                    </section>

                    <section className={style.section}>
                        <h2>2. No Medical Advice</h2>
                        <p>
                            HospitoFind is an information directory. <strong>We do not provide medical
                                advice, diagnosis, or treatment.</strong> The content on this platform is for
                            general informational purposes only and is not a substitute for professional
                            medical expertise.
                        </p>
                    </section>

                    <section className={style.section}>
                        <h2>3. Data Accuracy</h2>
                        <p>
                            While we take great pride in manually verifying all hospital listings,
                            healthcare details (such as phone numbers or available services) can change
                            frequently. We encourage users to confirm details with the facility directly
                            before traveling for care.
                        </p>
                    </section>

                    <section className={style.section}>
                        <h2>4. User Conduct</h2>
                        <p>
                            By using HospitoFind, you agree to use the data for personal, non-commercial
                            purposes. Any attempt to scrape our verified database or use the information
                            for unauthorized commercial gain is strictly prohibited.
                        </p>
                    </section>

                    <section className={style.section}>
                        <h2>5. Limitation of Liability</h2>
                        <p>
                            HospitoFind strives for excellence in data verification, but we are not
                            liable for any actions taken based on the information provided, or for the
                            quality of care received at any facility listed in our directory.
                        </p>
                    </section>

                    <footer className={style.contactNote}>
                        <p>Have questions or found an update for a facility? Contact us at <a href="mailto:hospitofind@outlook.com">Hospitofind</a></p>
                    </footer>
                </Motion>
            </main >

            <Footer />
        </>
    );
};

export default Terms;