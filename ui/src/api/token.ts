import { server } from "./api.ts";

import { Token, Store } from "../models/store.ts";
import { State } from "@hookstate/core";

export function token_aware_fetch(resource: RequestInfo | URL, options?: RequestInit): Promise<Response> {
    let encoded_token = localStorage.getItem("token");
    if (encoded_token === null) {
        return fetch(resource, options);
    } else {
        let token: Token = JSON.parse(encoded_token);
        let headers = { ...options?.headers ?? {}, Authorization: `Token ${token.token}` };
        let extended_options = options ?? {};
        extended_options.headers = headers;
        return fetch(resource, extended_options);
    }
}

export async function login(email: string, password: string, store: State<Store, {}>) {
    let body = JSON.stringify({ email, password });
    let response = await fetch(`${server}/api/token`, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
        "body": body,
    });

    if (response.status == 200) {
        let token: Token = await response.json();
        store.token.set(token);
        localStorage.setItem("token", JSON.stringify(token));
    }
}

export async function logout(store: State<Store, {}>) {
    await token_aware_fetch(`${server}/api/token`, {
        "method": "DELETE",
    });
    store.token.set(null);
    localStorage.removeItem("token");
}
