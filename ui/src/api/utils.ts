import { deepFlatten } from "utils";
import { server } from "./api";
import { token_aware_fetch } from "./token";
import { GenericDeserializer, IDeserializer } from "@models/deserializer";

export function get_id(url: string): number {
    return +url.split("/").reverse()[0];
}

export function get_filtered_list<T, F>(endpoint: string, deserializer?: IDeserializer<T>): (query?: F) => Promise<T[]> {
    deserializer = deserializer || GenericDeserializer<T>();
    return async (query?: F) => {
        if (typeof (query) !== "undefined") {
            const query_string = Object.entries(query ?? {})
                .map(([key, value]) => `${key}=${value}`)
                .join("&");
            const url = `${server}${endpoint}?${query_string}`;
            let response = await token_aware_fetch(url);
            return (await response.json()).map(deserializer);
        }
        const url = `${server}${endpoint}`;
        let response = await token_aware_fetch(url);
        return (await response.json()).map(deserializer);
    }
}

export function get_detail<T, I>(endpoint: string, deserializer?: IDeserializer<T>): (id: I) => Promise<T> {
    deserializer = deserializer || GenericDeserializer<T>();
    return async (id: I) => {
        const url = `${server}${endpoint}/${id}`;
        let response = await token_aware_fetch(url);
        return deserializer(await response.json());
    }
}

export function describe_api_errors(json: object): string {
    if ("detail" in json) return json["detail"] as string;
    return Array.from(deepFlatten(json))
        .map(([k, v], i) => {
            if (Array.isArray(v)) {
                let combined = v.join(" ");
                return `${i + 1}. ${k}: ${combined}`;
            } else {
                return `${i + 1}. ${k}: ${v}`;
            }
        })
        .join("\n");
}
