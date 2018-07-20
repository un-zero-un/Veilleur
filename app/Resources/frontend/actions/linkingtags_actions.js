export const TOGGLE_LINKING_TAGS        = "TOGGLE_LINKING_TAGS";
export const LINKING_TAG_CLICK          = "LINKING_TAG_CLICK";
export const LINK_TAG_ACTION            = "LINK_TAG_ACTION";

export const toggleLinkingAction = () => {
    return { type: TOGGLE_LINKING_TAGS };
};

export const linkingClickAction = (payload) => {
    return { type: LINKING_TAG_CLICK, payload };
};

export const linkTagAction = (payload) => {
    return { type: LINK_TAG_ACTION, payload };
};
