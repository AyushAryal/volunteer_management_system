import "@styles/footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  return (
    <section className="relative w-full h-auto mx-auto bg-gray-800 md:px-8 py-3 px-3">
      <div className="flex flex-row flex-wrap justify-content-between">
        <div className="flex flex-column px-2">
          <h3 className="text-white">Useful Resources</h3>
          <div>
            <li className="mb-2">
              <a className="link text-md" href="#">
                User Manual
              </a>
            </li>
            <li className="mb-2">
              <a className="link text-md" href="#">
                Volunteer Guidelines
              </a>
            </li>
          </div>
        </div>

        <div className="flex flex-column px-2">
          <h3 className="text-white">Quick Links</h3>
          <div>
            <li className="mb-2">
              <a className="link text-md" href="#">
                Home
              </a>
            </li>
            <li className="mb-2">
              <a className="link text-md" href="/dashboard">
                Dashboard
              </a>
            </li>
            <li className="mb-2">
              <a className="link text-md" href="/signup">
                Signup
              </a>
            </li>
          </div>
        </div>

        <div className="flex flex-column px-2">
          <h3 className="text-white">Useful Links</h3>
          <div>
            <li className="mb-2">
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                NDRRMA
              </a>
            </li>
            <li className="mb-2">
              <a
                className="link text-md"
                href="https://bipadportal.gov.np/"
                target="_blank"
              >
                Bipad Portal
              </a>
            </li>
            <li className="mb-2">
              <a
                className="link text-md"
                href="https://exposure.ndrrma.gov.np"
                target="_blank"
              >
                Building Exposure
              </a>
            </li>
            <li className="mb-2">
              <a
                className="link text-md"
                href="https://godam.ndrrma.gov.np/dashboard"
                target="_blank"
              >
                Godam
              </a>
            </li>
            <li className="mb-2">
              <a className="link text-md" href="#" target="_blank">
                E-learning
              </a>
            </li>
          </div>
        </div>

        <div className="flex flex-column px-2">
          <h3 className="text-white">Contact Details</h3>
          <div>
            <li className="mb-2">
              <FontAwesomeIcon icon="landmark-dome" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                NDRRMA
              </a>
            </li>
            <li className="mb-2">
              <FontAwesomeIcon icon="magnifying-glass" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                Singhadurbar, Kathmandu, Nepal
              </a>
            </li>
            <li className="mb-2">
              <FontAwesomeIcon icon="envelope" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                P.O. Box no. 213213
              </a>
            </li>
            <li className="mb-2">
              <FontAwesomeIcon icon="phone" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                info@bipad.gov.np
              </a>
            </li>
            <li className="mb-2">
              <FontAwesomeIcon icon="at" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                Email: info@bipad.gov.np
              </a>
            </li>
            <li className="mb-2">
              <FontAwesomeIcon icon="globe" className="mr-2 text-red-400" />
              <a
                className="link text-md"
                href="https://bipad.gov.np/"
                target="_blank"
              >
                Web Link: www.bipad.gov.np
              </a>
            </li>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
