import {
    toggleDialogAction,
    clearDialogAction,
    updateTypedAction,
    discoverDialogAction,
}                                                              from "../actions/addlinks_actions";
import {Dialog, Button, IconButton, List, ListItem, TextField} from "@material-ui/core/index.js";
import {updateSnackbarAction}                                  from "../actions/snackbar_actions";
import {bindActionCreators}                                    from "redux";
import React, {Component}                                      from 'react';
import {withRouter}                                            from "react-router-dom";
import {connect}                                               from "react-redux";

import '../assets/scss/AddLink.scss';
import DialogTitle                                             from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions                                           from "@material-ui/core/DialogActions/DialogActions";
import DialogContent                                           from "@material-ui/core/DialogContent/DialogContent";
import ChipInput                                               from "material-ui-chip-input";

class AddLink extends Component {


    handleClose() {
        this.props.clear();
        this.props.toggleDialog();
    }

    handleValidate() {
        if (this.props.typedTag.length > 0)
            this.props.updateSnackbarAction({open: true, message: 'Un tag est encore en édition !'});
        else
            this.props.discover({url: this.props.url, tags: this.props.tags});
    }

    handleTagRemove(tag) {
        let tags = this.props.tags.filter((t) => t.name !== tag.name);
        this.props.updateTyped({tags});
    }

    handleTagAdd(tag) {
        let exists = false;
        for (let a = 0; a < this.props.tags.length; ++a) {
            if (this.props.tags[a].name === tag) {
                exists = true;
            }
        }

        if (!exists)
            this.props.updateTyped({
                tags: [...this.props.tags, {id: tag, name: tag}],
            });
    }

    render() {
        console.log(this.props.tags);
        return <Dialog id="AddLink__Dialog" className="frame" aria-labelledby="addlink-title"
                       open={this.props.dialogOpen}
                       onClose={() => this.props.toggleDialog()}>
            <DialogTitle id="addlink-title">Ajouter un lien</DialogTitle>
            <DialogContent id="AddLinkDialog__Content">
                <TextField fullWidth label={"URL"} onChange={(val) => this.props.updateTyped({url: val.target.value})}/>
                <div id="AddLinkDialog__TagFields">
                    <ChipInput label="Tags" onAdd={(tag) => this.handleTagAdd(tag)} onDelete={(tag) => this.handleTagRemove(tag)} value={this.props.tags.map(val => val.name)}/>
                </div>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => this.handleClose()}>
                    Annuler
                </Button>,
                <Button color="primary" onClick={() => this.handleValidate()} disabled={this.props.url.length < 1}>
                    Ajouter
                </Button>
            </DialogActions>
        </Dialog>;
    }
}

export default withRouter(connect(
    state => ({
        dialogOpen: state.addlinksReducer.open,
        typedTag: state.addlinksReducer.typedTag,
        tags: state.addlinksReducer.tags,
        knownTags: state.filterReducer.tags,
        url: state.addlinksReducer.url,
    }),
    dispatch => ({
        clear: bindActionCreators(clearDialogAction, dispatch),
        toggleDialog: bindActionCreators(toggleDialogAction, dispatch),
        updateTyped: bindActionCreators(updateTypedAction, dispatch),
        discover: bindActionCreators(discoverDialogAction, dispatch),
        updateSnackbarAction: bindActionCreators(updateSnackbarAction, dispatch),
    }),
)(AddLink));