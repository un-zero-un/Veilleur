import { RETREIVE_TAGS, retreivedTagsAction, retreiveTagsAction } from "../actions/tags_actions";
import { filterAction, UPDATE_FILTER_ACTION } from "../actions/filter_actions";
import { call, put, takeEvery } from "redux-saga/effects";
import { receivedLinksAction } from "../actions/links_actions";
import Config from "../Config";
import Link from "../model/Link";
import Tag from '../model/Tag';
import { clearDialogAction, DISCOVER_DIALOG, toggleDialogAction } from "../actions/addlinks_actions";
import { updateSnackbarAction } from "../actions/snackbar_actions";
import { LINK_TAG_ACTION, linkingClickAction } from "../actions/linkingtags_actions";
import { RETREIVE_TOKEN } from "../actions/token_actions";

function parseURL(url) {
    let params = url.split("&");

    for (let i = 0; i < params.length; ++i)
        if (params[ i ].startsWith("page"))
            return (params[ i ].split("=")[ 1 ]);
    return 1;

}

function* fetchFromFilter(action) {
    let pl = action.payload;
    let url = Config.API_HOST + "watch_links?page=" + pl.currPage + "&order[createdAt]=" + pl.order;

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
    let url = Config.API_HOST + 'tags?show_duplicates=false';

    try {
        const res = yield call(fetch, url);
        let tags = yield call([ res, 'json' ]);
        tags = tags[ 'hydra:member' ];
        tags = tags.map((tag) => (new Tag(tag)));

        yield put(retreivedTagsAction({ tags }));
    } catch (err) {
        console.log("Err: ", err);
    }
}

function* discover(action) {
    let url = Config.API_HOST + 'watch_links/discover';
    console.log(action.payload);

    try {
        let tags = [];
        if (undefined !== action.payload.tags) {
            tags = action.payload.tags.map((tag) => tag.name);
        }


        const res = yield call(fetch, url, {
            headers: {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json'
            },
            method: 'POST',
            body: JSON.stringify({
                'url': action.payload.url,
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
            yield put(updateSnackbarAction({ open: true, message: 'Une erreur est survenue! (' + res.status + ')' }));
            console.log(res);
        }
    } catch (err) {
        console.log("Err: ", err);
    }

}

function* linkTag(action) {
    let url = Config.API_HOST + 'tags/link/' + action.payload.masterTag.name + '/' + action.payload.slaveTag.name;

    try {
        const res = yield call(fetch, url, {
            headers: {
                'Accept': 'application/ld+json',
                'Content-Type': 'application/ld+json'
            },
            method: 'POST',
        });

        if (201 === res.status) {
            yield put(linkingClickAction({ masterTag: null, slaveTag: null }));
            yield put(updateSnackbarAction({ open: true, message: 'Tags liés!' }));
            yield put(retreiveTagsAction());
            yield put(filterAction());
        } else {
            yield put(updateSnackbarAction({ open: true, message: 'Une erreur est survenue! (' + res.status + ')' }));
            console.log(res);
        }
    } catch (err) {
        console.log("Err: ", err);
    }

}

function* getJWT(action) {
    let url = Config.API_HOST + "login/check-google?code=" + action.payload.code;

    try {
        const res = yield call(fetch, url);

        console.log(url);
    } catch (err) {
        console.log(err);
    }

}

export default function* vsaga() {
    yield takeEvery(UPDATE_FILTER_ACTION, fetchFromFilter);
    yield takeEvery(RETREIVE_TAGS, fetchTags);
    yield takeEvery(DISCOVER_DIALOG, discover);
    yield takeEvery(LINK_TAG_ACTION, linkTag);
    yield takeEvery(RETREIVE_TOKEN, getJWT);
}
