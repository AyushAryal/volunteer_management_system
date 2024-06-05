import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { LocationSelector } from '@components/LocationSelector';
import { useContext, useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { VolunteerFormContext } from '@forms/volunteer';
import L, { LatLngBounds, LatLngTuple } from 'leaflet';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Ward } from '@models/federal';
import { get_ward_detail } from '@api/federal';
import { get_id } from '@api/utils';
import { Polygon } from 'react-leaflet/Polygon';
import { useMap, useMapEvents } from 'react-leaflet/hooks';
import { Marker } from 'react-leaflet/Marker';
import { Tooltip } from 'react-leaflet/Tooltip';
import { useTranslation } from 'react-i18next';

type PointPickerProps = {
    label: string,
    value: LatLngTuple | undefined,
    onChange: (point: LatLngTuple | undefined) => void
}

function PointPicker(props: PointPickerProps) {
    let [point, setPoint] = useState<LatLngTuple | undefined>(props.value);

    useMapEvents({
        click: (event) => {
            let point: LatLngTuple;
            if (Array.isArray(event.latlng)) {
                point = [event.latlng[0], event.latlng[1]];
            } else {
                point = [event.latlng.lat, event.latlng.lng];
            }
            setPoint(point);
            props.onChange(point);
        }
    });

    if (point) {
        return <Marker
            position={point}
            eventHandlers={{
                click: () => {
                    setPoint(undefined);
                    props.onChange(undefined);
                }
            }}
        >
            <Tooltip sticky>
                {props.label}
            </Tooltip>
        </Marker>
    }
    return null;
}

type SelectedWardMapPolygonProps = {
    ward: string | null,
}

function SelectedWardMapPolygon(props: SelectedWardMapPolygonProps) {
    const mapRef = useMap();
    let [ward, setWard] = useState<Ward>();
    useEffect(() => {
        let network_request = async () => {
            let bbox = [26, 80, 31, 89];
            if (props.ward) {
                let ward_ = await get_ward_detail(get_id(props.ward));
                setWard(ward_);
                bbox = ward_.shape.bbox;
            } else {
                setWard(undefined);
            }
            let bounds = new LatLngBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
            mapRef.flyToBounds(bounds, { duration: 0.5 });
        }
        network_request();
    }, [props.ward]);
    if (ward) {
        return <Polygon
            positions={ward.shape.coordinates}
            color="blue"
            weight={1}
            pane="overlayPane"
        />;
    }
    return null;
}

export function VolunteerProfileAddressWidget() {
    let { form, setForm } = useContext(VolunteerFormContext);
    let [selectedTemporaryProvince, setTemporaryProvince] = useState<string | null>(null);
    let [selectedTemporaryDistrict, setTemporaryDistrict] = useState<string | null>(null);
    let [selectedTemporaryMunicipality, setTemporaryMunicipality] = useState<string | null>(null);

    let [selectedPermanentProvince, setPermanentProvince] = useState<string | null>(null);
    let [selectedPermanentDistrict, setPermanentDistrict] = useState<string | null>(null);
    let [selectedPermanentMunicipality, setPermanentMunicipality] = useState<string | null>(null);

    const temporaryLocationSelector = <LocationSelector
        selectedProvince={selectedTemporaryProvince}
        onChangeSelectedProvince={setTemporaryProvince}
        selectedDistrict={selectedTemporaryDistrict}
        onChangeSelectedDistrict={setTemporaryDistrict}
        selectedMunicipality={selectedTemporaryMunicipality}
        onChangeSelectedMunicipality={setTemporaryMunicipality}
        selectedWard={form.volunteer.temporary_ward}
        onChangeSelectedWard={(ward) => setForm({
            ...form,
            volunteer: {
                ...form.volunteer,
                temporary_ward: ward
            }
        })}
        className="flex-column"
    />;

    const permanentLocationSelector = <LocationSelector
        selectedProvince={selectedPermanentProvince}
        onChangeSelectedProvince={setPermanentProvince}
        selectedDistrict={selectedPermanentDistrict}
        onChangeSelectedDistrict={setPermanentDistrict}
        selectedMunicipality={selectedPermanentMunicipality}
        onChangeSelectedMunicipality={setPermanentMunicipality}
        selectedWard={form.volunteer.permanent_ward}
        onChangeSelectedWard={(ward) => setForm({
            ...form,
            volunteer: {
                ...form.volunteer,
                permanent_ward: ward
            }
        })}
        className="flex-column"
    />;

    const map = <MapContainer
        bounds={new LatLngBounds([[26, 80], [31, 89]])}
        style={{ width: "100%", height: "300px" }}
        preferCanvas={true}
        renderer={L.canvas()}
    >
        <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SelectedWardMapPolygon ward={form.volunteer.temporary_ward} />
        <PointPicker label="Your location (click to remove)" value={form.volunteer.point} onChange={(latlng) => {
            setForm({
                ...form,
                volunteer: {
                    ...form.volunteer,
                    point: latlng,
                }
            })
        }} />
    </MapContainer>
    const { t } = useTranslation();
    return <div className="flex flex-column w-full" style={{ gap: "1rem" }}>
        <div className="font-semibold">
            {t("Permanent Address")} <span className="text-red-500">*</span>
        </div>
        {permanentLocationSelector}
        <div className="font-semibold">
            {t("Temporary Address")} <span className="text-red-500">*</span>
        </div>
        {temporaryLocationSelector}
        <span className="font-semibold">{t("Geolocation")}</span>
        <span className="text-sm font-semibold text-red-700">
            {t("DISCLAIMER")}
        </span>
        {map}
    </div>;

}


