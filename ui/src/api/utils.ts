import { deepFlatten } from "utils";
import { token_aware_fetch } from "./token";
import { GenericDeserializer, IDeserializer } from "@models/deserializer";

export function get_id(url: string): number {
    return +url.split("/").reverse()[0];
}

export function get_filtered_endpoint<T, F>(url: string, deserializer?: IDeserializer<T>): (query?: F) => Promise<T> {
    deserializer = deserializer || GenericDeserializer<T>();
    return async (query?: F) => {
        if (Object.keys(query ?? {}).length != 0) {
            const query_string = Object.entries(query ?? {})
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => `${key}=${value}`)
                .join("&");
            let response = await token_aware_fetch(`${url}?${query_string}`);
            return deserializer(await response.json());
        }
        let response = await token_aware_fetch(url);
        return deserializer(await response.json());
    }
}

export function get_filtered_list<T, F>(url: string, deserializer?: IDeserializer<T>): (query?: F) => Promise<T[]> {
    deserializer = deserializer || GenericDeserializer<T>();
    return async (query?: F) => {
        if (Object.keys(query ?? {}).length != 0) {
            const query_string = Object.entries(query ?? {})
                .filter(([_, value]) => value !== undefined)
                .map(([key, value]) => `${key}=${value}`)
                .join("&");
            let response = await token_aware_fetch(`${url}?${query_string}`);
            let list: any[] = await response.json();
            return list.map(deserializer);
        }
        let response = await token_aware_fetch(url);
        let list: any[] = await response.json();
        return list.map(deserializer);
    }
}

export function get_detail_singular<T>(url: string, deserializer?: IDeserializer<T>): () => Promise<T> {
    deserializer = deserializer || GenericDeserializer<T>();
    return async () => {
        let response = await token_aware_fetch(`${url}`);
        return deserializer(await response.json());
    }
}

export function get_detail<T, I>(url: string, deserializer?: IDeserializer<T>): (id: I) => Promise<T> {
    deserializer = deserializer || GenericDeserializer<T>();
    return async (id: I) => {
        let response = await token_aware_fetch(`${url}/${id}`);
        return deserializer(await response.json());
    }
}

export function describe_api_errors(json: object): string {
    if ("detail" in json) return json["detail"] as string;
    return Array.from(deepFlatten(json))
        .map(([k, v], i) => {
            if (Array.isArray(v)) {
                let combined = v.map((v_) => {
                    if (typeof v_ === "object") {
                        return describe_api_errors(v_);
                    } else {
                        return v_;
                    }
                }).join(" ");
                return `${i + 1}. ${k}: ${combined}`;
            } else if (typeof v == "object") {
                return `${i + 1}. ${k}: ${describe_api_errors(v)}`;
            } else {
                return `${i + 1}. ${k}: ${v}`;
            }
        })
        .join("\n");
}
