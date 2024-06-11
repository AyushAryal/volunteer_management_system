import { useEffect, useRef } from "react";
import { Navbar, Hero, Overview, Stats, Footer } from "../components/landing";
import { Toast } from 'primereact/toast';

const Landing = () => {
  const toast = useRef(null);

  useEffect(() => {
    toast.current.show({ severity: 'info', summary: 'Welcome to NDRRMA VMS.', detail: 'Old VMS users can access their accounts by resetting their password and should update their profiles.', life: 10000 });
  }, []);

  return (
    <div>
      <Toast ref={toast} position="top-right" baseZIndex={20} />
      <Navbar />
      <Hero />
      <Overview />
      <Stats />
      <Footer />
    </div>
  );
};

export default Landing;