export function VolunteerProfileOrganizationWidget() {
    let { form, setForm } = useContext(VolunteerFormContext);

    return <div
        className="flex flex-column w-full align-items-stretch"
        style={{ gap: "2rem" }}
    >
        <span className="p-float-label">
            <InputText
                value={form.volunteer.organization_name}
                id="organization-name"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setForm({
                    ...form,
                    volunteer: {
                        ...form.volunteer,
                        organization_name: ev.target.value,
                    }
                })}
            />
            <label htmlFor="organization-name">
                Organization Name <span className="text-xs">(optional)</span>
            </label>
        </span>

        <span className="p-float-label">
            <InputMask
                value={form.volunteer.organization_phone_number}
                id="organization-phone-number"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setForm({
                    ...form,
                    volunteer: {
                        ...form.volunteer,
                        organization_phone_number: ev.target.value ?? "",
                    }
                })}
                mask="(+999)-9999999999"
            />
            <label htmlFor="organization-phone-number">
                Organization Phone Number{" "}
                <span className="text-xs">(optional)</span>
            </label>
        </span>

        <span className="p-float-label">
            <InputText
                value={form.volunteer.organization_website}
                id="organization-website"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setForm({
                    ...form,
                    volunteer: {
                        ...form.volunteer,
                        organization_website: ev.target.value,
                    }
                })}
            />
            <label htmlFor="organization-website">
                Organization Website <span className="text-xs">(optional)</span>
            </label>
        </span>
    </div >;

}

