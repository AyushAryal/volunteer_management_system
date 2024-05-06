import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();
    return (
      <div className="bg-indigo-900 h-4rem flex flex-row align-items-center justify-content-between px-3">
        <img src="/src/assets/logo.png" alt="logo" className="h-3rem" />
        <div className="flex flex-row justify-content-end">
          <Button className="mx-1" label="Signup" outlined onClick={() => navigate("/signup")}>
            <FontAwesomeIcon className="pl-1" icon="user-plus" />
          </Button>
          <Button className="mx-1" label="Login" outlined onClick={() => navigate("/login")}>
            <FontAwesomeIcon className="pl-1" icon="right-to-bracket" />
          </Button>
        </div>
      </div>
    );
}

export default Navbar  