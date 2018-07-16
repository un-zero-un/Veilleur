import {TOGGLE_DIALOG, CLEAR_DIALOG, UPDATE_TYPED_DIALOG, DISCOVER_DIALOG } from "../actions/addlinks_actions";

const initialState = {
    open: false,
    url: '',
    typedTag: '',
    suggestions: [],
    tags: []
};

export default function (state = initialState, action) {
    switch(action.type) {
        case TOGGLE_DIALOG:
            return { ...state, open: !state.open };
        case DISCOVER_DIALOG:
            return state;
        case CLEAR_DIALOG:
            return { ...state, url: '', typedTag: '', tags: [] };
        case UPDATE_TYPED_DIALOG:
            console.log("UPDATE=> ", action);
            return { ...state, ...action.payload };
        default:
            return state;
    }
};