export function VolunteerProfileRequiredWidget() {
    let { form, setForm } = useContext(VolunteerFormContext);

    const bloodGroups = [
        { value: "O Negative" },
        { value: "O Positive" },
        { value: "A Negative" },
        { value: "A Positive" },
        { value: "B Negative" },
        { value: "B Positive" },
        { value: "AB Negative" },
        { value: "AB Positive" },
    ];

    const academicQualifications = [
        { value: "Secondary Level" },
        { value: "High School" },
        { value: "Under Grad" },
        { value: "Grad" },
        { value: "Doctorate" },
        { value: "Post Doc" }
    ]

    const nationalities = [
        { value: "National" },
        { value: "International" },
    ];


    const volunteerCategories = [
        { value: "Student" },
        { value: "Scout" },
        { value: "Retired APF" },
        { value: "Retired Army" },
        { value: "Retired Government Service" },
        { value: "Senior Citizen" },
        { value: "Community" },
        { value: "General" },
    ];

    const { t } = useTranslation();
    return (
      <div>
        <div
          className="flex flex-column w-full align-items-stretch"
          style={{ gap: "2rem" }}
        >
          <span className="p-float-label">
            <InputText
              value={form.volunteer.first_name}
              id="first-name"
              className="p-inputtext-sm w-full"
              onChange={(ev) =>
                setForm({
                  ...form,
                  volunteer: {
                    ...form.volunteer,
                    first_name: ev.target.value,
                  },
                })
              }
            />
            <label htmlFor="first-name">
              {t("First Name")} <span className="text-sm text-red-500">*</span>
            </label>
          </span>
          <span className="p-float-label">
            <InputText
              value={form.volunteer.last_name}
              id="last-name"
              className="p-inputtext-sm w-full"
              onChange={(ev) =>
                setForm({
                  ...form,
                  volunteer: {
                    ...form.volunteer,
                    last_name: ev.target.value,
                  },
                })
              }
            />
            <label htmlFor="last-name">
              {t("Last Name")} <span className="text-sm text-red-500">*</span>
            </label>
          </span>
          <FloatLabel>
            <InputMask
              value={form.volunteer.contact_number}
              id="contact-number"
              mask="(+999)-9999999999"
              className="p-inputtext-sm w-full"
              onChange={(ev) =>
                setForm({
                  ...form,
                  volunteer: {
                    ...form.volunteer,
                    contact_number: ev.target.value ?? "",
                  },
                })
              }
            />
            <label htmlFor="contact-number">
              {t("Contact Number")}{" "}
              <span className="text-sm text-red-500">*</span>
            </label>
          </FloatLabel>
          <FloatLabel>
            <Calendar
              className="w-full"
              id="date-of-birth"
              value={form.volunteer.date_of_birth}
              onChange={(ev) =>
                setForm({
                  ...form,
                  volunteer: {
                    ...form.volunteer,
                    date_of_birth: ev.target.value ?? undefined,
                  },
                })
              }
              dateFormat="yy-mm-dd"
              showIcon
              mask="9999-99-99"
            />
            <label htmlFor="date-of-birth">
              {t("Date of birth (yyyy-mm-dd)")}{" "}
              <span className="text-sm text-red-500">*</span>
            </label>
          </FloatLabel>
          <div className="flex flex-wrap gap-3">
            <div className="flex align-items-center">
              <RadioButton
                inputId="male"
                name="male"
                value="Male"
                checked={form.volunteer.gender === "Male"}
                onChange={(ev) =>
                  setForm({
                    ...form,
                    volunteer: {
                      ...form.volunteer,
                      gender: ev.value,
                    },
                  })
                }
              />
              <label htmlFor="male" className="ml-2 text-gray-800">
                {t("Male")}
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="female"
                name="female"
                value="Female"
                checked={form.volunteer.gender === "Female"}
                onChange={(ev) =>
                  setForm({
                    ...form,
                    volunteer: {
                      ...form.volunteer,
                      gender: ev.value,
                    },
                  })
                }
              />
              <label htmlFor="female" className="ml-2 text-gray-800">
                {t("Female")}
              </label>
            </div>
            <div className="flex align-items-center">
              <RadioButton
                inputId="other"
                name="other"
                value="Other"
                checked={form.volunteer.gender === "Other"}
                onChange={(ev) =>
                  setForm({
                    ...form,
                    volunteer: {
                      ...form.volunteer,
                      gender: ev.value,
                    },
                  })
                }
              />
              <label htmlFor="other" className="ml-2 text-gray-800">
                {t("Other")}
              </label>
            </div>
          </div>
          <Dropdown
            value={form.volunteer.blood_group}
            onChange={(ev) =>
              setForm({
                ...form,
                volunteer: {
                  ...form.volunteer,
                  blood_group: ev.value,
                },
              })
            }
            options={bloodGroups}
            placeholder={t("Select a blood group")}
            optionLabel="value"
          />

          <Dropdown
            value={form.volunteer.academic_qualification}
            onChange={(ev) =>
              setForm({
                ...form,
                volunteer: {
                  ...form.volunteer,
                  academic_qualification: ev.value,
                },
              })
            }
            options={academicQualifications}
            placeholder={t("Select an academic qualification")}
            optionLabel="value"
          />
          <Dropdown
            value={form.volunteer.nationality}
            onChange={(ev) =>
              setForm({
                ...form,
                volunteer: {
                  ...form.volunteer,
                  nationality: ev.value,
                },
              })
            }
            options={nationalities}
            placeholder={t("Select a Nationality")}
            optionLabel="value"
          />
          <Dropdown
            value={form.volunteer.category}
            onChange={(ev) =>
              setForm({
                ...form,
                volunteer: {
                  ...form.volunteer,
                  category: ev.value,
                },
              })
            }
            options={volunteerCategories}
            placeholder={t("Select a category")}
            optionLabel="value"
          />
        </div>
      </div>
    );
}


export function VolunteerProfileWidget() {
    const { t } = useTranslation();
    return (
        <div>
            <VolunteerProfileRequiredWidget />
            <h2> {t("Organization Information")} </h2>
            <VolunteerProfileOrganizationWidget />
            <h2> {t("Address Information")} </h2>
            <VolunteerProfileAddressWidget />
        </div>
    );
}
