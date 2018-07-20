import {modifiedLinkAction, modifyLinkAction, updateEditingAction} from "../actions/links_actions";
import {bindActionCreators}                                        from "redux";
import DialogActions                                               from '@material-ui/core/DialogActions';
import DialogContent                                               from '@material-ui/core/DialogContent';
import DialogTitle                                                 from '@material-ui/core/DialogTitle';
import {TextField}                                                 from "@material-ui/core/index";
import ChipInput                                                   from "material-ui-chip-input";
import {connect}                                                   from "react-redux";
import Button                                                      from '@material-ui/core/Button';
import Dialog                                                      from '@material-ui/core/Dialog';
import React                                                       from 'react';
import "../assets/scss/EditLink.scss";

class EditDialog extends React.Component {

    handleClose() {
        this.props.togglePopup({eltEdit: null});
    }

    handleEdit(eltEdit) {
        this.props.edit(eltEdit);
    }

    handleTagAdd(tag) {
        this.props.updateTyped({tags: [...this.props.editingFrame.tags, tag]});
    }

    handleTagRemove(tag) {
        let tags = this.props.editingFrame.tags.filter((t) => t !== tag);
        this.props.updateTyped({tags});
    }

    render() {

        let isOpen = undefined !== this.props.editingElement && null !== this.props.editingElement;

        return (
            <Dialog
                open={isOpen}
                onClose={() => this.handleClose()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Modification"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label={"URL"} value={this.props.editingFrame.url}
                               onChange={(val) => this.props.updateTyped({url: val.target.value})}/>
                    <TextField fullWidth className="mt-10" label={"Titre"} value={this.props.editingFrame.name}
                               onChange={(val) => this.props.updateTyped({name: val.target.value})}/>
                    <TextField fullWidth className="mt-10" label={"Description"} value={this.props.editingFrame.description}
                               onChange={(val) => this.props.updateTyped({description: val.target.value})} multiline/>
                    <ChipInput fullWidth className="mt-10" label="Tags" onAdd={(tag) => this.handleTagAdd(tag)}
                               onDelete={(tag) => this.handleTagRemove(tag)}
                               value={this.props.editingFrame.tags}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => this.handleClose()} color="secondary">
                        Annuler
                    </Button>
                    <Button onClick={() => this.handleEdit(this.props.editingFrame)} color="primary" autoFocus>
                        Éditer
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default connect(
    state => ({
        editingElement: state.linksReducer.editingElement,
        editingFrame: state.linksReducer.editingFrame,
    }),
    dispatch => ({
        togglePopup: bindActionCreators(modifyLinkAction, dispatch),
        updateTyped: bindActionCreators(updateEditingAction, dispatch),
        edit: bindActionCreators(modifiedLinkAction, dispatch),
    }),
)(EditDialog);