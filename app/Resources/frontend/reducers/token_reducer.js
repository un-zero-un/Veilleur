import { GET_TOKEN, READ_TOKEN, DELETE_TOKEN } from "../actions/token_actions";

const initialState = {
    token: '',
    refreshToken: '',
    GOOGLE_ID: ''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_TOKEN:
            return { ...state };
        case READ_TOKEN:
            return { ...state, token: action.payload.token, refreshToken: action.payload.refreshToken };
        case DELETE_TOKEN:
            return { ...state };
        default:
            return state;
    }
};