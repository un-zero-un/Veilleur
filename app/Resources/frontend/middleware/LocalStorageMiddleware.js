import { DELETE_TOKEN, GET_TOKEN } from '../actions/token_actions';
import { readTokenAction }         from "../actions/token_actions";

export const NO_TOKEN_AVAILABLE = "NO_TOKEN_AVAILABLE";

export default store => next => {
    return action => {

        if (action.type === GET_TOKEN) {
            let token        = localStorage.getItem('token');
            let refreshToken = localStorage.getItem('refresh_token');
            if (null !== token && 0 < token.length && null !== refreshToken && 0 < refreshToken.length) {
                store.dispatch(readTokenAction({ token, refreshToken }));
            } else {
                store.dispatch(readTokenAction({ token: NO_TOKEN_AVAILABLE, refreshToken: NO_TOKEN_AVAILABLE }));
            }
        } else if (action.type === DELETE_TOKEN) {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            store.dispatch(readTokenAction({ token: NO_TOKEN_AVAILABLE, refreshToken: NO_TOKEN_AVAILABLE }));
        }

        return next(action);
    };
};