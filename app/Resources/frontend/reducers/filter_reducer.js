import { RETREIVE_TAGS, RETREIVED_TAGS } from "../actions/tags_actions";
import { UPDATE_FILTER_ACTION }          from "../actions/filter_actions";

const initialState = {
    order: "DESC",
    search: "",
    tags: [],
    selectedTags: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case UPDATE_FILTER_ACTION:

            return {
                ...state,
                order: action.payload.order,
                search: action.payload.search,
                selectedTags: action.payload.selectedTags,
            };

        case RETREIVE_TAGS:
            return { ...state };
        case RETREIVED_TAGS:
            return { ...state, tags: action.payload.tags };
        default:
            return state;
    }
}
