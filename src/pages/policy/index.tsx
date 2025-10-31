import { Helmet } from "react-helmet-async";
import Header from "@/layouts/header/nav";
import Footer from "@/layouts/footer/footer";
import style from "./index.module.css";

const Policy = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy | HospitoFind</title>
            </Helmet>
            <Header />
            <div className={style.container}>
                <h1 className={style.title}>Privacy Policy</h1>
                <p className={style.text}>
                    Welcome to <strong>HospitoFind</strong> — a personal project built to make it easier for people to find hospitals within their region. Your privacy matters and this page explains how we handle the limited information we collect when you use our web app.
                </p>

                <div className={style.section}>
                    <h2>Information We Collect</h2>
                    <p>
                        HospitoFind currently collects minimal personal data. You may be asked to provide details like your name, email when registering as an admin or contacting us. Most features can be used without sharing personal information.
                    </p>
                </div>

                <div className={style.section}>
                    <h2>How We Use Your Information</h2>
                    <ul>
                        <li>To provide access to admin features and manage your account securely.</li>
                        <li>To improve HospitoFind based on your feedback and usage.</li>
                        <li>To respond to your messages or support requests.</li>
                    </ul>
                </div>

                <div className={style.section}>
                    <h2>Data Protection</h2>
                    <p>
                        We take reasonable steps to protect your data, including secure database storage and limited access.
                        As HospitoFind grows, stronger security measures will be added to ensure your information remains safe.
                    </p>
                </div>

                <div className={style.section}>
                    <h2>Sharing of Information</h2>
                    <p>
                        We do not sell or share your personal data. Information may only be shared with trusted services
                        that help keep HospitoFind running (like hosting or authentication tools) and only when necessary.
                    </p>
                </div>

                <div className={style.section}>
                    <h2>Third-Party Links</h2>
                    <p>
                        HospitoFind may contain links to hospital websites or third-party platforms.
                        We do not control those sites, so please review their privacy policies when you visit them.
                    </p>
                </div>

                <div className={style.section}>
                    <h2>Policy Updates</h2>
                    <p>
                        This Privacy Policy may be updated as HospitoFind evolves.
                        Any updates will be published here along with the latest revision date.
                    </p>
                </div>

                <div className={style.section}>
                    <h2>Contact</h2>
                    <p>
                        Have questions about your privacy or how data is handled?
                        You can reach us anytime at{" "}
                        <a href="mailto:hospitofind@outlook.com" target="_blank" rel="noopener noreferrer">
                            hospitofind@outlook.com
                        </a>.
                    </p>
                </div>

                <p className={style.text}>Thank you for being part of the HospitoFind journey!</p>
            </div>
            <Footer />
        </>
    );
};

export default Policy;
