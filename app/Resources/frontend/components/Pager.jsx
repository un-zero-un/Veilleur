import { bindActionCreators } from "redux";
import React, { Component }   from "react";
import { filterAction }       from "../actions/filter_actions";
import { withRouter }         from "react-router-dom";
import { IconButton }         from "material-ui";
import { connect }            from "react-redux";

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
            <IconButton onClick={ () => this.callUpdater(1) } iconClassName="Icon-First" />
            <IconButton onClick={ () => this.callUpdater(parseInt(this.props.currentPage, 10)-1) } iconClassName="Icon-Prev" disabled={undefined === this.props.currentPage || this.props.currentPage <= 1} />

            <div className="App-Links-Pagebar-Numbering">{this.props.currentPage} / {this.props.amtPages}</div>

            <IconButton onClick={ () => this.callUpdater(parseInt(this.props.currentPage, 10)+1) } iconClassName="Icon-Next" disabled={undefined === this.props.amtPages  || undefined === this.props.currentPage || this.props.currentPage >= this.props.amtPages } />
            <IconButton onClick={ () => this.callUpdater(this.props.amtPages) } iconClassName="Icon-Last" disabled={undefined === this.props.amtPages} />
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

