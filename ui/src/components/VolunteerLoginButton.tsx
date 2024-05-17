import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import { ReactNode, useRef, useState } from 'react';

import EmblemOfNepal from '../emblem_of_nepal.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faUser, faRightFromBracket, faEdit, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useHookstate } from '@hookstate/core';
import { Token, storeState } from '@models/store';
import { login, logout } from '@api/token';
import { Menu } from 'primereact/menu';
import { MenuItem, MenuItemOptions } from 'primereact/menuitem';
import { VolunteerProfileUpdate } from './profile/VolunteerProfileUpdate';
import { get_volunteer_profile } from '@api/incident.ts';
import { describe_api_errors } from '@api/utils';
import { FormState } from '@api/form.tsx';

export function VolunteerProfileMenu() {
    const store = useHookstate(storeState);
    let profile = store.volunteerProfile.get();


    const menu = useRef<Menu>(null);
    const [volunteerProfileEditVisible, setVolunteerProfileEditVisible] = useState(false);

    const itemRenderer = (item: MenuItem, options: MenuItemOptions): ReactNode => {
        return <div className='p-menuitem-content'>
            <a
                className="flex align-items-center p-menuitem-link"
                onClick={(e) => options.onClick(e)}
            >
                <FontAwesomeIcon icon={item.icon} />
                <span className="mx-2">{item.label}</span>
            </a>
        </div>;
    }

    const menuItems: MenuItem[] = [{
        label: 'Edit Profile',
        icon: faEdit,
        template: itemRenderer,
        command: (_) => setVolunteerProfileEditVisible(true),
    }, {
        label: 'Logout',
        icon: faSignOut,
        template: itemRenderer,
        command: (_) => logout(store),
    }];

    if (profile === null) {
        return <Button onClick={() => logout(store)} >
            <FontAwesomeIcon icon={faRightFromBracket} /> &nbsp; Logout
        </Button>;
    }

    return <div className="flex flex-row">
        <img
            onClick={(event) => menu?.current?.toggle(event)}
            className="shadow-4 mb-2"
            src={profile.profile_image}
            style={{
                width: "3rem",
                height: "3rem",
                objectFit: "cover",
                borderRadius: "50%"
            }}
        />
        <Menu ref={menu} model={menuItems} popup />
        {
            volunteerProfileEditVisible &&
            <VolunteerProfileUpdate
                volunteer={profile}
                visible={volunteerProfileEditVisible}
                setVisible={setVolunteerProfileEditVisible}
            />
        }
    </div>;
}


type VolunteerLoginModalProps = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

function VolunteerLoginModal({ visible, setVisible }: VolunteerLoginModalProps) {
    const store = useHookstate(storeState);

    let emailRef = useRef<HTMLInputElement>(null);
    let passwordRef = useRef<HTMLInputElement>(null);

    let [formState, setFormState] = useState(FormState.init());

    const onLogin = () => {
        if (emailRef.current !== null && passwordRef.current !== null) {
            let email = (emailRef.current.value);
            let password = (passwordRef.current.value);
            login(email, password).then(async (response): Promise<void> => {
                if (response.status == 200) {
                    let token: Token = await response.json();
                    store.token.set(token);
                    localStorage.setItem("token", JSON.stringify(token));
                    store.volunteerProfile.set(await get_volunteer_profile());
                    setVisible(false);
                    setFormState(new FormState({ errors: "", submitted: true }));
                } else if (response.status == 400 || response.status == 401) {
                    setFormState(new FormState({
                        errors: describe_api_errors(await response.json()),
                        submitted: true,
                    }));
                }
            })
        }
    }

    let response = formState.hasErrors() ? formState.getErrorAsElement() : null;

    return <Dialog
        visible={visible}
        modal
        onHide={() => setVisible(false)}
        pt={{
            root: { style: { borderRadius: "20px", height: "40ch", width: "60ch" } }
        }}
        content={({ hide }) => (
            <div
                className="flex flex-row"
                style={{ width: "100%", height: "100%", borderRadius: "20px", overflow: "hidden" }}
            >
                <div className="flex flex-column justify-content-center align-items-center bg-primary" style={{ width: "100%" }}>
                    <img style={{ width: "70%" }} src={EmblemOfNepal} alt="Emblem of Nepal" />
                </div>
                <div className="flex flex-column justify-content-evenly p-4 bg-white w-full">
                    <Button text className="text-2xl align-self-end" onClick={hide}> <FontAwesomeIcon icon={faClose} /> </Button>
                    <div className="text-2xl"> NDRRMA - <span style={{ color: "var(--red-600)", borderBottom: "1px solid var(--primary-color)" }}> VMS </span> </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="email">Email</label>
                        <InputText ref={emailRef} id="email" aria-describedby="email-help" />
                    </div>
                    <div className="flex flex-column gap-2">
                        <label htmlFor="password">Password</label>
                        <Password pt={{ input: { ref: passwordRef } }} feedback={false} id="password" aria-describedby="password-help" />
                    </div>
                    {response}
                    <Button label="Login" onClick={onLogin} />
                </div>
            </div>
        )}
    />;
}

export function VolunteerLoginButton() {
    const store = useHookstate(storeState);
    let [modalVisible, setModalVisible] = useState(false);

    if (store.token.get() === null) {
        if (modalVisible) {
            return <VolunteerLoginModal visible={modalVisible} setVisible={setModalVisible} />;
        } else {
            return <Button className="mx-1" label='Login' raised onClick={() => setModalVisible(true)} >
                <FontAwesomeIcon className="ml-2" icon={faUser} />
            </Button>;
        }
    } else {
        return <VolunteerProfileMenu />;
    }
}
