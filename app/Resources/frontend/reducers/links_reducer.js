import {RECEIVED_LINKS} from "../actions/links_actions";

const initialState = {
    amtPages: 1,
    currPage: 1,
    links: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case RECEIVED_LINKS:
            return { ...state, links: action.payload.links, amtPages: action.payload.amtPages, currPage: action.payload.currPage };
        default:
            return state;
    }
}
