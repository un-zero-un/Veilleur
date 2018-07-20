import {
    ASK_REMOVE_LINK,
    MODIFIED_LINK,
    MODIFY_LINK,
    RECEIVED_LINKS,
    UPDATE_EDITING_LINK,
}                          from "../actions/links_actions";
import {FULLY_REMOVE_USER} from "../actions/userpromote_actions";

const initialState = {
    amtPages: 1,
    currPage: 1,
    links: [],
    removableElement: null,
    editingElement: null,
    editingFrame: {
        url: '',
        name: '',
        tags: [],
    }
};

export default function (state = initialState, action) {
    switch (action.type) {
        case RECEIVED_LINKS:
            return {
                ...state,
                links: action.payload.links,
                amtPages: action.payload.amtPages,
                currPage: action.payload.currPage,
            };
        case ASK_REMOVE_LINK:
            return {...state, removableElement: action.payload.eltRemove};
        case FULLY_REMOVE_USER:
            return {...state};
        case UPDATE_EDITING_LINK:
            return {...state, editingFrame: { ...state.editingFrame, ...action.payload} };
        case MODIFY_LINK:
            return {...state, editingElement: action.payload.eltEdit, editingFrame: { ...initialState.editingFrame, ...action.payload.eltEdit}};
        case MODIFIED_LINK:
            return {...state};
        default:
            return state;
    }
}
