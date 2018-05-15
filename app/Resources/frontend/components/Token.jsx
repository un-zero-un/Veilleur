import { retreiveTokenAction, retreiveCodeAction } from "../actions/token_actions";
import { bindActionCreators } from "redux";
import { Redirect, withRouter } from "react-router-dom";
import React, { Component } from 'react';
import { connect } from "react-redux";

class Token extends Component {

    getCode() {
        let url = this.props.location.search;
        if (url.indexOf('?code=') !== -1) {
            let code = url.split('?code=')[ 1 ];

            if (url.indexOf("&") !== -1) {
                code = code.split("&")[ 0 ];
            }
            return code;
        }
        return false;
    }

    componentWillMount() {
        let code = this.getCode();
        if (!code) {

        } else {
            this.props.setAuthToken({code});
            /**
             * Save the authtoken in the cookies ?
             */
            this.props.getJWT({ code });
        }
    }

    render() {
        if (this.props.token && this.props.token.length > 0)
            return <Redirect to={"/"}/>;
        else
            return <div>
                Loading...
            </div>;
    }

}

export default withRouter(connect(
    state => ({
        code: state.tokenReducer.code,
        token: state.tokenReducer.token
    }),
    dispatch => ({
        getJWT: bindActionCreators(retreiveTokenAction, dispatch),
        setAuthToken: bindActionCreators(retreiveCodeAction, dispatch)
    })
)(Token));
