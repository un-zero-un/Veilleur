import {toggleDialogUserAction, toggleAdminAction} from "../actions/userpromote_actions";
import {Dialog, FlatButton, List, ListItem} from "material-ui";
import {updateSnackbarAction}               from "../actions/snackbar_actions";
import {NO_TOKEN_AVAILABLE}                 from "../middleware/LocalStorageMiddleware";
import {bindActionCreators}                 from "redux";
import React, {Component}                   from 'react';
import * as jwt_decode                      from 'jwt-decode';
import {withRouter}                         from "react-router-dom";
import {connect}                            from "react-redux";

import '../assets/scss/UserPromotion.scss';

class UserPromotion extends Component {

    render() {
        let mainUser = '';

        if (undefined !== this.props.jwt && NO_TOKEN_AVAILABLE !== this.props.jwt && this.props.jwt.length > 0) {
            console.log("JWT",this.props.jwt);
            mainUser = (jwt_decode(this.props.jwt)).username;
        }

        let actions = [
            <FlatButton
                label="Quitter"
                primary={true}
                onClick={() => this.props.toggleDialog()}
            />,
        ];


        return <Dialog title="Gestion des utilisateurs" actions={actions} modal={false} open={this.props.dialogOpen}
                       onRequestClose={() => this.props.toggleDialog()}>

            <span>Les utilisateurs sélectionnés sont administrateurs</span>

            <List className="UserList">
                {
                    this.props.users.map((user) => {
                        let cName = ((null !== user) && (user.isAdmin())) ? "selected" : "";
                        return <ListItem className={cName} key={user.name} primaryText={user.name} onClick={() => {
                            if (user.name !== mainUser) {
                                let isAdmin = user.isAdmin();
                                this.props.toggleAdmin({'user': user.id, 'val': !isAdmin});
                            }
                        }
                        }/>
                    })
                }
            </List>
        </Dialog>
    }

}

export default withRouter(connect(
    state => ({
        dialogOpen: state.userpromoteReducer.open,
        users: state.userpromoteReducer.users,
        jwt: state.tokenReducer.token,
    }),
    dispatch => ({
        updateSnackbarAction: bindActionCreators(updateSnackbarAction, dispatch),
        toggleDialog: bindActionCreators(toggleDialogUserAction, dispatch),
        toggleAdmin: bindActionCreators(toggleAdminAction, dispatch),
    })
)(UserPromotion));