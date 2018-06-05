import {SHOW_MENU, HIDE_MENU} from "../actions/responsive_actions";

const initialState = {
    menuShown: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SHOW_MENU:
            return { ...state, menuShown: true };
        case HIDE_MENU:
            return { ...state, menuShown: false };
        default:
            return state;
    }
}