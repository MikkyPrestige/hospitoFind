import { Link } from "react-router-dom";
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
        <h1 className={style.title}>Privacy Policy for HospitoFind App</h1>
        <p className={style.text}>Welcome to HospitoFind! This Privacy Policy explains how we collect, use, and protect your personal information when you use our app.</p>

        <h2 className={style.title}>What information do we collect?</h2>
        <p className={style.text}>We collect information from you when you register on our app</p>
        <p className={style.text}>When registering on our app, as appropriate, you may be asked to enter your: name, e-mail address, mailing address or phone number. You may, however, visit our app anonymously.</p>

        <h2 className={style.title}>What do we use your information for?</h2>
        <p className={style.text}>Any of the information we collect from you may be used in one of the following ways:</p>
        <ul className={style.list}>
        <li className={style.list_item}>To personalize your experience (your information helps us to better respond to your individual needs)</li>
        <li className={style.list_item}>To improve our app (we continually strive to improve our app offerings based on the information and feedback we receive from you)</li>
        <li className={style.list_item}>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs)</li>
        </ul>

        <h2 className={style.title}>How do we protect your information?</h2>
        <p className={style.text}>We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information.</p>

        <h2 className={style.title}>Do we disclose any information to outside parties?</h2>
        <p className={style.text}>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our app, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our app policies, or protect ours or others rights, property, or safety. However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.</p>

        <h2 className={style.title}>Third party links</h2>
        <p className={style.text}>Occasionally, at our discretion, we may include or offer third party products or services on our app. These third party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our app and welcome any feedback about these sites.</p>

        <h2 className={style.title}>Children's Online Privacy Protection Act Compliance</h2>
        <p className={style.text}>
        We are in compliance with the requirements of COPPA (Children's Online Privacy Protection Act), We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe we may have collected information from your child, please contact us.
        </p>

        <h2 className={style.title}>Online Privacy Policy Only</h2>
        <p className={style.text}>This online privacy policy applies only to information collected through our app and not to information collected offline.</p>

        <h2 className={style.title}>Your Consent</h2>
        <p className={style.text}>By using our app, you consent to our privacy policy.</p>

        <h2 className={style.title}>Changes to our Privacy Policy</h2>
        <p className={style.text}>If we decide to change our privacy policy, we will post those changes on this page.</p>

        <h2 className={style.title}>Contacting Us</h2>
        <p className={style.text}>If there are any questions regarding this privacy policy you may contact us at <mark><a href="mailto: michaelelue117@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        >
            michaelelue117@gmail.com
        </a>
        </mark>
        </p>

        <p className={style.text}>Thank you for using HospitoFind!</p>

        <Link to="/" className={style.link}>Home Page</Link>
        </div>
        <Footer />
        </>
    )
}

export default Policy