import { useState } from 'react';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Steps } from 'primereact/steps';
import { faUserPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { UserBasicInformationWidget } from '@components/profile/UserBasicInformationWidget';

import { FormState } from '@api/form.tsx';
import { VolunteerProfileAddressWidget, VolunteerProfileRequiredWidget } from '@components/profile/VolunteerProfileWidget';
import { IdentificationDocumentsWidget } from '@components/profile/IdentificationDocumentsWidget';
import { VolunteerForm, VolunteerFormContext, perform_signup } from '@forms/volunteer';
import { Trans, useTranslation } from 'react-i18next';
import { Dialog } from 'primereact/dialog';

export function Signup() {
    const { t } = useTranslation();
    let [form, setForm] = useState<VolunteerForm>({
        terms_accepted: false,
        email: "",
        password: "",
        confirm_password: "",
        volunteer: {
            url: "",
            user: "",
            profile_image: "",
            first_name: "",
            last_name: "",
            active: true,
            contact_number: "",
            date_of_birth: undefined,
            blood_group: undefined,
            academic_qualification: undefined,
            gender: undefined,
            nationality: undefined,
            category: undefined,
            temporary_ward: null,
            permanent_ward: null,
            point: undefined,
            organization_name: undefined,
            organization_phone_number: undefined,
            organization_website: undefined,
        },
        citizenship: {
            id: undefined,
            registration_date: undefined,
            registration_district: undefined,
            image: undefined,
        },
        passport: {
            id: undefined,
            expiry_date: undefined,
            issue_date: undefined,
            image: undefined,
        },
        national_id: {
            id: undefined,
            registration_date: undefined,
            image: undefined,
        },
        other_identification_document: {
            name: undefined,
            image: undefined,
        },
        certificates: [],
        trainings: [],
    })

    const [formState, setFormState] = useState(FormState.init());
    const [sectionIndex, setSectionIndex] = useState(0);

    let response: undefined | JSX.Element;
    if (formState.hasErrors()) {
        response = <div className="flex flex-row align-items-center">
            {formState.getErrorAsElement()}
        </div >;
    } else if (formState.isSubmitted()) {
        response = <div className="flex flex-row align-items-center mt-5 text-sm text-400" style={{ gap: "0.5rem" }}>
            <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500"
                style={{ fontSize: "2.5rem" }}
            />
            &nbsp; <span> A verification link has been sent to your email. <br /> Please use the link to activate your account. </span>
        </div>;
    }

    const [termsVisible, setTermsVisible] = useState(false);
    const termsAndConditions = (
      <Dialog
        header={t("Terms & Conditions")}
        visible={termsVisible}
        style={{ width: "40vw" }}
        onHide={() => {
          if (!termsVisible) return;
          setTermsVisible(false);
        }}
      >
        <p>
          1. स्वयंसेवकले मानवता, प्रतिबद्धता, स्वामित्व, समावेशिता, ऐक्यबद्धता, निष्पक्षता र तटस्थता
          जस्ता मार्गदर्शक सिद्धान्तको पालना गर्नुपर्नेछ ।
        </p>
        <p>
          2.अन्तराष्ट्रिय मानवीय कानुन र मूल्यमान्यता, प्रचलित कानुन, स्थानीय समुदायका संस्कार,
          लैङ्गिक समता, फरक क्षमता भएका व्यक्तिहरूको आधारभुत अधिकार र मानव अधिकारको रक्षामा
          प्रतिबद्ध हुनुपर्नेछ ।
        </p>
        <p>
          3. विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन कार्यमा संलग्न हुँदा सम्बन्धित ब्युरोसँग समन्वय
          गर्नुपर्नेछ ।
        </p>
        <p>
          4. तोकिएको जिम्मेवारीप्रति जवाफदेही भई पारदर्शी र प्रभावकारी रूपमा परिचालित हुनुपर्नेछ ।
        </p>
        <p>5. स्थानीय स्तरका विपद्का घटनामा स्वत: स्फुर्त स्वयंसेवा गर्नुपर्नेछ ।</p>
        <p>6. प्रत्येक स्वयंसेवक स्वयं सुरक्षित तथा व्यवस्थित हुनुपर्नेछ ।</p>
        <p>7. स्वयंसेवकले असल आचारण प्रदर्शन र सम्मानजनक व्यहार गर्नुपर्नेछ ।</p>
        <p>8. जाति, भाषा, लिङ्ग, वर्ण, आस्था तथा अवस्थाका आधारमा कुनै खालको भेदभाव गर्नुहुँदैन ।</p>
        <p>
          9. स्वयंसेवकले स्थानीय परम्परा, संस्कृतिको ज्ञान राखी तिनको यथोचित सम्मान गर्नुपर्नेछ।
        </p>
        <p>10. लैङ्गिक सम्वेदनशीलताको ज्ञान राखी सोहीअनुसार व्यवहार गर्नुपर्नेछ ।</p>
        <p>
          11. स्वयंसेवा गर्दा आफ्नो अनुचित प्रभाव देखाउने तथा अवाञ्छित सुविधाको खोजी गर्नुहुँदैन ।
        </p>
        <p>
          12. स्वयंसेवकले आफ्नो विवरण सम्बन्धित ब्युरोको सम्पर्कमा रही विपद् सूचना प्रणालीमा
          अद्यावधिक गर्नु/गराउनुपर्नेछ ।
        </p>
        <p>
          13. स्वयंसेवक व्युरो गठन तथा परिचालन कार्यविधि र प्रचलित कानूनमा भएका व्यवस्थाहरू पालना
          गर्नुपर्नेछ ।
        </p>
        <p>14. स्वयंसेवकले आफू खटिएको कार्यक्षेत्रमा प्रतिबद्ध भई सामूहिक कार्यमा लाग्नुपर्नेछ ।</p>
        <p>15. स्वयंसेवक आफैं स्वत: स्फुर्त रुपमा मानवीय सहायताका लागि परिचालित हुनुपर्नेछ ।</p>
        <p>
          16. स्वयंसेवकले स्वयंसेवाका लागि आवश्यकता अनुसार जुनसुकै समयमा पनि तत्परताका साथ परिचालित
          हुनुपर्नेछ ।
        </p>
        <p>17. स्वयंसेवकले कार्यक्षेत्रमा खटिदा आधारभूत मानवीय मूल्यलाई आत्मसात् गर्नुपर्नेछ ।</p>
        <p>
          18. स्वयंसेवकले आफूले सम्पादन गरेको कामको विवरण सम्बन्धित ब्युरोलाई नियमित रूपमा जानकारी
          गराउनु पर्नेछ।
        </p>
        <p>19. स्वयंसेवकले कार्यक्षेत्रमा खटिदा अग्रमुखी शैली अपनाउनु पर्नेछ ।</p>
        <p>
          20. स्वयंसेवकले कार्यक्षेत्रमा खटिदा पीडितलाई आवश्यकतानुसार मनोसामाजिक परामर्श दिनुपर्नेछ।
        </p>
        <p>21. स्वयंसेवक आफ्नो दक्षता अभिवृद्धिका लागि सदैव प्रयत्नशील हुनुपर्नेछ।</p>
        <p>22. स्वयंसेवा गर्दा सक्षमताका साथ आफ्नो ज्ञान, सीप र क्षमताको प्रयोग गर्नुपर्नेछ ।</p>
        <p>23. नि:स्वार्थ भावनालाई स्वयंसेवाको मूलमन्त्र बनाउनुपर्नेछ।</p>
        <p>
          24. स्वयंसेवा “आफ्नो सुरक्षा पहिला (Safety First)”, “परस्पर मद्दत”, “सामुदायिक मद्दत”
          अवधारणामा आधारित भई सुरक्षाससम्बन्धी सबै मापदण्ड पालना गर्नुपर्नेछ।
        </p>
      </Dialog>
    );

    const submitAndFormErrors = (
      <div className="flex flex-column w-full align-items-center">
        <div className="flex flex-row align-items-center justify-content-between w-full">
          <div className="text-sm text-400">
            <Checkbox
              onChange={(e) => setForm({ ...form, terms_accepted: e.checked ?? false })}
              checked={form.terms_accepted}
            />
            <span className="ml-2">
              {" "}
              <Trans
                i18nKey={"Accept Terms & Conditions"}
                values={{terms: t("Terms & Conditions")}}
                components={{
                  span: (
                    <span
                      className="hover:underline cursor-pointer"
                      onClick={() => setTermsVisible(true)}
                    ></span>
                  ),
                }}
              >
                {t("Accept Terms & Conditions", { terms: t("Terms & Conditions") })}
              </Trans>
            </span>
          </div>
          {termsAndConditions}
          <Button
            loading={formState.isLoading()}
            label={t("Submit")}
            disabled={!form.terms_accepted || (formState.isSubmitted() && !formState.hasErrors())}
            onClick={async () => {
              setFormState(FormState.fromLoading(true));
              setFormState(await perform_signup(form));
            }}
          />
        </div>
        {response}
      </div>
    );

    const sections = [
        { label: t("Profile") },
        { label: t("Address") },
        { label: t("Identification") },
        { label: t("Submit") },
    ]

    const PaginationWrapper = (component: JSX.Element) => {
        return <>
            {component}
            <div className="flex flex-row justify-content-between">
                <Button
                    rounded
                    style={{ "visibility": sectionIndex == 0 ? "hidden" : "visible" }}
                    disabled={sectionIndex == 0}
                    onClick={() => { setSectionIndex(sectionIndex - 1); }}
                >
                    <FontAwesomeIcon icon="arrow-left" />
                </Button>
                <Button
                    rounded
                    style={{ "visibility": sectionIndex >= sections.length - 1 ? "hidden" : "visible" }}
                    disabled={sectionIndex >= sections.length - 1}
                    onClick={() => { setSectionIndex(sectionIndex + 1); }}
                >
                    <FontAwesomeIcon icon="arrow-right" />
                </Button>
            </div>
        </>;
    };

    const sectionComponents = [
        <VolunteerProfileRequiredWidget />,
        <VolunteerProfileAddressWidget />,
        <IdentificationDocumentsWidget />,
        <>
            <UserBasicInformationWidget />
            {submitAndFormErrors}
        </>
    ].map(PaginationWrapper);

    return <VolunteerFormContext.Provider value={{ form, setForm }} >
        <div
            className="flex align-items-center py-5"
            style={{
                minHeight: "100vh",
                background: "radial-gradient(var(--red-600) 0%,var(--primary-color) 100%)"
            }}
        >
            <div
                className="mx-auto border-round p-4 px-5"
                style={{
                    maxWidth: "60ch",
                    minWidth: "60ch",
                    backgroundColor: "var(--surface-ground)"
                }}>
                <div className="mx-auto text-center text-2xl mb-5 pb-5 pt-2">
                    <span className="font-semibold" style={{ color: "var(--primary-color)" }}>
                        <FontAwesomeIcon icon={faUserPlus} />&nbsp;
                        Sign Up
                    </span> As &nbsp;
                    <span
                        className="font-semibold"
                        style={{
                            color: "var(--red-600)",
                            borderBottom: "1px solid var(--red-600)"
                        }}
                    >
                        Volunteer
                    </span>
                </div>
                <div className="flex flex-column justify-content-evenly mx-3" style={{ gap: "2rem" }}>
                    <Steps
                        model={sections}
                        activeIndex={sectionIndex}
                        onSelect={(e) => setSectionIndex(e.index)}
                        readOnly={false}
                        pt={{ action: { style: { background: "none" } } }}
                    />
                    {sectionComponents[sectionIndex]}
                </div>
            </div>
        </div >
    </VolunteerFormContext.Provider>;
}
