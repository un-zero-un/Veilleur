export const GET_USERS     = "GET_USERS";
export const GOT_USERS     = "GOT_USERS";
export const TOGGLE_ADMIN  = "TOGGLE_ADMIN";
export const TOGGLE_DIALOG = "TOGGLE_DIALOG_USERPROMOTE";

export const toggleDialogUserAction = () => {
    return {type: TOGGLE_DIALOG};
};

export const getUsersAction = () => {
    return {type: GET_USERS};
};

export const gotUsersAction = (payload = {users: []}) => {
    return {type: GOT_USERS, payload};
};

export const toggleAdminAction = (payload = {user: '', value: false}) => {
    return {type: TOGGLE_ADMIN, payload};
};
