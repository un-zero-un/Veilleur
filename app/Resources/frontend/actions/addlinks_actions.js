export const TOGGLE_DIALOG        = "TOGGLE_DIALOG";
export const CLEAR_DIALOG         = "CLEAR_DIALOG";
export const UPDATE_TYPED_DIALOG  = "UPDATE_TYPED_DIALOG";
export const DISCOVER_DIALOG      = "DISCOVER_DIALOG";

export const toggleDialogAction = () => {
    return { type: TOGGLE_DIALOG };
};

export const updateTypedAction = (payload) => {
    return { type: UPDATE_TYPED_DIALOG, payload };
};

export const clearDialogAction = () => {
    return { type: CLEAR_DIALOG };
};

export const discoverDialogAction = (payload) => {
    return { type: DISCOVER_DIALOG, payload };
};