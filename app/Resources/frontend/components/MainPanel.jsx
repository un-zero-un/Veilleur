import React, {Component}   from 'react';
import {withRouter}         from "react-router-dom";
import {connect}            from "react-redux";
import LinkList             from "./LinkList";
import Pager                from "./Pager";

import '../assets/scss/LinkList.scss';
import IconButton           from "@material-ui/core/IconButton/IconButton";
import {bindActionCreators} from "redux";
import BurgerIcon           from "@material-ui/icons/Menu";
import {showMenuAction}     from "../actions/responsive_actions";

class MainPanel extends Component {

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

            <LinkList />

            <Pager/>

        </div>;
    }

}

export default withRouter(connect(
    state => ({}),
    dispatch => ({
        toggleMenu: bindActionCreators(showMenuAction, dispatch),
    })
)(MainPanel));