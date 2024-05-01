import { server } from "./api";
import { token_aware_fetch } from "./token";

export function get_id(url: string): number {
    return +url.split("/").reverse()[0];
}

export function get_filtered_list<T, F>(endpoint: string): (query?: F) => Promise<T[]> {
    return async (query?: F) => {
        if (typeof (query) !== "undefined") {
            const query_string = Object.entries(query ?? {})
                .map(([key, value]) => `${key}=${value}`)
                .join("&");
            const url = `${server}${endpoint}?${query_string}`;
            let response = await token_aware_fetch(url);
            return await response.json();
        }
        const url = `${server}${endpoint}`;
        let response = await token_aware_fetch(url);
        return await response.json();
    }
}

export function get_detail<T, I>(endpoint: string): (id: I) => Promise<T> {
    return async (id: I) => {
        const url = `${server}${endpoint}/${id}`;
        let response = await token_aware_fetch(url);
        return await response.json();
    }
}

export function explain_form_errors(form_errors: object) {
    return "";

}
