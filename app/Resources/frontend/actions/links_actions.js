export const RECEIVED_LINKS = "RECEIVED_LINKS";

export const MODIFY_LINKS         = "MODIFY_LINKS";
export const MODIFIED_LINKS       = "MODIFIED_LINKS";
export const ASK_REMOVE_LINK      = "REMOVE_LINK";
export const REMOVED_LINK_CONFIRM = "REMOVED_LINK_CONFIRM";

export function receivedLinksAction(payload = { currPage: 1, amtPages: 1, links: [] }) {
    return { type: RECEIVED_LINKS, payload };
}

export function modifyLinksAction(payload) {
    return { type: MODIFY_LINKS, payload };
}

export function modifiedLinksAction(payload) {
    return { type: MODIFIED_LINKS, payload };
}

export function askRemoveLinkAction(payload) {
    return { type: ASK_REMOVE_LINK, payload };
}

export function fullyRemoveLinkAction(payload) {
    return { type: REMOVED_LINK_CONFIRM, payload };
}
