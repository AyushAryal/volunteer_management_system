import { Button } from "primereact/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { VolunteerLoginButton } from "@components/VolunteerLoginButton";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";

const Navbar = () => {
  let store = useHookstate(storeState);
  const navigate = useNavigate();

  const signupButton = store.token.get() ? null : (
    <Button
      className="mx-1 text-white bg-indigo-800"
      text
      raised
      label="Signup"
      outlined
      onClick={() => navigate("/signup")}
    >
      <FontAwesomeIcon className="pl-1" icon="user-plus" />
    </Button>
  );

  return (
    <div className="bg-indigo-900 h-4rem flex flex-row align-items-center justify-content-between px-3">
      <img src="/src/assets/logo.png" alt="logo" className="h-3rem" />
      <div className="flex flex-row justify-content-end">
        {signupButton}
        <VolunteerLoginButton />
      </div>
    </div>
  );
};

export default Navbar;
