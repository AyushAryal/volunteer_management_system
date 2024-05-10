import { server } from "@api/api";

import { Token, Store, storeState } from "@models/store";
import { State } from "@hookstate/core";

export async function token_aware_fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response> {
    let encoded_token = localStorage.getItem("token");
    if (encoded_token === null) {
        return fetch(resource, options);
    } else {
        let token: Token = JSON.parse(encoded_token);
        let headers = { ...options?.headers ?? {}, Authorization: `Token ${token.token}` };
        let extended_options = options ?? {};
        extended_options.headers = headers;
        const response = await fetch(resource, extended_options);
        if (response.status === 401) {
            logout(storeState);
        }
        return response;
    }
}

export async function login(email: string, password: string): Promise<Response> {
    let body = JSON.stringify({ email, password });
    let response = await fetch(`${server}/api/token`, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
        "body": body,
    });
    return response;
}

export async function logout(store: State<Store, {}>) {
    await token_aware_fetch(`${server}/api/token`, {
        "method": "DELETE",
    });
    store.token.set(null);
    localStorage.removeItem("token");
}
