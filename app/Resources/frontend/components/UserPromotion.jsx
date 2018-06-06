import {toggleDialogUserAction, toggleAdminAction}    from "../actions/userpromote_actions";
import {Dialog, Button, List, ListItem, ListItemText} from "@material-ui/core/index.js";
import {updateSnackbarAction}                         from "../actions/snackbar_actions";
import {NO_TOKEN_AVAILABLE}                           from "../middleware/LocalStorageMiddleware";
import {bindActionCreators}                           from "redux";
import React, {Component}                             from 'react';
import jwt_decode                                     from 'jwt-decode';
import {withRouter}                                   from "react-router-dom";
import {connect}                                      from "react-redux";

import '../assets/scss/UserPromotion.scss';
import DialogTitle                                    from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent                                  from "@material-ui/core/DialogContent/DialogContent";
import DialogActions                                  from "@material-ui/core/DialogActions/DialogActions";

class UserPromotion extends Component {

    render() {
        let mainUser = '';

        if (undefined !== this.props.jwt && NO_TOKEN_AVAILABLE !== this.props.jwt && this.props.jwt.length > 0) {
            mainUser = (jwt_decode(this.props.jwt)).username;
        }

        return <Dialog open={this.props.dialogOpen} onClose={() => this.props.toggleDialog()}>
            <DialogTitle>Gestion des utilisateurs</DialogTitle>

            <DialogContent>
                <span>Les utilisateurs sélectionnés sont administrateurs</span>

                <List className="UserList">
                    {
                        this.props.users.map((user) => {
                            let cName = ((null !== user) && (user.isAdmin())) ? "selected" : "";
                            return <ListItem className={"listItem " + cName} key={user.name} onClick={() => {
                                if (user.name !== mainUser) {
                                    let isAdmin = user.isAdmin();
                                    this.props.toggleAdmin({'user': user.id, 'val': !isAdmin});
                                }
                            }}>
                                <ListItemText className="text" primary={user.name}/>
                            </ListItem>;

                        })
                    }
                </List>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => this.props.toggleDialog()}>
                    Quitter
                </Button>
            </DialogActions>
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