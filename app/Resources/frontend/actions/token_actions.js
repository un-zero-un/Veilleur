export const RETREIVE_CODE = "RETREIVE_CODE";

export const retreiveCodeAction = (payload = { code: '' }) => {
    return { type: RETREIVE_CODE, payload };
};

export const RETREIVE_TOKEN = "RETREIVE_TOKEN";

export const retreiveTokenAction = (payload = { token: '' }) => {
    return { type: RETREIVE_TOKEN, payload };
};
