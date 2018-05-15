import React, { Component }   from 'react';
import { withRouter }         from "react-router-dom";
import { connect }            from "react-redux";
import LinkItem               from "./LinkItem";
import { List }               from "material-ui";
import Pager                  from "./Pager";

import '../assets/css/LinkList.css';

class LinkList extends Component {

    render() {
        return <div id="linkslist">
            <h1>Liste des liens</h1>

            <List id="links">
                { this.props.links.map(
                    (link) => <LinkItem key={ link.id }
                                        name={ link.name }
                                        url={ link.url }
                                        image={ link.image }
                                        description={ link.description }
                            />
                ) }
            </List>

            <Pager />

        </div>;
    }

}

export default withRouter(connect(
    state =>({
        links: state.linksReducer.links
    })
)(LinkList));