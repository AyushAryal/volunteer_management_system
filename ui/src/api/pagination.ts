import { token_aware_fetch } from "./token";

async function* depaginate<T>(url: string): AsyncGenerator<T[], void, void> {
    while (url !== null) {
        let response = await token_aware_fetch(url);
        let json = await response.json();
        url = json["next"];
        yield json["results"];
    }
}

async function depaginate_full<T>(url: string): Promise<T[]> {
    let elements: T[] = [];
    for await (let element_page of depaginate<T>(url)) {
        elements = elements.concat(element_page);
    }
    return elements;
}

export function get_list_factory<T>(url: string): (query?: {}) => Promise<T[]> {
    return async (query) => {
        if (typeof (query) !== 'undefined') {
            const query_string = Object.entries(query)
                .map(([key, value]) => `${key}=${value}`)
                .join("&");
            return await depaginate_full<T>(`${url}?${query_string}`);
        }
        return await depaginate_full<T>(url);
    };
}
