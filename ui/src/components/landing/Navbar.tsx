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
    <div className="w-full bg-indigo-900 flex flex-row flex-wrap align-items-center justify-content-between px-3 py-2 overflow-hidden">
      <a href="https://bipad.gov.np/np/" target="_blank">
        <img src={logo} alt="logo" className="h-3rem" style={{width: "100%"}} />
      </a>
      <div className="flex flex-row justify-content-end">
        <div className="pt-2"><LanguageSelector /></div>
        <div className="flex flex-wrap pl-1">{signupButton}</div>
        <VolunteerLoginButton />
      </div>
    </div>
  );
};

export default Navbar;
