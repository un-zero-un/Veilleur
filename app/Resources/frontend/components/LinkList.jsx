import React, {Component}   from 'react';
import {withRouter}         from "react-router-dom";
import {connect}            from "react-redux";
import LinkItem             from "./LinkItem";
import {List}               from "@material-ui/core/index.js";
import Pager                from "./Pager";

import '../assets/scss/LinkList.scss';
import IconButton           from "@material-ui/core/IconButton/IconButton";
import {bindActionCreators} from "redux";
import BurgerIcon           from "@material-ui/icons/Menu";
import {showMenuAction}     from "../actions/responsive_actions";

class LinkList extends Component {

    render() {
        return <div id="linkslist">
            <div id="upper">
                <IconButton id="MainMenuButton" onClick={() => {
                    this.props.toggleMenu()
                }}>
                    <BurgerIcon/>
                </IconButton>
                <h1>Liste des liens</h1>
            </div>

            <List id="links">
                {this.props.links.map(
                    (link) => <LinkItem key={link.id}
                                        name={link.name}
                                        url={link.url}
                                        image={link.image}
                                        description={link.description}
                    />
                )}
            </List>

            <Pager/>

        </div>;
    }

}

export default withRouter(connect(
    state => ({
        links: state.linksReducer.links
    }),
    dispatch => ({
        toggleMenu: bindActionCreators(showMenuAction, dispatch),
    })
)(LinkList));