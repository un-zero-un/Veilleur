import { RETREIVE_TAGS, retreivedTagsAction, retreiveTagsAction } from "../actions/tags_actions";
import { clearDialogAction, DISCOVER_DIALOG, toggleDialogAction } from "../actions/addlinks_actions";
import { LINK_TAG_ACTION, linkingClickAction } from "../actions/linkingtags_actions";
import { filterAction, UPDATE_FILTER_ACTION } from "../actions/filter_actions";
import { call, put, takeEvery, select } from "redux-saga/effects";
import { updateSnackbarAction } from "../actions/snackbar_actions";
import { askRemoveLinkAction, receivedLinksAction, REMOVED_LINK_CONFIRM } from "../actions/links_actions";
import { readTokenAction } from "../actions/token_actions";
import jwt_decode from "jwt-decode";
import Link from "../model/Link";
import User from "../model/User";
import Tag from '../model/Tag';

import {
    GET_USERS,
    getUsersAction,
    gotUsersAction,
    TOGGLE_ADMIN,
    FULLY_REMOVE_USER
} from "../actions/userpromote_actions";

function parseURL(url) {
    let params = url.split("&");

    for (let i = 0; i < params.length; ++i)
        if (params[ i ].startsWith("page"))
            return (params[ i ].split("=")[ 1 ]);
    return 1;

}

function* fetchFromFilter(action) {
    let pl  = action.payload;
    let url = "/watch_links?page=" + pl.currPage + "&order[createdAt]=" + pl.order;

    if (undefined !== pl.selectedTags && null !== pl.selectedTags) {
        for (let i = 0; i < pl.selectedTags.length; ++i) {
            url += "&tags[]=" + pl.selectedTags[ i ];
        }
    }

    if (undefined !== pl.search && pl.search.length !== 0) {
        url += "&search=" + pl.search;
    }

    try {
        const res = yield call(fetch, url);
        let links = yield call([ res, 'json' ]);

        let tmp = links[ 'hydra:view' ];

        let currPage = parseURL(tmp[ '@id' ]);         // Parsing the current page id
        let amtPages = (undefined !== tmp[ 'hydra:last' ]) ? parseURL(tmp[ 'hydra:last' ]) : 1;  // Parsing the last page id

        links = links[ 'hydra:member' ];
        links = links.map((lnk) => (new Link(lnk)));

        yield put(receivedLinksAction({ links, currPage, amtPages }));
    } catch (err) {
        console.log("Err: ", err);
    }
}

function* fetchTags() {
    let url = '/tags?show_duplicates=false';

    try {
        const res = yield call(fetch, url);
        let tags  = yield call([ res, 'json' ]);
        tags      = tags[ 'hydra:member' ];
        tags      = tags.map((tag) => (new Tag(tag)));

        yield put(retreivedTagsAction({ tags }));
    } catch (err) {
        console.log("Err: ", err);
    }
}

function* discover(action) {
    let url = '/watch_links/discover';

    try {
        let tags = [];
        if (undefined !== action.payload.tags) {
            tags = action.payload.tags.map((tag) => tag.name);
        }

        const token = yield select((item) => (item.tokenReducer));
        if (yield checkToken(token.token, token.refreshToken)) {
            const token = yield select((item) => (item.tokenReducer));

            const res = yield call(fetch, url, {
                headers: {
                    'Accept'       : 'application/ld+json',
                    'Content-Type' : 'application/ld+json',
                    'Authorization': 'Bearer ' + token.token
                },
                method : 'POST',
                body   : JSON.stringify({
                    'url'    : action.payload.url,
                    'taglist': tags
                })
            });

            if (201 === res.status) {
                yield put(toggleDialogAction());
                yield put(clearDialogAction());
                yield put(updateSnackbarAction({ open: true, message: 'Lien ajouté!' }));
                yield put(retreiveTagsAction());
                yield put(filterAction());
            } else {
                yield put(updateSnackbarAction({
                    open   : true,
                    message: 'Une erreur est survenue! (' + res.status + ')'
                }));
                console.log(res);
            }
        }
    } catch (err) {
        console.log("Err: ", err);
    }


}

function* linkTag(action) {
    let url = '/tags/link/' + action.payload.masterTag.name + '/' + action.payload.slaveTag.name;

    const token = yield select((item) => (item.tokenReducer));

    if (yield checkToken(token.token, token.refreshToken)) {
        const token = yield select((item) => (item.tokenReducer));
        try {
            const res = yield call(fetch, url, {
                headers: {
                    'Accept'       : 'application/ld+json',
                    'Content-Type' : 'application/ld+json',
                    'Authorization': 'Bearer ' + token.token
                },
                method : 'POST',
            });

            if (201 === res.status) {
                yield put(linkingClickAction({ masterTag: null, slaveTag: null }));
                yield put(updateSnackbarAction({ open: true, message: 'Tags liés!' }));
                yield put(retreiveTagsAction());
                yield put(filterAction());
            } else {
                yield put(updateSnackbarAction({
                    open   : true,
                    message: 'Une erreur est survenue! (' + res.status + ')'
                }));
                console.log(res);
            }
        } catch (err) {
            console.log("Err: ", err);
        }
    }

}

