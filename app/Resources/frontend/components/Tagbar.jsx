import {getUsersAction, toggleDialogUserAction} from "../actions/userpromote_actions";
import {deleteTokenAction, getTokenAction}      from "../actions/token_actions";
import {toggleLinkingAction}                    from "../actions/linkingtags_actions";
import {NO_TOKEN_AVAILABLE}                     from "../middleware/LocalStorageMiddleware";
import {toggleDialogAction}                     from "../actions/addlinks_actions";
import {retreiveTagsAction}                     from "../actions/tags_actions";
import {bindActionCreators}                     from "redux";
import React, {Component}                       from "react";
import {hideMenuAction}                         from "../actions/responsive_actions";
import {List, ListItem}                         from "@material-ui/core/index.js";
import SnackbarCustom                           from "./SnackbarCustom";
import {filterAction}                           from "../actions/filter_actions";
import UserPromotion                            from "./UserPromotion";
import ListItemText                             from "@material-ui/core/ListItemText/ListItemText";
import {withRouter}                             from "react-router-dom";
import LinkingTags                              from "./LinkingTags";
import IconButton                               from "@material-ui/core/IconButton/IconButton";
import TextField                                from "@material-ui/core/TextField/TextField";
import {connect}                                from "react-redux";
import AddLink                                  from "./AddLink";
import Tag                                      from "../model/Tag";

import LogoutIcon from "@material-ui/icons/ExitToApp";
import LoginIcon  from "@material-ui/icons/Launch";
import AdminIcon  from "@material-ui/icons/Portrait";
import ClearIcon  from "@material-ui/icons/ClearAll";
import CloseIcon  from "@material-ui/icons/Close";
import LinkIcon   from "@material-ui/icons/Link";
import DescIcon   from "@material-ui/icons/ArrowDownward";
import AddIcon    from "@material-ui/icons/Add";
import AscIcon    from "@material-ui/icons/ArrowUpward";


import '../assets/scss/Tagbar.scss';
import logo       from '../assets/logo.svg';

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

    handleLogin() {
        let browserURL = document.location.origin + '/login/check-google';
        let googleID   = document.getElementById("root").getAttribute("data-google-id");
        let url        = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + googleID + "&redirect_uri=" + encodeURI(browserURL) + "&response_type=code&scope=email%20profile";
        window.open(url, '_self').focus();
    }

    onChange(e) {
        this.updateRouter(this.getTags(), this.props.order, e);
    }

    keypressed(e) {
        if (13 === e.keyCode) {
            this.props.closeMenu();
        }
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

        if (null === this.props.user) {
            this.props.getToken();
        }

    }

    render() {
        let router = this.props.match.params;
        let params = this.getTags();

        let icons = [];
        if (null === this.props.user) {
            icons.push(
                <IconButton onClick={() => this.handleLogin()} key="IconButton-Login">
                    <LoginIcon/>
                </IconButton>
            );
        } else {
            icons.push(
                <div className={"user_infos"} key="UserInfos">
                    <div>Vous êtes connecté en tant que</div>
                    <div>{this.props.user.name}</div>
                </div>,
                <IconButton disabled={!this.props.user.isAdmin()} key="IconButton-Promote" onClick={() => {
                    this.props.getUsers();
                    this.props.toggleUserPromote()
                }}>
                    <AdminIcon/>
                </IconButton>,
                <IconButton disabled={!this.props.user.isAdmin()} onClick={() => this.props.toggleLinking()} key="IconButton-LinkTags"
                            aria-label="Link tags">
                    <LinkIcon/>
                </IconButton>,
                <IconButton disabled={!this.props.user.isAdmin()} onClick={() => this.props.toggleAddLink()} key="IconButton-AddLink">
                    <AddIcon/>
                </IconButton>,
                <IconButton onClick={() => this.props.deleteToken()} key="IconButton-Logout">
                    <LogoutIcon/>
                </IconButton>
            );
        }

        return <aside id="tagbar" className={this.props.isShown ? "showMenu" : "hideMenu"}>
            <IconButton id="MainMenuCloseButton" onClick={() => {
                this.props.closeMenu();
            }}>
                <CloseIcon/>
            </IconButton>
            <div id="header">
                <img src={logo} alt="logo-unzeroun"/>
                <h1 className="app-title">Veilleur</h1>
                <TextField className="search_bar" placeholder="Recherche" value={router.search}
                           onKeyDown={(e) => this.keypressed(e)}
                           onChange={(a) => this.onChange(a.target.value)}/>
                <IconButton onClick={() => {
                    this.updateRouter(this.getTags(), ((this.props.order === "ASC") ? "DESC" : "ASC"), this.props.search);
                    this.props.closeMenu();
                }}>
                    {(router.order === "DESC") ? <AscIcon/> : <DescIcon/>}
                </IconButton>
                <IconButton onClick={() => {
                    this.updateRouter([], "DESC", "");
                    this.props.closeMenu();
                }}>
                    <ClearIcon/>
                </IconButton>
            </div>

            <List id="taglist">
                {
                    this.props.tags.map((tag) => {
                        let cName = (null !== params) && (params.includes(tag.name)) ? "selected" : "";
                        return <ListItem className={"listItem " + cName} key={tag.id}
                                         onClick={() => {
                                             this.handleClick(tag);
                                         }}>
                            <ListItemText className="text" primary={"#" + tag.name}/>
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
        isShown: state.responsiveReducer.menuShown,
        user: state.tokenReducer.user
    }),
    dispatch => ({
        retreiveTags: bindActionCreators(retreiveTagsAction, dispatch),
        filter: bindActionCreators(filterAction, dispatch),
        toggleAddLink: bindActionCreators(toggleDialogAction, dispatch),
        toggleLinking: bindActionCreators(toggleLinkingAction, dispatch),
        toggleUserPromote: bindActionCreators(toggleDialogUserAction, dispatch),
        getToken: bindActionCreators(getTokenAction, dispatch),
        deleteToken: bindActionCreators(deleteTokenAction, dispatch),
        getUsers: bindActionCreators(getUsersAction, dispatch),
        closeMenu: bindActionCreators(hideMenuAction, dispatch)
    })
)(Tagbar));
