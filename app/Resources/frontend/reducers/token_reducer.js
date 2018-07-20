import {GET_TOKEN, READ_TOKEN, DELETE_TOKEN} from "../actions/token_actions";
import jwt_decode                            from "jwt-decode";
import User                                  from '../model/User';
import {NO_TOKEN_AVAILABLE}                  from '../middleware/LocalStorageMiddleware'

const initialState = {
    token: '',
    refreshToken: '',
    user: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_TOKEN:
            return {...state};
        case READ_TOKEN:
            if (NO_TOKEN_AVAILABLE === action.payload.token || undefined === action.payload.token || null === action.payload.token || 0 >= action.payload.token.length) {
                return {...state, token: action.payload.token, refreshToken: action.payload.refreshToken};
            }

            let user = new User(jwt_decode(action.payload.token));
            return {...state, token: action.payload.token, refreshToken: action.payload.refreshToken, user};

        case DELETE_TOKEN:
            return {...state, user: null};
        default:
            return state;
    }
};