import { FormState } from "@api/form";
import { reset_password } from "@api/incident";
import { describe_api_errors } from "@api/utils";
import { volunteering } from "@assets/index";
import { Footer, Navbar } from "@components/landing";
import { t } from "i18next";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function ResetPasswordModal() {
    let [params, _] = useSearchParams();
    let [password, setPassword] = useState("");

    let [formState, setFormState] = useState(FormState.init());

    const onSubmit = async () => {
        let id = params.get("id");
        let token = params.get("token");
        if (id && token) {
            let response = await reset_password(+id, token, password);
            if (response.ok) {
                setFormState(FormState.fromError("Password reset successfully"));
            } else {
                let error = describe_api_errors(await response.json());
                setFormState(FormState.fromError(error));
            }
        }
    }

    let response = formState.hasErrors() ? formState.getErrorAsElement() : null;

    return <div className="flex flex-column gap-2"><h3>Reset your password</h3>
        <div className="flex flex-column gap-2">
            <label htmlFor="new password">{t("New Password")}</label>
            <Password
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                feedback={false}
                id="new password"
                aria-describedby="password-help"
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        onSubmit();
                    }
                }}
            />
        </div>
        {response}
        <Button
            onClick={onSubmit}
            className="mt-3 shadow-4 border-teal-400 text-white"
            outlined
            size="small"
            label={t("Reset Password")}
        />
    </div>
}


export function ResetPassWord() {
    return <div>
        <Navbar />
        <div
            style={{
                backgroundImage: `url(${volunteering})`,
            }}
            className="flex flex-column h-screen justify-content-center align-items-center bg-cover">
            <div className="flex flex-column w-5 p-5 border-round-3xl text-100 align-items-center"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                <ResetPasswordModal />
            </div>
        </div>
        <Footer />
    </div>
}
