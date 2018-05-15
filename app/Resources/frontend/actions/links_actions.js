export const RECEIVED_LINKS = "RECEIVED_LINKS";

export function receivedLinksAction(payload = { currPage: 1, amtPages: 1, links: [] }) {
    return { type: RECEIVED_LINKS, payload };
}