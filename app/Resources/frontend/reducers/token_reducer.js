import { RETREIVE_CODE, RETREIVE_TOKEN } from "../actions/token_actions";

const initialState = {
    code: '',
    token: ''
};

export default function (state = initialState, action) {
    switch(action.type) {
        case RETREIVE_TOKEN:
            return { ...state, token: action.payload.token };
        case RETREIVE_CODE:
            return { ...state, code: action.payload.code };
        default:
            return state;
    }
};