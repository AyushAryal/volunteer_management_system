import { useState, useEffect } from "react";
import { get_district_detail, get_municipality_detail, get_ward_detail, get_province_detail} from "@api/federal";
import { faHandshake } from "@fortawesome/free-regular-svg-icons";
import { faCakeCandles, faDroplet, faPaperPlane, faPerson, faPersonDress, faPersonHalfDress, faPhone, faTrophy, faFolderOpen, faGraduationCap, faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";


import { get_id } from "@api/utils";
import { District, Municipality, Province, Ward } from "@models/federal";

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
    const [permanentWard, setPermanentWard] = useState<Ward>();
    const [temporaryWard, setTemporaryWard] = useState<Ward>();
    const [permanentMunicipality, setPermanentMunicipality] = useState<Municipality>();
    const [temporaryMunicipality, setTemporaryMunicipality] = useState<Municipality>();
    const [permanentDistrict, setPermanentDistrict] = useState<District>();
    const [temporaryDistrict, setTemporaryDistrict] = useState<District>();
    const [permanentProvince, setPermanentProvince] = useState<Province>();
    const [temporaryProvince, setTemporaryProvince] = useState<Province>();
    const [registrationDistrict, setRegistrationDistrict] = useState<District>();
    useEffect(() => {
      get_ward_detail(get_id(volunteer.volunteer.permanent_ward)).then(
        (ward) => {
          setPermanentWard(ward);
        }
      );
      get_ward_detail(get_id(volunteer.volunteer.temporary_ward)).then(
        (ward) => {
          setTemporaryWard(ward);
        }
      );
      if (volunteer.citizenship !== undefined) {
        get_district_detail(
          get_id(volunteer.citizenship.registration_district)
        ).then((district) => {
          setRegistrationDistrict(district);
        });
      }
    }, [
      volunteer.volunteer.permanent_ward,
      volunteer.volunteer.temporary_ward,
    ]);
    useEffect(() => {
        if (permanentWard !== undefined) {
          get_municipality_detail(get_id(permanentWard.municipality)).then(
            (municipality) => {
              setPermanentMunicipality(municipality);
            }
          );
        }
        if (temporaryWard !== undefined) {
          get_municipality_detail(get_id(temporaryWard.municipality)).then(
            (municipality) => {
              setTemporaryMunicipality(municipality);
            }
          );
        }
    },[permanentWard, temporaryWard]);
    useEffect(() => {
      if (permanentMunicipality !== undefined) {
        get_district_detail(get_id(permanentMunicipality.district)).then(
          (district) => {
            setPermanentDistrict(district);
          }
        );
      }
      if (temporaryMunicipality !== undefined) {
        get_district_detail(get_id(temporaryMunicipality.district)).then(
          (district) => {
            setTemporaryDistrict(district);
          }
        );
      }
    }, [
      permanentMunicipality,
      temporaryMunicipality,
    ]);
    useEffect(() => {
      if (permanentDistrict !== undefined) {
        get_province_detail(get_id(permanentDistrict.province)).then(
          (province) => {
            setPermanentProvince(province);
          }
        );
      }
      if (temporaryDistrict !== undefined) {
        get_province_detail(get_id(temporaryDistrict.province)).then(
          (province) => {
            setTemporaryProvince(province);
          }
        );
      }
    }, [
      permanentDistrict,
      temporaryDistrict,
    ]);
    return (
      <ScrollPanel className="w-full" style={{ height: "75vh" }}>
        <h3>Basic Information</h3>
        <div className="flex flex-row justify-content-between px-4">
          <div className="pb-2">
            <div className="py-2">
              {gender_emoji}
              &nbsp; &nbsp; &nbsp;
              {volunteer.volunteer.first_name} {volunteer.volunteer.last_name}
            </div>
            <div className="pb-2">
              <FontAwesomeIcon className="text-lg" icon={faPaperPlane} />
              &nbsp; &nbsp; &nbsp;
              {volunteer.email}
            </div>
            <div className="pb-2">
              <FontAwesomeIcon className="text-lg" icon={faPhone} />
              &nbsp; &nbsp; &nbsp;
              {volunteer.volunteer.contact_number}
            </div>
            <div className="pb-2">
              <FontAwesomeIcon
                className="text-red-700 text-lg"
                icon={faDroplet}
              />
              &nbsp; &nbsp; &nbsp;
              {volunteer.volunteer.blood_group}
            </div>
            <div className="pb-2">
              <FontAwesomeIcon
                className="text-red-700 text-lg"
                icon={faGraduationCap}
              />
              &nbsp; &nbsp; &nbsp;
              {volunteer.volunteer.academic_qualification}
            </div>
            <div className="pb-2">
              <FontAwesomeIcon
                className="text-orange-200 text-lg"
                icon={faCakeCandles}
              />
              &nbsp; &nbsp; &nbsp;
              {volunteer.volunteer.date_of_birth?.toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <div className="pb-2">
              <FontAwesomeIcon
                className="text-orange-200 text-lg"
                icon={faHandshake}
              />
              &nbsp; &nbsp; &nbsp;
              {volunteer.volunteer.category}
            </div>
          </div>
          <div>
            <img
              className="shadow-4 mb-2"
              src={volunteer.volunteer.profile_image}
              style={{
                width: "8rem",
                height: "8rem",
                objectFit: "cover",
                borderRadius: "100%",
              }}
            />
          </div>
        </div>
        {volunteer.volunteer.organization_name ||
        volunteer.volunteer.organization_phone_number ||
        volunteer.volunteer.organization_website ? (
          <div>
            <Divider />
            <h3>Organization Information</h3>
            <div className="flex flex-row justify-content-around">
              {volunteer.volunteer.organization_name ? (
                <div>{volunteer.volunteer.organization_name}</div>
              ) : (
                <div></div>
              )}
              {volunteer.volunteer.organization_phone_number ? (
                <div>{volunteer.volunteer.organization_phone_number}</div>
              ) : (
                <div></div>
              )}
              {volunteer.volunteer.organization_website ? (
                <div>{volunteer.volunteer.organization_website}</div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        <Divider />
        <h3>
          <FontAwesomeIcon icon={faMapLocationDot} />&nbsp;&nbsp;
          Address Information
        </h3>
        <div className="flex flex-row gap-8 pl-5">
          <div>
            <div className="font-semibold underline">Permanent Address</div>
            <div>{permanentProvince?.name}</div>
            <div>{permanentDistrict?.name}</div>
            <div>{permanentMunicipality?.name}</div>
            <div>{permanentWard?.name}</div>
          </div>
          <div>
            <div className="font-semibold underline">Temporary Address</div>
            <div>{temporaryProvince?.name}</div>
            <div>{temporaryDistrict?.name}</div>
            <div>{temporaryMunicipality?.name}</div>
            <div>{temporaryWard?.name}</div>
          </div>
        </div>
        <Divider />
        <h3>
          <FontAwesomeIcon icon={faFolderOpen} />
          &nbsp; Documents
        </h3>
        <div className="flex flex-column gap-4 pl-3">
          {volunteer.citizenship ? (
            <div className="flex flex-column gap-2">
              <div>
                <span className="font-semibold">Citizenship ID:</span>
                &nbsp;&nbsp;{volunteer.citizenship?.id}
              </div>
              <div>
                <span className="font-semibold">Registration Date:</span>
                &nbsp;&nbsp;
                {volunteer.citizenship?.registration_date.toLocaleDateString(
                  "en-US",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </div>
              <div>
                <span className="font-semibold">Registration District:</span>
                &nbsp;&nbsp;
                {registrationDistrict?.name}
              </div>
              <div className="flex flex-column align-items-center">
                <img
                  src={volunteer.citizenship?.image}
                  style={{
                    width: "60%",
                    objectFit: "cover",
                    borderRadius: "5%",
                  }}
                />
              </div>
            </div>
          ) : (
            ""
          )}

          {volunteer.national_id ? (
            <div className="flex flex-column gap-2">
              <div>
                <span className="font-semibold">National ID:</span>&nbsp;&nbsp;
                {volunteer.national_id?.id}
              </div>
              <div>
                <span className="font-semibold">Registration Date:</span>
                &nbsp;&nbsp;
                {volunteer.national_id?.registration_date.toLocaleDateString(
                  "en-US",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </div>
              <div className="flex flex-column align-items-center">
                <img
                  src={volunteer.national_id?.image}
                  style={{
                    width: "60%",
                    objectFit: "cover",
                    borderRadius: "5%",
                  }}
                />
              </div>
            </div>
          ) : (
            ""
          )}

          {volunteer.passport ? (
            <div className="flex flex-column gap-2">
              <div>
                <span className="font-semibold">Passport ID:</span>&nbsp;&nbsp;
                {volunteer.passport?.id}
              </div>
              <div>
                <span className="font-semibold">Issue Date:</span>&nbsp;&nbsp;
                {volunteer.passport?.issue_date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div>
                <span className="font-semibold">Expiry Date:</span>&nbsp;&nbsp;
                {volunteer.passport?.expiry_date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="flex flex-column align-items-center">
                <img
                  src={volunteer.passport?.image}
                  style={{
                    width: "60%",
                    objectFit: "cover",
                    borderRadius: "5%",
                  }}
                />
              </div>
            </div>
          ) : (
            ""
          )}
          {volunteer.other_identification_document ? (
            <div className="flex flex-column gap-2">
              <div>
                <span className="font-semibold">Other ID:</span>&nbsp;&nbsp;
                {volunteer.other_identification_document?.name}
              </div>
              <div className="flex flex-column align-items-center">
                <img
                  src={volunteer.other_identification_document?.image}
                  style={{
                    width: "60%",
                    objectFit: "cover",
                    borderRadius: "5%",
                  }}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <Divider />
        <h3>
          <FontAwesomeIcon icon={faTrophy} />
          &nbsp; Certificates
        </h3>
        <div className="flex flex-column gap-4 align-items-center">
          {volunteer.certificates.map((certificate, index) => (
            <img
              key={index}
              src={certificate.image}
              style={{
                width: "25rem",
                height: "15rem",
                objectFit: "cover",
                borderRadius: "5%",
              }}
            />
          ))}
        </div>
        <Divider />
      </ScrollPanel>
    );
}

