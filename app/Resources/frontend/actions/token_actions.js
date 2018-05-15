export const RETREIVE_TOKEN = "RETREIVE_TOKEN";

export const retreiveTokenAction = (payload = { code: '' }) => {
    return { type: RETREIVE_TOKEN, payload };
};

export const RETREIVED_TOKEN = "RETREIVED_TOKEN";

export const retreivedTokenAction = (payload = { token: '' }) => {
    return { type: RETREIVED_TOKEN, payload };
};
