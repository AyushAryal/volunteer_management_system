import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function SideBar() {
    let [show, setShow] = useState(false);

    return <div className={"relative h-full shadow-3"} style={{ width: show ? "50%" : "0", zIndex: 450 }}>
        <div className={show ? "" : "hidden"}>
            <div className="flex flex-column flex-wrap px-5">
                <h1 className="font-light"> Municipality </h1>
                <div className="flex flex-row justify-content-around">
                    <Card className="bg-primary text-white"> Incidents </Card>
                    <Card className="bg-primary"> Volunteers </Card>
                </div>
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
                zIndex: 500
            }}
            onClick={() => setShow((show) => !show)}
        >
            <FontAwesomeIcon icon={`arrow-${show ? "left" : "right"}`}></FontAwesomeIcon>
        </Button>
    </div>;
}
