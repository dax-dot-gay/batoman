import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as langEn from "../lang/en.json";

i18n.use(initReactI18next).init({
    fallbackLng: "en",
    resources: {
        en: {
            translation: langEn,
        },
    },
});

export default i18n;
