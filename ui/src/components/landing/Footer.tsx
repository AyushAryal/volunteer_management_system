import "@styles/footer.css";

const Footer = () => {
  return (
    <section className="relative w-full h-auto mx-auto bg-gray-800 px-8 py-3">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
