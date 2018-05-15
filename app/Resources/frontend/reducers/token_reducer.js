import { RETREIVE_TOKEN, RETREIVED_TOKEN } from "../actions/token_actions";

const initialState = {
    code: '',
    token: ''
};

export default function (state = initialState, action) {
    switch(action.type) {
        case RETREIVED_TOKEN:
            return { ...state, token: action.payload.token };
        case RETREIVE_TOKEN:
            return { ...state, code: action.payload.code }
        default:
            return state;
    }
};