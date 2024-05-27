import { RefObject, useEffect, useState } from 'react';

import { useHookstate } from '@hookstate/core';
import { Map as LeafletMap } from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';

import { get_selected_local_body } from '../../../utils.ts';
import { storeState } from "@models/store.ts";
import { VolunteerLoginButton } from '@components/VolunteerLoginButton.tsx';
import { Tabpage } from '@components/map/sidebar/Tabpage.tsx';

import EmblemOfNepal from '@assets/emblem_of_nepal.svg';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

type SidebarProps = { mapRef: RefObject<LeafletMap> }
export function Sidebar({ mapRef }: SidebarProps) {
  let store = useHookstate(storeState);
  let federal_body = get_selected_local_body(store);
  let startDate = store.mapControls.startDate.get();
  if (startDate) {
    startDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60 * 1000));
  }
  let endDate = store.mapControls.endDate.get();
  if (endDate) {
    endDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60 * 1000));
  }
  const navigate = useNavigate();
  let [visible, setVisible] = useState(true);

  useEffect(() => {
    mapRef.current?.invalidateSize(true);
  }, [visible]);

  return (
    <div
      className={"relative h-screen shadow-3"}
      style={{ width: visible ? "80%" : "0", zIndex: 450 }}
    >
      <div className={`h-full overflow-x-hidden ${visible ? "" : "hidden"}`}>
        <div className="h-full flex flex-column px-3">
          <div className="flex flex-row justify-content-between align-items-center p-2">
            <div
              className="flex align-items-center gap-1 font-semibold text-2xl"
              style={{ color: "var(--red-600)", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <img style={{ width: "4rem" }} src={EmblemOfNepal} alt="Emblem of Nepal" />
              VMS
            </div>
            <div
              className="font-semibold my-1 mx-1 text-xl"
              style={{ color: "var(--primary-color)" }}
            >
              {federal_body?.name ?? "National"}{" "}
            </div>
            <VolunteerLoginButton />
          </div>
          <span className="text-xs font-bold text-300 flex gap-2 align-items-center pt-3 pb-2 pl-2 ">
            <FontAwesomeIcon
              icon={faCalendar}>
            </FontAwesomeIcon>
            Data From {startDate?.toDateString()} - {endDate?.toDateString()}
          </span>
          <Tabpage />
        </div>
      </div>
      <Button
        rounded
        className="absolute shadow-4"
        style={{
          top: "50%",
          right: "-20px",
          width: "40px",
          height: "40px",
          overflow: "visible",
          zIndex: 500,
        }}
        onClick={() => setVisible(!visible)}
      >
        <FontAwesomeIcon
          style={{ margin: "-50%" }}
          icon={`arrow-${visible ? "left" : "right"}`}
        ></FontAwesomeIcon>
      </Button>
    </div>
  );
}
