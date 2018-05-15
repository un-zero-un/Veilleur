import {LINK_TAG_ACTION, LINKING_TAG_CLICK, TOGGLE_LINKING_TAGS} from "../actions/linkingtags_actions";

const initialState = {
    open: false,
    masterTag: null,
    slaveTag: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_LINKING_TAGS:
            return { ...state, open: !state.open };
        case LINKING_TAG_CLICK:
            return { ...state, masterTag: action.payload.masterTag, slaveTag: action.payload.slaveTag };
        case LINK_TAG_ACTION:
            return { ...state };
        default:
            return state;
    }
}
