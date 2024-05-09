import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';

import { ReactNode, useRef, useState } from 'react';

import EmblemOfNepal from '../emblem_of_nepal.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faUser, faRightFromBracket, faEdit, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { useHookstate } from '@hookstate/core';
import { storeState } from '@models/store';
import { login, logout } from '@api/token';
import { Menu } from 'primereact/menu';
import { MenuItem, MenuItemOptions } from 'primereact/menuitem';
import { VolunteerProfileUpdate } from './VolunteerProfileUpdate';

export function Profile() {
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

    if (volunteerProfileEditVisible) {
        return <VolunteerProfileUpdate
            volunteer={profile}
            visible={volunteerProfileEditVisible}
            setVisible={setVolunteerProfileEditVisible}
        />;
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
    </div>;
}


export function Login() {
    const store = useHookstate(storeState);
    let [visible, setVisible] = useState(false);

    let emailRef = useRef<HTMLInputElement>(null);
    let passwordRef = useRef<HTMLInputElement>(null);

    const onLogin = () => {
        if (emailRef.current !== null && passwordRef.current !== null) {
            let email = (emailRef.current.value);
            let password = (passwordRef.current.value);
            login(email, password, store);
        }
    }

    const login_component = <>
        <Button
            onClick={() => setVisible(true)} className="flex flex-row flex-wrap justify-content-center"
            style={{
                width: "2.2rem",
                height: "2.2rem",
                borderRadius: "50%",
            }}
        >
            <FontAwesomeIcon icon={faUser} style={{ margin: "-50%" }} />
        </Button>
        <Dialog
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
                        <Button label="Login" onClick={onLogin} />
                    </div>
                </div>
            )}
        >
        </Dialog>
    </>;

    return store.token.get() === null ? login_component : <Profile />;
}
