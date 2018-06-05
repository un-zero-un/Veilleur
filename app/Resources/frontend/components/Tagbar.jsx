import {getUsersAction, toggleDialogUserAction} from "../actions/userpromote_actions";
import {deleteTokenAction, getTokenAction}      from "../actions/token_actions";
import {Button, List, ListItem}                 from "@material-ui/core";
import {toggleLinkingAction}                    from "../actions/linkingtags_actions";
import {NO_TOKEN_AVAILABLE}                     from "../middleware/LocalStorageMiddleware";
import {toggleDialogAction}                     from "../actions/addlinks_actions";
import {retreiveTagsAction}                     from "../actions/tags_actions";
import {bindActionCreators}                     from "redux";
import React, {Component}                       from "react";
import * as jwt_decode                          from "jwt-decode";
import SnackbarCustom                           from "./SnackbarCustom";
import {filterAction}                           from "../actions/filter_actions";
import UserPromotion                            from "./UserPromotion";
import {withRouter}                             from "react-router-dom";
import LinkingTags                              from "./LinkingTags";
import {connect}                                from "react-redux";
import AddLink                                  from "./AddLink";
import Config                                   from "../Config";
import Tag                                      from "../model/Tag";

import LinkIcon   from "@material-ui/icons/Link";
import AddIcon    from "@material-ui/icons/Add";
import LoginIcon  from "@material-ui/icons/Launch";
import LogoutIcon from "@material-ui/icons/ExitToApp";
import AdminIcon  from "@material-ui/icons/Portrait";
import ClearIcon  from "@material-ui/icons/ClearAll";
import AscIcon    from "@material-ui/icons/ArrowUpward";
import DescIcon   from "@material-ui/icons/ArrowDownward";

import logo         from '../assets/logo.svg';
import '../assets/scss/Tagbar.scss';
import TextField    from "@material-ui/core/es/TextField/TextField";
import IconButton   from "@material-ui/core/es/IconButton/IconButton";
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";

class Tagbar extends Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    static parseURL(url) {
        let tags = [];
        url      = url.substring(1);
        url      = url.split("tags[]=");
        for (let i = 0; i < url.length; ++i) {
            if (url[i].endsWith("&")) {
                url[i] = url[i].substring(0, url[i].length - 1);
            }

            if (url[i].length !== 0) {
                tags.push(url[i]);
            }
        }

        if (1 === tags.length) {
            tags = tags[0];
        }

