import { bindActionCreators } from "redux";
import React, { Component }   from "react";
import { filterAction }       from "../actions/filter_actions";
import { withRouter }         from "react-router-dom";
import { IconButton }         from "@material-ui/core/index";
import { connect }            from "react-redux";

import FirstIcon from "@material-ui/icons/FirstPage";
import LastIcon from "@material-ui/icons/LastPage";
import PrevIcon from "@material-ui/icons/ChevronLeft";
import NextIcon from "@material-ui/icons/ChevronRight";

class Pager extends Component {

    getPageURL(pageNumber) {
        let oldURL = this.props.location.pathname + this.props.location.search;
        let path   = oldURL.substr(oldURL.indexOf("/", "/page/".length));
        return "/page/" + pageNumber + path;
    }

    callUpdater(currPage) {
        this.props.filter({ ...this.props.filterReducer, currPage });
        this.props.history.push(this.getPageURL(currPage));
    }

    render() {
        return <div id="pager">
            <IconButton onClick={ () => this.callUpdater(1) }>
                <FirstIcon />
            </IconButton>
            <IconButton onClick={ () => this.callUpdater(parseInt(this.props.currentPage, 10)-1) } disabled={undefined === this.props.currentPage || this.props.currentPage <= 1}>
                <PrevIcon />
            </IconButton>

            <div className="App-Links-Pagebar-Numbering">{this.props.currentPage} / {this.props.amtPages}</div>

            <IconButton onClick={ () => this.callUpdater(parseInt(this.props.currentPage, 10)+1) } disabled={undefined === this.props.amtPages  || undefined === this.props.currentPage || this.props.currentPage >= this.props.amtPages }>
                <NextIcon />
            </IconButton>
            <IconButton onClick={ () => this.callUpdater(this.props.amtPages) } disabled={undefined === this.props.amtPages}>
                <LastIcon />
            </IconButton>
        </div>
    }

}

export default withRouter(connect(
    state =>({
        filterReducer: state.filterReducer,
        currentPage: state.linksReducer.currPage,
        amtPages: state.linksReducer.amtPages
    }),
    dispatch =>({
        filter: bindActionCreators(filterAction, dispatch)
    })
)(Pager));

