import { FlatButton, FontIcon } from "material-ui";
import { toggleLinkingAction }  from "../actions/linkingtags_actions";
import { retreiveTagsAction }   from "../actions/tags_actions";
import { bindActionCreators }   from "redux";
import { toggleDialogAction }   from "../actions/addlinks_actions";
import React, { Component }     from 'react';
import { List, ListItem }       from 'material-ui/List';
import { filterAction }         from "../actions/filter_actions";
import { withRouter }           from "react-router-dom";
import SnackbarCustom           from "./SnackbarCustom";
import { connect }              from "react-redux";
import LinkingTags              from "./LinkingTags";
import IconButton               from 'material-ui/IconButton';
import TextField                from 'material-ui/TextField';
import jwt_check                from '../jwt';
import AddLink                  from "./AddLink";
import Config                   from "../Config";
import logo                     from '../assets/logo.svg';
import Tag                      from "../model/Tag";

import '../assets/css/Tagbar.css';

class Tagbar extends Component {

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    static parseURL(url){
        let tags = [];
        url = url.substring(1);
        url = url.split("tags[]=");
        for (let i = 0; i < url.length; ++i) {
            if (url[i].endsWith("&")){
                url[i] = url[i].substring(0, url[i].length-1);
            }

            if (url[i].length !== 0){
                tags.push(url[i]);
            }
        }

        if (1 === tags.length) {
            tags = tags[0];
        }

        return { "tags[]": tags };
    }

    getTags() {
        let tags = Tagbar.parseURL(this.props.location.search);
        if (undefined !== tags && undefined !== tags["tags[]"] && null !== tags["tags[]"]){
            if (Array.isArray(tags["tags[]"]))
                return tags["tags[]"];
            else
                return [ tags["tags[]"] ];
        }
        return null;
    }

    authenticate(callback) {
        let jwt     = this.props.jwt;
        let decoded = jwt_check(undefined !== jwt ? jwt : '');

        if (this.props.jwt.length > 0 && decoded) {
            callback();
        } else {
            console.log("Auth needed");
            let url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=" + Config.CLIENT_ID + "&redirect_uri=" + encodeURI(Config.CALLBACK_URL) +  "&response_type=code&scope=email%20profile";
            window.open(url, '_self').focus();
            //window.open("https://accounts.google.com/o/oauth2/v2/auth?client_id=" + Config.CLIENT_ID + "&redirect_uri=" + encodeURI(Config.API_HOST + "login/check-google") +  "&response_type=code&scope=email%20profile").focus();
        }
    }

    /**
     * Builds the URL from the tagbar's props & the tags given
     * Pushes it to the router
     * Calling the reducer accordingly
     */
    updateRouter(tags, order = this.props.order, search = this.props.search){
        let url = "/page/" + this.props.currPage + "/order/" + order + "/search/" + (undefined !== search && search.length !== 0 ? search + "/": "") + "tags/";

        if (null !== tags) {
            url += "?";
            tags = tags.map((tag) => ((tag instanceof Tag) ? tag.name : tag));
            let urltags = tags.map((tag) => ("tags[]=" + tag));

            for (let i = 0; i < urltags.length; ++i) {
                url += urltags[i];
                if (i !== urltags.length - 1)
                    url += "&";
            }
        }

        this.props.history.push(url);
        this.props.filter({ currPage: this.props.currPage, search, order, selectedTags: tags })
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

        if(tags.includes(tag.name)) {
            tags  = tags.filter(item => item !== tag.name);
        } else {
            tags.push(tag);
        }

        this.updateRouter(tags);
    }

    handleOrderToggle() {
        this.updateRouter(this.getTags(), ((this.props.order === "ASC") ? "DESC" : "ASC"), this.props.search);
    }

    handleAddToggle(){
        this.authenticate(() => {
            this.props.toggleAddLink();
        });
    }

    handleLinkTags(){
        this.authenticate(() => {
            this.props.toggleLinking();
        });
    }

    onChange(e) {
        this.updateRouter(this.getTags(), this.props.order, e);
    }

    componentDidMount() {
        let router = this.props.match.params;

        this.props.retreiveTags();
        this.props.filter({ selectedTags: this.getTags(), order: router.order, search: router.search, currPage: router.page });
    }

    render() {
        let router = this.props.match.params;
        let params = this.getTags();

        return <aside id="tagbar">
            <div id="header">
                <img src={ logo } alt="logo-unzeroun" />
                <h1 className="app-title">Veilleur</h1>
                <TextField floatingLabelText={"Recherche"} value={router.search} onChange={(a) => this.onChange(a.target.value)}/>
                <IconButton iconClassName={"Icon-" + router.order} onClick={ () => this.handleOrderToggle() }/>
                <IconButton iconClassName="Icon-Clear" onClick={() => { this.updateRouter([], "DESC", "") }}/>
            </div>

            <List id="taglist">
                {
                    this.props.tags.map((tag) => {
                        let cName = (null !== params) && (params.includes(tag.name)) ? "selected" : "";
                        return <ListItem className={ cName } primaryText={"#" + tag.name} key={tag.id} onClick={() => this.handleClick(tag)}/>
                    })
                }
            </List>

            <div id={"addLink"}>
                <FlatButton icon={<FontIcon className="Icon-Link" />} onClick={() => this.handleLinkTags() }/>
                <FlatButton icon={<FontIcon className="Icon-Add" />} onClick={() => this.handleAddToggle() }/>
            </div>
            <AddLink params={params} />
            <LinkingTags params={params} />
            <SnackbarCustom />
        </aside>;
    }

}

export default withRouter(connect(
    state =>({
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
    })
)(Tagbar));
