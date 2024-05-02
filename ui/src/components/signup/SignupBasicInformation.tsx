import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import { StateTuple } from '@models/generics';


type SignupBasicInformationProps = {
    emailState: StateTuple<string>,
    passwordState: StateTuple<string>,
    confirmPasswordState: StateTuple<string>,
};

export function SignupBasicInformation(props: SignupBasicInformationProps) {
    const { emailState, passwordState, confirmPasswordState } = props;
    const [, setEmail] = emailState;
    const [, setPassword] = passwordState;
    const [, setConfirmPassword] = confirmPasswordState;

    return <div className="flex flex-column w-full align-items-stretch" style={{ gap: "2rem" }}>
        <span className="p-float-label">
            <InputText
                id="email"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setEmail(ev.target.value)}
            />
            <label htmlFor="email">Email</label>
        </span>
        <span className="p-float-label">
            <Password
                feedback={false}
                id="password"
                aria-describedby="password-help"
                onChange={(ev) => setPassword(ev.target.value)}
            />
            <label htmlFor="password">Password</label>
        </span>
        <span className="p-float-label">
            <Password
                feedback={false}
                id="password-confirm"
                aria-describedby="password-confirm-help"
                onChange={(ev) => setConfirmPassword(ev.target.value)}
            />
            <label htmlFor="password-confirm">Confirm Password</label>
        </span>
    </div>;
}
