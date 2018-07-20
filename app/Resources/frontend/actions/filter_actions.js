export const UPDATE_FILTER_ACTION = "UPDATE_FILTER_ACTION";

export function filterAction(payload = { currPage: 1, search: "", order: "DESC", selectedTags: [] }){
    return { type: UPDATE_FILTER_ACTION, payload };
}
