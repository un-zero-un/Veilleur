import { combineReducers } from "redux";
import filterReducer       from './filter_reducer.js';
import linksReducer        from './links_reducer.js';
import addlinksReducer     from './addlinks_reducer';
import snackbarReducer     from './snackbar_reducer';
import linkingTagsReducer  from './linkingtags_reducer';
import tokenReducer         from './token_reducer';

export default combineReducers({
    linksReducer,
    filterReducer,
    addlinksReducer,
    snackbarReducer,
    linkingTagsReducer,
    tokenReducer
});