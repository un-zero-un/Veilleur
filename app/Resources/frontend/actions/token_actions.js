export const READ_TOKEN   = "READ_TOKEN";
export const GET_TOKEN    = "GET_TOKEN";
export const DELETE_TOKEN = "DELETE_TOKEN";

export const getTokenAction = () => {
    return { type: GET_TOKEN };
};

export const readTokenAction = (payload = { token: '', refreshToken: '' }) => {
    return { type: READ_TOKEN, payload };
};

export const deleteTokenAction = () => {
    return { type: DELETE_TOKEN };
};
