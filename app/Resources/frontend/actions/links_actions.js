export const RECEIVED_LINKS = "RECEIVED_LINKS";

export const MODIFY_LINK          = "MODIFY_LINK";
export const UPDATE_EDITING_LINK  = "UPDATE_EDITING_LINK";
export const MODIFIED_LINK        = "MODIFIED_LINK";
export const ASK_REMOVE_LINK      = "REMOVE_LINK";
export const REMOVED_LINK_CONFIRM = "REMOVED_LINK_CONFIRM";

export function receivedLinksAction(payload = {currPage: 1, amtPages: 1, links: []}) {
    return {type: RECEIVED_LINKS, payload};
}

export function modifyLinkAction(payload) {
    return {type: MODIFY_LINK, payload};
}

export function updateEditingAction(payload) {
    return {type: UPDATE_EDITING_LINK, payload};
}

export function modifiedLinkAction(payload) {
    return {type: MODIFIED_LINK, payload};
}

export function askRemoveLinkAction(payload) {
    return {type: ASK_REMOVE_LINK, payload};
}

export function fullyRemoveLinkAction(payload) {
    return {type: REMOVED_LINK_CONFIRM, payload};
}
