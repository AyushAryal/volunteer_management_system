import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import { VolunteerFormContext } from '@forms/volunteer';
import { useContext } from 'react';

export function UserBasicInformation() {
    let { form, setForm } = useContext(VolunteerFormContext);

    return <div className="flex flex-column w-full align-items-stretch" style={{ gap: "2rem" }}>
        <span className="p-float-label">
            <InputText
                value={form.email}
                id="email"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setForm({ ...form, email: ev.target.value })}
            />
            <label htmlFor="email">Email</label>
        </span>
        <span className="p-float-label">
            <Password
                value={form.password}
                id="password"
                aria-describedby="password-help"
                feedback={false}
                onChange={(ev) => setForm({ ...form, password: ev.target.value })}
            />
            <label htmlFor="password">Password</label>
        </span>
        <span className="p-float-label">
            <Password
                value={form.confirm_password}
                id="password-confirm"
                aria-describedby="password-confirm-help"
                feedback={false}
                onChange={(ev) => setForm({ ...form, confirm_password: ev.target.value })}
            />
            <label htmlFor="password-confirm">Confirm Password</label>
        </span>
    </div>;
}