        return {"tags[]": tags};
    }

    getTags() {
        let tags = Tagbar.parseURL(this.props.location.search);
        if (undefined !== tags && undefined !== tags["tags[]"] && null !== tags["tags[]"]) {
            if (Array.isArray(tags["tags[]"]))
                return tags["tags[]"];
            else
                return [tags["tags[]"]];
        }
        return null;
    }

    /**
     * Builds the URL from the tagbar's props & the tags given
     * Pushes it to the router
     * Calling the reducer accordingly
     */
    updateRouter(tags, order = this.props.order, search = this.props.search) {
        let url = "/page/" + this.props.currPage + "/order/" + order + "/search/" + (undefined !== search && search.length !== 0 ? search + "/" : "") + "tags/";

        if (null !== tags) {
            url += "?";
            tags        = tags.map((tag) => ((tag instanceof Tag) ? tag.name : tag));
            let urltags = tags.map((tag) => ("tags[]=" + tag));

            for (let i = 0; i < urltags.length; ++i) {
                url += urltags[i];
                if (i !== urltags.length - 1)
                    url += "&";
            }
        }

        this.props.history.push(url);
        this.props.filter({currPage: this.props.currPage, search, order, selectedTags: tags});
    }

    /**
     * Occurs whenever the user click on a tag
     * Generates the new tag list, push it to the router, and filtering it
     */
    handleClick(tag) {
        let currTags = this.getTags();

        let tags = [];

        if (null !== currTags)
            tags.push(...currTags);

        if (tags.includes(tag.name)) {
            tags = tags.filter(item => item !== tag.name);
        } else {
            tags.push(tag);
        }

        this.updateRouter(tags);
    }

    handleOrderToggle() {
        this.updateRouter(this.getTags(), ((this.props.order === "ASC") ? "DESC" : "ASC"), this.props.search);
    }

    handleLogin() {
        let browserURL = document.location.origin;
        let url        = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + Config.CLIENT_ID + "&redirect_uri=" + encodeURI(browserURL + Config.CALLBACK_URL) + "&response_type=code&scope=email%20profile";
        window.open(url, '_self').focus();
    }

    handleLogout() {
        this.props.deleteToken();
    }

    onChange(e) {
        this.updateRouter(this.getTags(), this.props.order, e);
    }

    componentDidMount() {
        let router = this.props.match.params;

        this.props.retreiveTags();
        this.props.filter({
            selectedTags: this.getTags(),
            order: router.order,
            search: router.search,
            currPage: router.page
        });

        if (0 === this.props.jwt.length) {
            this.props.getToken();
        }

    }

    render() {
        let router = this.props.match.params;
        let params = this.getTags();

        let icons = [];
        let token = this.props.jwt;
        if (NO_TOKEN_AVAILABLE === token || token.length < 1) {
            //Login
            icons.push(
                <IconButton onClick={() => this.handleLogin()}>
                    <LoginIcon/>
                </IconButton>
            );
        } else {
            // Logged
            let user    = jwt_decode(token);
            let isAdmin = user.roles.includes('ROLE_ADMIN');

            icons.push(
                <div className={"user_infos"}>
                    <div>Vous êtes connecté en tant que</div>
                    <div>{user.username}</div>
                </div>,
                <IconButton disabled={!isAdmin} onClick={() => {
                    this.props.getUsers();
                    this.props.toggleUserPromote()
                }}>
                    <AdminIcon/>
                </IconButton>,
                <IconButton disabled={!isAdmin} onClick={() => this.props.toggleLinking()} aria-label="Link tags">
                    <LinkIcon/>
                </IconButton>,
                <IconButton disabled={!isAdmin} onClick={() => this.props.toggleAddLink()}>
                    <AddIcon/>
                </IconButton>,
                <IconButton onClick={() => this.handleLogout()}>
                    <LogoutIcon/>
                </IconButton>
            );
        }

        return <aside id="tagbar">
            <div id="header">
                <img src={logo} alt="logo-unzeroun"/>
                <h1 className="app-title">Veilleur</h1>
                <TextField placeholder="Recherche" value={router.search} onChange={(a) => this.onChange(a.target.value)}/>
                <IconButton onClick={() => this.handleOrderToggle()}>
                    {(router.order === "DESC") ? <AscIcon/> : <DescIcon/>}
                </IconButton>
                <IconButton onClick={() => {
                    this.updateRouter([], "DESC", "");
                }}>
                    <ClearIcon/>
                </IconButton>
            </div>

            <List id="taglist">
                {
                    this.props.tags.map((tag) => {
                        let cName = (null !== params) && (params.includes(tag.name)) ? "selected" : "";
                        return <ListItem className={"listItem " + cName} key={tag.id} onClick={() => this.handleClick(tag)}>
                                <ListItemText className="text" primary={"#" + tag.name} />
                        </ListItem>;
                    })
                }
            </List>

            <div id={"addLink"}>
                {icons}
            </div>

            <AddLink params={params}/>
            <LinkingTags params={params}/>
            <UserPromotion params={params}/>
            <SnackbarCustom/>
        </aside>;
    }

}

export default withRouter(connect(
    state => ({
        search: state.filterReducer.search,
        tags: state.filterReducer.tags,
        order: state.filterReducer.order,
        currPage: state.linksReducer.currPage,
        jwt: state.tokenReducer.token
    }),
    dispatch => ({
        retreiveTags: bindActionCreators(retreiveTagsAction, dispatch),
        filter: bindActionCreators(filterAction, dispatch),
        toggleAddLink: bindActionCreators(toggleDialogAction, dispatch),
        toggleLinking: bindActionCreators(toggleLinkingAction, dispatch),
        toggleUserPromote: bindActionCreators(toggleDialogUserAction, dispatch),
        getToken: bindActionCreators(getTokenAction, dispatch),
        deleteToken: bindActionCreators(deleteTokenAction, dispatch),
        getUsers: bindActionCreators(getUsersAction, dispatch)
    })
)(Tagbar));
