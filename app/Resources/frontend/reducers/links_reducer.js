import { ASK_REMOVE_LINK, RECEIVED_LINKS } from "../actions/links_actions";
import { FULLY_REMOVE_USER } from "../actions/userpromote_actions";

const initialState = {
    amtPages: 1,
    currPage: 1,
    links: [],
    removableElement: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case RECEIVED_LINKS:
            return { ...state, links: action.payload.links, amtPages: action.payload.amtPages, currPage: action.payload.currPage };
        case ASK_REMOVE_LINK:
            return { ...state, removableElement: action.payload.eltRemove };
        case FULLY_REMOVE_USER:
            return { ...state };
        default:
            return state;
    }
}
