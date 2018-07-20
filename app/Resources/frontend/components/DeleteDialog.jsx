import React from 'react';
import { bindActionCreators } from "redux";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { askRemoveLinkAction, fullyRemoveLinkAction } from "../actions/links_actions";
import { connect } from "react-redux";

class DeleteDialog extends React.Component {

    handleClose() {
        this.props.togglePopup({ eltRemove: null });
    }

    handleRemove(eltRemove) {
        this.props.remove({eltRemove});
    }

    render() {

        let isOpen = undefined !== this.props.removableElement && null !== this.props.removableElement;
        let title  = (isOpen) ? this.props.removableElement.name : "";

        return (
            <Dialog
                open={isOpen}
                onClose={() => this.handleClose()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title">{"Suppression d'un élément"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Vous essayez de supprimer ce lien. Êtes vous sûr ?
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        {title}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleClose()} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={() => this.handleRemove(this.props.removableElement)} color="primary" autoFocus>
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect(
    state => ({
        removableElement: state.linksReducer.removableElement
    }),
    dispatch => ({
        togglePopup: bindActionCreators(askRemoveLinkAction, dispatch),
        remove     : bindActionCreators(fullyRemoveLinkAction, dispatch)
    }),
)(DeleteDialog);