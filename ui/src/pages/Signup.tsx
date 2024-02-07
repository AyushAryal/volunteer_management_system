import { faMap, faPerson, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Password } from 'primereact/password';
import { RadioButton } from 'primereact/radiobutton';

export function Signup() {
    return <div
        className="flex py-5"
        style={{ minHeight: "100vh", background: "radial-gradient(var(--red-600) 0%,var(--primary-color) 100%)" }}
    >
        <div
            className="mx-auto border-round p-4 px-5"
            style={{ maxWidth: "90ch", minWidth: "90ch", backgroundColor: "var(--surface-ground)" }}>
            <div className="mx-auto text-center text-2xl mb-5 pb-5 pt-2">
                <span className="font-semibold" style={{ color: "var(--primary-color)" }}>
                    <FontAwesomeIcon icon={faUserPlus} />&nbsp;
                    Sign Up
                </span> As
                <span className="font-semibold" style={{ color: "var(--red-600)", borderBottom: "1px solid var(--red-600)" }}> Volunteers </span>
            </div>
            <div className="flex flex-row justify-content-evenly mx-3" style={{ gap: "2rem" }}>
                <div className="flex flex-column w-full text-lg align-items-stretch" style={{ gap: "2rem" }}>
                    <div>
                        <FontAwesomeIcon icon={faUser} />&nbsp;
                        Personal Information
                    </div>
                    <span className="p-float-label">
                        <InputText id="email" className="p-inputtext-sm w-full" />
                        <label htmlFor="email">Email</label>
                    </span>
                    <span className="p-float-label">
                        <Password feedback={false} id="password" aria-describedby="password-help" />
                        <label htmlFor="password">Password</label>
                    </span>
                    <span className="p-float-label">
                        <Password feedback={false} id="password-confirm" aria-describedby="password-confirm-help" />
                        <label htmlFor="password-confirm">Confirm Password</label>
                    </span>
                    <span className="p-float-label">
                        <InputText id="first-name" className="p-inputtext-sm w-full" />
                        <label htmlFor="first-name">First Name</label>
                    </span>
                    <span className="p-float-label">
                        <InputText id="last-name" className="p-inputtext-sm w-full" />
                        <label htmlFor="last-name">Last Name</label>
                    </span>
                    <span className="p-float-label">
                        <InputMask id="date-of-birth" mask="9999/99/99" placeholder="yyyy/mm/dd" className="p-inputtext-sm w-full"></InputMask>
                        <label htmlFor="date-of-birth">Date of birth (yyyy/mm/dd)</label>
                    </span>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton inputId="male" name="male" value="Male" />
                            <label htmlFor="male" className="ml-2">Male</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="female" name="female" value="Female" />
                            <label htmlFor="female" className="ml-2">Female</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="other" name="other" value="Other" />
                            <label htmlFor="other" className="ml-2">Other</label>
                        </div>
                    </div>
                </div>
                <div className="flex flex-column w-full align-items-center">
                    <div className="flex flex-column w-full text-lg">
                        <div>
                            <FontAwesomeIcon icon={faMap} />&nbsp;
                            Address Information
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div >;
}
