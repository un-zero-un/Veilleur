import {
    Dialog,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Popover,
    Typography
}                             from "@material-ui/core/index.js";
import {
    toggleDialogUserAction,
    toggleAdminAction,
    showAskRemoveUserAction,
    fullyRemoveUserAction
}                             from "../actions/userpromote_actions";
import {updateSnackbarAction} from "../actions/snackbar_actions";
import {NO_TOKEN_AVAILABLE}   from "../middleware/LocalStorageMiddleware";
import {bindActionCreators}   from "redux";
import React, {Component}     from 'react';
import DialogContent          from "@material-ui/core/DialogContent/DialogContent";
import DialogActions          from "@material-ui/core/DialogActions/DialogActions";
import {withRouter}           from "react-router-dom";
import DialogTitle            from "@material-ui/core/DialogTitle/DialogTitle";
import jwt_decode             from 'jwt-decode';
import {connect}              from "react-redux";
import Switch                 from '@material-ui/core/Switch';
import DeleteIcon             from '@material-ui/icons/Delete';
import ClearIcon              from '@material-ui/icons/Clear';
import DoneIcon               from '@material-ui/icons/Done';

import '../assets/scss/UserPromotion.scss';

class UserPromotion extends Component {


    closePopup(name) {
        // Should not work, should be !== but ???????
        this.props.togglePopup({element: null, popOpened: this.props.popOpened.filter((elt) => elt.name === name)});
    }

    handleClick(elt, name) {
        this.props.togglePopup({element: elt.currentTarget, popOpened: [...this.props.popOpened, name]})
    }

    render() {
        let mainUser = '';

        if (undefined !== this.props.jwt && NO_TOKEN_AVAILABLE !== this.props.jwt && this.props.jwt.length > 0) {
            mainUser = (jwt_decode(this.props.jwt)).username;
        }

        let users = [];

        let tempThis = this;
        this.props.users.forEach(function (elt) {
            let isAdmin = elt.isAdmin();
            let isMe    = elt.name === mainUser;

            let action = () => {
                if (!isMe) {
                    tempThis.props.toggleAdmin({'user': elt.id, 'val': !isAdmin});
                }
            };

            let cName = (null !== elt && isAdmin) ? "selected" : "";

            let item = <ListItem className={"listItem " + cName} key={elt.name}>
                <ListItemText className="text" primary={elt.name}/>
                <ListItemSecondaryAction>
                    <Switch disabled={isMe} onChange={action} checked={isAdmin}/>
                    <IconButton disabled={isMe} onClick={(evt) => {
                        tempThis.handleClick(evt, elt.name)
                    }}>
                        <DeleteIcon/>
                    </IconButton>
                    <Popover open={tempThis.props.popOpened.includes(elt.name)} anchorEl={tempThis.props.elementRemove}
                             onClose={() => {
                                 tempThis.closePopup(elt.name)
                             }} anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                             transformOrigin={{vertical: 'top', horizontal: 'center'}}>
                        <div className="Popup">
                            <Typography>Voulez vous vraiment supprimer {elt.name} ?</Typography>
                            <IconButton onClick={() => {
                                tempThis.props.remUser({id: elt.id});
                                tempThis.closePopup(elt.name);
                            }}>
                                <DoneIcon/>
                            </IconButton>

                            <IconButton onClick={() => {
                                tempThis.closePopup(elt.name)
                            }}>
                                <ClearIcon/>
                            </IconButton>
                        </div>
                    </Popover>
                </ListItemSecondaryAction>

            </ListItem>;

            users.push(item);
        });

        return <Dialog open={this.props.dialogOpen} onClose={() => this.props.toggleDialog()}>
            <DialogTitle>Gestion des utilisateurs</DialogTitle>

            <DialogContent>
                <span>Les utilisateurs sélectionnés sont administrateurs</span>

                <List className="UserList">
                    {users}
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
        elementRemove: state.userpromoteReducer.element,
        popOpened: state.userpromoteReducer.popOpened
    }),
    dispatch => ({
        updateSnackbarAction: bindActionCreators(updateSnackbarAction, dispatch),
        toggleDialog: bindActionCreators(toggleDialogUserAction, dispatch),
        toggleAdmin: bindActionCreators(toggleAdminAction, dispatch),
        togglePopup: bindActionCreators(showAskRemoveUserAction, dispatch),
        remUser: bindActionCreators(fullyRemoveUserAction, dispatch)
    })
)(UserPromotion));