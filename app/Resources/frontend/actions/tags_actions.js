export const RETREIVED_TAGS = "RETREIVED_TAGS";
export const RETREIVE_TAGS  = "RETREIVE_TAGS";

export const retreiveTagsAction = () => {
    return { type: RETREIVE_TAGS };
};

export const retreivedTagsAction = (payload = { tags: [] }) => {
    return { type: RETREIVED_TAGS, payload };
};