function* checkToken(token, refresh) {
    let decoded_token = jwt_decode(token);
    if (undefined !== decoded_token.exp) {
        if (decoded_token.exp < Date.now().valueOf() / 1000) {
            const res = yield call(fetch, '/token/refresh', {
                headers: {
                    'Accept'      : 'application/ld+json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method : 'POST',
                body   : 'refresh_token=' + refresh
            });

            if (200 === res.status) {
                let newToken                    = yield call([ res, 'json' ]);
                localStorage[ "token" ]         = newToken[ "token" ];
                localStorage[ "refresh_token" ] = newToken[ "refresh_token" ];
                yield put(readTokenAction({ token: newToken[ "token" ], refreshToken: newToken[ "refresh_token" ] }));
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                yield put(updateSnackbarAction({
                    open   : true,
                    message: 'Votre token à expiré et ne peut être renouvelé'
                }));
                return false;
            }
        }
    }
    return true;
}

function* retreiveUsers() {
    const token = yield select((item) => (item.tokenReducer));

    if (yield checkToken(token.token, token.refreshToken)) {
        const newToken = yield select((item) => (item.tokenReducer));
        const res      = yield call(fetch, "/users", {
                headers: {
                    'Accept'       : 'application/ld+json',
                    'Authorization': 'Bearer ' + newToken.token
                },
                method : 'GET'
            }
        );

        if (200 === res.status) {
            let resp         = yield call([ res, 'json' ]);
            let hydraMembers = resp[ 'hydra:member' ];
            let users        = [];

            hydraMembers.forEach((elt) => {
                users.push(new User(elt));
            });

            yield put(gotUsersAction({ users }));
        } else {
            yield put(updateSnackbarAction({
                open   : true,
                message: 'Une erreur est survenue! (' + res.status + ')'
            }));
        }
    }
}

function* toggleAdmin(action) {
    const token = yield select((item) => (item.tokenReducer));

    if (yield checkToken(token.token, token.refreshToken)) {
        const newToken = yield select((item) => (item.tokenReducer));
        const res      = yield call(fetch, "/users/" + action.payload.user + '/admin/' + action.payload.val, {
                headers: {
                    'Accept'       : 'application/ld+json',
                    'Authorization': 'Bearer ' + newToken.token
                },
                method : 'PUT'
            }
        );

        if (200 === res.status) {
            yield put(getUsersAction());
        } else {
            yield put(updateSnackbarAction({
                open   : true,
                message: 'Une erreur est survenue! (' + res.status + ')'
            }));
            console.log(res);
        }
    }
}

function* removeUser(action) {

    const token = yield select((item) => (item.tokenReducer));

    if (yield checkToken(token.token, token.refreshToken)) {
        const newToken = yield select((item) => (item.tokenReducer));
        const res      = yield call(fetch, "/users/" + action.payload.id, {
                headers: {
                    'Accept'       : 'application/ld+json',
                    'Authorization': 'Bearer ' + newToken.token
                },
                method : 'DELETE'
            }
        );

        if (204 === res.status) {
            yield put(getUsersAction());
        } else {
            yield put(updateSnackbarAction({
                open   : true,
                message: 'Une erreur est survenue! (' + res.status + ')'
            }));
            console.log(res);
        }
    }
}

function* removeLink(action) {

    const token = yield select((item) => (item.tokenReducer));

    if (yield checkToken(token.token, token.refreshToken)) {
        const newToken = yield select((item) => (item.tokenReducer));
        const res      = yield call(fetch, action.payload.eltRemove.id, {
                headers: {
                    'Accept'       : 'application/ld+json',
                    'Authorization': 'Bearer ' + newToken.token
                },
                method : 'DELETE'
            }
        );

        if (204 === res.status) {
            yield put(askRemoveLinkAction({eltRemove: null}));
            yield put(filterAction());
        } else {
            yield put(updateSnackbarAction({
                open   : true,
                message: 'Une erreur est survenue! (' + res.status + ')'
            }));
            console.log(res);
        }
    }
}

export default function* vsaga() {
    yield takeEvery(UPDATE_FILTER_ACTION, fetchFromFilter);
    yield takeEvery(RETREIVE_TAGS, fetchTags);
    yield takeEvery(DISCOVER_DIALOG, discover);
    yield takeEvery(LINK_TAG_ACTION, linkTag);
    yield takeEvery(GET_USERS, retreiveUsers);
    yield takeEvery(TOGGLE_ADMIN, toggleAdmin);
    yield takeEvery(FULLY_REMOVE_USER, removeUser);
    yield takeEvery(REMOVED_LINK_CONFIRM, removeLink);
}
