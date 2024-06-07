
import { useTranslation } from "react-i18next";

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const lng = i18n.language;
  return (
    <div className="flex">
      <button
        className={lng === "en" ? "engButton selectedLanguage" : "engButton"}
        onClick={() => changeLanguage("en")}
      >
        En
      </button>
      <button
        className={lng === "ne" ? "nepButton selectedLanguage" : "nepButton"}
        onClick={() => changeLanguage("ne")}
      >
        ने
      </button>
    </div>
  );
};

