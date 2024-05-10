import { token_aware_fetch } from "@api/token";
import { server } from "@api/api";
import { GenericDeserializer, IDeserializer } from "@models/deserializer";

export function depaginate<T, F>(endpoint: string, deserializer?: IDeserializer<T>)
    : (query?: F) => AsyncGenerator<T[], void, void> {
    deserializer = deserializer || GenericDeserializer<T>();
    return async function*(query?: F) {
        let url = `${server}${endpoint}`;
        if (typeof (query) !== "undefined") {
            const query_string = Object.entries(query ?? {})
                .map(([key, value]) => `${key}=${value}`)
                .join("&");
            url = `${server}${endpoint}?${query_string}`;
        }
        while (url !== null) {
            let response = await token_aware_fetch(url);
            let json = await response.json();
            url = json["next"];
            yield (json["results"]).map(deserializer);
        }
    }
}

export function get_paginated_list<T, F>(url: string, deserializer?: IDeserializer<T>): (query?: F) => Promise<T[]> {
    return async (query?: F) => {
        let elements: T[] = [];
        for await (let element_page of depaginate<T, F>(url, deserializer)(query)) {
            elements = elements.concat(element_page);
        }
        return elements;
    }
}
