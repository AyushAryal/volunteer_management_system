import "@styles/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-auto mx-auto bg-gray-800 md:px-8 py-3 px-3">
      <div className="flex flex-row flex-wrap justify-content-between">
        <div className="flex flex-column px-2">
          <h3 className="text-white">{t("Useful Resources")}</h3>
          <div>
            <li className="mb-2">
              <a className="link text-md" href="#">
                {t("User Manual")}
              </a>
            </li>
            <li className="mb-2">
              <a className="link text-md" href="#">
                {t("Volunteer Guidelines")}
              </a>
            </li>
          </div>
        </div>

        <div className="flex flex-column px-2">
          <h3 className="text-white">{t("Quick Links")}</h3>
          <div>
            <li className="mb-2">
              <a className="link text-md" href="#">
                {t("Home")}
              </a>
            </li>
            <li className="mb-2">
              <a className="link text-md" href="/dashboard">
                {t("Dashboard")}
              </a>
            </li>
            <li className="mb-2">
              <a className="link text-md" href="/signup">
                {t("Signup")}
              </a>
            </li>
          </div>
        </div>

        <div className="flex flex-column px-2">
          <h3 className="text-white">{t("Useful Links")}</h3>
          <div>
            <li className="mb-2">
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                {t("NDRRMA")}
              </a>
            </li>
            <li className="mb-2">
              <a
                className="link text-md"
                href="https://bipadportal.gov.np/"
                target="_blank"
              >
                {t("Bipad Portal")}
              </a>
            </li>
            <li className="mb-2">
              <a
                className="link text-md"
                href="https://exposure.ndrrma.gov.np"
                target="_blank"
              >
                {t("Building Exposure")}
              </a>
            </li>
            <li className="mb-2">
              <a
                className="link text-md"
                href="https://godam.ndrrma.gov.np/dashboard"
                target="_blank"
              >
                {t("Godam")}
              </a>
            </li>
            <li className="mb-2">
              <a className="link text-md" href="#" target="_blank">
                {t("E-learning")}
              </a>
            </li>
          </div>
        </div>

        <div className="flex flex-column px-2">
          <h3 className="text-white">{t("Contact Details")}</h3>
          <div>
            <li className="mb-2">
              <FontAwesomeIcon icon="landmark-dome" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                {t("NDRRMA")}
              </a>
            </li>
            <li className="mb-2">
              <FontAwesomeIcon icon="magnifying-glass" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                {t("Singhadurbar, Kathmandu, Nepal")}
              </a>
            </li>
            <li className="mb-2">
              <FontAwesomeIcon icon="envelope" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                {t("P.O. Box no. 213213")}
              </a>
            </li>
            <li className="mb-2">
              <FontAwesomeIcon icon="phone" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                {t("info@bipad.gov.np")}
              </a>
            </li>
            {/* <li className="mb-2">
              <FontAwesomeIcon icon="at" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                Email: info@bipad.gov.np
              </a>
            </li> */}
            <li className="mb-2">
              <FontAwesomeIcon icon="globe" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                {t("Web Link: www.bipad.gov.np")}
              </a>
            </li>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
