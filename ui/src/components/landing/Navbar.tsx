import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { VolunteerLoginButton } from "@components/VolunteerLoginButton";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { logo } from "@assets/index"
import { LanguageSelector } from "@components/LanguageSelector";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  let store = useHookstate(storeState);
  const navigate = useNavigate();

  const signupButton = store.token.get() ? null : (
    <Button
      size="small"
      className="mx-1 text-white bg-indigo-800"
      text
      raised
      label={t("Signup")}
      outlined
      onClick={() => navigate("/signup")}
    >
      <FontAwesomeIcon className="ml-2" icon="user-plus" />
    </Button>
  );

  return (
    <section className="absolute z-5 w-full mx-auto">
      <div
        className="w-full flex flex-row flex-wrap px-3 py-1 overflow-hidden justify-content-between"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
      >
        <a href="https://bipad.gov.np/np/" target="_blank">
          <img src={logo} alt="logo" style={{ width: "60%" }} />
        </a>
        <div className="flex flex-wrap align-items-center">
          <div className="px-1">
            <LanguageSelector />
          </div>
          <div className="flex flex-wrap">{signupButton}</div>
          <VolunteerLoginButton />
        </div>
      </div>
    </section>
  );
};

export default Navbar;
