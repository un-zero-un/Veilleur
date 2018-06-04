import {GET_USERS, GOT_USERS, TOGGLE_ADMIN, TOGGLE_DIALOG} from "../actions/userpromote_actions";

const initialState = {
    users: [],
    open: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TOGGLE_DIALOG:
            return {...state, open: !state.open};
        case GET_USERS:
            return {...state};
        case GOT_USERS:
            return {...state, users: action.payload.users};
        case TOGGLE_ADMIN:
            return {...state};
        default:
            return state;
    }
};