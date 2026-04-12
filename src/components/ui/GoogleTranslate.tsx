import { useEffect } from "react";
import { FiGlobe } from "react-icons/fi";
import styles from "./styles/translate.module.css";

declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

const GoogleTranslate = () => {
    useEffect(() => {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    autoDisplay: false,
                },
                'google_translate_element'
            );
        };

        const scriptId = "google-translate-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        const googleSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement;

        if (googleSelect) {
            googleSelect.value = lang;
            googleSelect.dispatchEvent(new Event('change'));
        }
    };

    return (
        <div className={styles.langSelector}>
            <FiGlobe className={styles.globe_icon} size={20} />
            <select
                onChange={handleLanguageChange}
                className={styles.nativeSelect}
                aria-label="Select Language"
            >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh-CN">Chinese</option>
                <option value="ar">Arabic</option>
            </select>

            <div id="google_translate_element" style={{ display: 'none' }}></div>
        </div>
    );
};

export default GoogleTranslate;