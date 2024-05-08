import { server } from "@api/api";

export function get_site_content(){
    const endpoint = "/api/sitecontent"
    url = $(server)$(endpoint)
    respone = fetch(url).then
    return async (query?) => {
        const list = await fn(query);
        for (let body of list) {
            for (let point of body.shape.coordinates[0]) {
                [point[0], point[1]] = [point[1], point[0]];
            }
            body.shape.bbox = [body.shape.bbox[1], body.shape.bbox[0], body.shape.bbox[3], body.shape.bbox[2]]
        }
        return list;
    }
