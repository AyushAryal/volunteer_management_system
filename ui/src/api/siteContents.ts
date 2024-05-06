import { server } from "@api/api";

export interface SiteContent {
    label: string;
    content: string;
}
export async function getSiteContents(){
  const endpoint = "/api/site_content";
  const url = `${server}${endpoint}`;
  return fetch(url).then((response) => response.json());
}
