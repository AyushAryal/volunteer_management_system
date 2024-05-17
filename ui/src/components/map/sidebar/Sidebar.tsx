import { RefObject, useEffect, useState } from 'react';

import { useHookstate } from '@hookstate/core';
import { Map as LeafletMap } from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from 'primereact/button';

import { get_selected_local_body } from '../../../utils.ts';
import { storeState } from "@models/store.ts";
import { VolunteerLoginButton } from '@components/VolunteerLoginButton.tsx';
import { Tabpage } from '@components/map/sidebar/Tabpage.tsx';


type SidebarProps = { mapRef: RefObject<LeafletMap> }
export function Sidebar({ mapRef }: SidebarProps) {
    let store = useHookstate(storeState);
    let federal_body = get_selected_local_body(store);

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
            <div className="flex flex-row py-1 mb-1 justify-content-center">
              <div
                className="absolute font-semibold my-1 mx-3 left-0 text-xl"
                style={{ color: "#BB0A21" }}
                >
                VMS
              </div>
              <div
                className="font-semibold my-1 mx-1 text-xl"
                style={{ color: "#4B88A2" }}
              >
                {federal_body?.name ?? "National"}{" "}
              </div>

              <div className="absolute right-0 mr-2">
                <VolunteerLoginButton />
              </div>
            </div>
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
