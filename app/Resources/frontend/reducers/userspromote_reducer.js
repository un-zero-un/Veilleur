import {FULLY_REMOVE_USER, ASK_REMOVE_USER, GET_USERS, GOT_USERS, TOGGLE_ADMIN, TOGGLE_DIALOG} from "../actions/userpromote_actions";

const initialState = {
    users: [],
    open: false,
    popOpened: [],
    element: null
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
        case ASK_REMOVE_USER:
            return {...state, popOpened: action.payload.popOpened, element: action.payload.element};
        case FULLY_REMOVE_USER:
            return {...state};
        default:
            return state;
    }
};