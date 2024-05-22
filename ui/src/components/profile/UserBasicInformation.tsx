import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import { StateTuple } from '@models/generics';


type UserBasicInformationProps = {
    emailState: StateTuple<string>,
    passwordState: StateTuple<string>,
    confirmPasswordState: StateTuple<string>,
};

export function UserBasicInformation(props: UserBasicInformationProps) {
    const { emailState, passwordState, confirmPasswordState } = props;
    const [email, setEmail] = emailState;
    const [password, setPassword] = passwordState;
    const [confirmPassword, setConfirmPassword] = confirmPasswordState;

    return <div className="flex flex-column w-full align-items-stretch" style={{ gap: "2rem" }}>
        <span className="p-float-label">
            <InputText
                value={email}
                id="email"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setEmail(ev.target.value)}
            />
            <label htmlFor="email">Email</label>
        </span>
        <span className="p-float-label">
            <Password
                value={password}
                id="password"
                aria-describedby="password-help"
                feedback={false}
                onChange={(ev) => setPassword(ev.target.value)}
            />
            <label htmlFor="password">Password</label>
        </span>
        <span className="p-float-label">
            <Password
                value={confirmPassword}
                id="password-confirm"
                aria-describedby="password-confirm-help"
                feedback={false}
                onChange={(ev) => setConfirmPassword(ev.target.value)}
            />
            <label htmlFor="password-confirm">Confirm Password</label>
        </span>
    </div>;
}
