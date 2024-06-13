import {  useEffect, useRef, useState } from "react";
import { Navbar, Hero, Overview, Stats, Footer } from "../components/landing";
import { Toast } from 'primereact/toast';
import { VolunteerLoginModal } from "@components/VolunteerLoginButton";

const Landing = () => {
  const toast = useRef<Toast>(null);
  let [modalVisible, setModalVisible] = useState(false);
  let [toastVisible, setToastVisible] = useState(true);

  useEffect(() => {
    const content = (
      <div className="flex flex-column align-items-left" style={{ flex: "1" }}>
        <div className="flex align-items-center gap-2">
          <span className="font-semibold text-900">Welcome to NDRRMA VMS.</span>
        </div>
        <div className="font-medium text-sm mt-3 text-900">
          Old VMS users can access their accounts by resetting their password and should update
          their profiles.
        </div>
        <div className="flex justify-content-end">
          <span
            className="text-sm flex-row text-primary font-italic underline cursor-pointer"
            onClick={() => {
              setModalVisible(true);
              setToastVisible(false);
            }}
          >
            Reset Password
          </span>
        </div>

      </div>
    );
    toast.current?.show({
      severity: "info",
      summary: "Welcome to NDRRMA VMS.",
      detail:
        "Old VMS users can access their accounts by resetting their password and should update their profiles.",
      content,
      life: 10000,
    });
  }, []);

  return (
    <div>
      {toastVisible &&<Toast ref={toast} position="top-right" baseZIndex={20} />}
      { modalVisible &&
        <VolunteerLoginModal
          visible={modalVisible}
          setVisible={setModalVisible}
        />
      }
      <Navbar />
      <Hero />
      <Overview />
      <Stats />
      <Footer />
    </div>
  );
};

export default Landing;
