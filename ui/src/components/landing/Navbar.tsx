import {Button} from "primereact/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();
    return (
      <div className="bg-indigo-900 h-4rem flex flex-row align-items-center justify-content-between px-3">
        <img src="/src/assets/logo.png" alt="logo" className="h-3rem" />
        <div className="flex flex-row justify-content-end">
          <Button
            className="mx-1 text-white bg-indigo-800"
            text raised
            label="Signup"
            onClick={() => navigate("/signup")}
          >
            <FontAwesomeIcon className="pl-1 text-red-500" icon="user-plus"/>
          </Button>
          <Button
            className="mx-1 text-white bg-indigo-800"
            text raised
            label="Login"
            onClick={() => navigate("/login")}
          >
            <FontAwesomeIcon className="pl-1 text-red-500" icon="right-to-bracket" />
          </Button>
        </div>
      </div>
    );
}

export default Navbar  