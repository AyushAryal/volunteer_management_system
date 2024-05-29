
import { faHandshake } from "@fortawesome/free-regular-svg-icons";
import { faCakeCandles, faDroplet, faPaperPlane, faPen, faPerson, faPersonDress, faPersonHalfDress, faPhone, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";



export function Profile() {
    let volunteer = useHookstate(storeState.volunteer).get();
    if (volunteer === null) {
        return 0;
    }
    let gender_emoji;
    if (volunteer.volunteer.gender == "Male") {
        gender_emoji = <FontAwesomeIcon className="text-lg" icon={faPerson} />
    }
    else if (volunteer.volunteer.gender == "Female") {
        gender_emoji = <FontAwesomeIcon className="text-lg" icon={faPersonDress} />
    }
    else { gender_emoji = <FontAwesomeIcon className="text-lg" icon={faPersonHalfDress} /> }

    return (
        <ScrollPanel className="w-full" style={{ height: "75vh" }}>
            <h3>Basic Information</h3>
            <div className="flex flex-row justify-content-between px-4">
                <div className="pb-2">
                    <div className="py-2">
                        {gender_emoji}
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        {volunteer.volunteer.first_name} {volunteer.volunteer.last_name}
                    </div >
                    <div className="pb-2">
                        <FontAwesomeIcon className="text-lg" icon={faPaperPlane} />
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        {volunteer.email}
                    </div>
                    <div className="pb-2">
                        <FontAwesomeIcon className="text-lg" icon={faPhone} />
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        {volunteer.volunteer.contact_number}</div>
                    <div className="pb-2">
                        <FontAwesomeIcon className="text-red-700 text-lg" icon={faDroplet} />
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        {volunteer.volunteer.blood_group}</div>
                    <div className="pb-2">
                        <FontAwesomeIcon className="text-red-700 text-lg" icon={faPen} />
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        {volunteer.volunteer.academic_qualification}</div>
                    <div className="pb-2">
                        <FontAwesomeIcon className="text-orange-200 text-lg" icon={faCakeCandles} />
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        {volunteer.volunteer.date_of_birth?.toDateString()}</div>
                    <div className="pb-2">
                        <FontAwesomeIcon className="text-orange-200 text-lg" icon={faHandshake} />
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        {volunteer.volunteer.category}</div>
                </div>
                <div>
                    <img
                        className="shadow-4 mb-2"
                        src={volunteer.volunteer.profile_image}
                        style={{
                            width: "8rem",
                            height: "8rem",
                            objectFit: "cover",
                            borderRadius: "100%"
                        }}
                    />
                </div>
            </div>
            <Divider />

            <h3>
                <FontAwesomeIcon icon={faTrophy} />
                &nbsp;
                Certificates</h3>
            <div className="flex flex-column gap-4 align-items-center">{volunteer.certificates.map((certificate, index) => (
                <img

                    key={index}
                    src={certificate.image}
                    style={{
                        width: "25rem",
                        height: "15rem",
                        objectFit: "cover",
                        borderRadius: "5%",
                    }} />
            ))}</div>
            <Divider />
        </ScrollPanel>
    );
}

