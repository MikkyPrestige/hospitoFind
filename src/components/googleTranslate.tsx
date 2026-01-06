import { useEffect } from "react";

const GoogleTranslate = () => {
    useEffect(() => {
        const initWidget = () => {
            // @ts-ignore
            if (window.google && window.google.translate) {
                // @ts-ignore
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: "en",
                        // @ts-ignore
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false,
                    },
                    "google_translate_element"
                );
            }
        };

        // 2. Check if script is already in the DOM (from a previous visit)
        const scriptId = "google-translate-script";
        const scriptExists = document.getElementById(scriptId);

        if (!scriptExists) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.type = "text/javascript";
            script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);

            // @ts-ignore
            window.googleTranslateElementInit = initWidget;
        } else {
            initWidget();
        }
    }, []);

    return (
        <div
            id="google_translate_element"
            style={{ display: 'inline-block', minHeight: '20px' }}
        ></div>
    );
};

export default GoogleTranslate;