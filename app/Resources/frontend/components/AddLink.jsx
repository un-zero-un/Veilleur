import {
    toggleDialogAction,
    clearDialogAction,
    updateTypedAction,
    discoverDialogAction
} from "../actions/addlinks_actions";
import { Dialog, FlatButton, IconButton, List, ListItem, TextField } from "material-ui";
import { updateSnackbarAction } from "../actions/snackbar_actions";
import { bindActionCreators } from "redux";
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import '../assets/scss/AddLink.scss';

class AddLink extends Component {


    handleClose() {
        this.props.clear();
        this.props.toggleDialog();
    }

    handleValidate() {
        if (this.props.typedTag.length > 0)
            this.props.updateSnackbarAction({ open: true, message: 'Un tag est encore en édition !' });
        else
            this.props.discover({ url: this.props.url, tags: this.props.tags });
    }

    handleTagRemove(tag) {
        let tags = this.props.tags.filter((t) => t.name !== tag.name);
        console.log(tags);
        this.props.updateTyped({ tags });
    }

    handleTagAdd() {
        let tag = this.props.typedTag;

        if (tag.trim().length < 1)
            return;

        let exists = false;
        for (let a = 0; a < this.props.tags.length; ++a)
            if (this.props.tags[ a ].name === tag)
                exists = true;

        if (!exists)
            this.props.updateTyped({
                tags: [ ...this.props.tags, { id: tag, name: tag } ],
                typedTag: '',
            });
        else
            this.props.updateTyped({ typedTag: '' });
    }

    keypressed(e) {
        if (13 === e.keyCode) {
            this.handleTagAdd();
        }
    }

    render() {
        let actions = [
            <FlatButton
                label="Annuler"
                primary={true}
                onClick={() => this.handleClose()}
            />,
            <FlatButton
                label="Ajouter"
                primary={true}
                onClick={() => this.handleValidate()}
                disabled={this.props.url.length < 1}
            />,
        ];

        return <Dialog title="Ajouter un lien" actions={actions} modal={false} open={this.props.dialogOpen}
                       onRequestClose={() => this.props.toggleDialog()}>
            <TextField floatingLabelText={"URL"} style={{ width: '100%' }} className="addLinkURL"
                       onChange={(val) => this.props.updateTyped({ url: val.target.value })}/>
            <div className={"addLinkURL"}>
                <TextField floatingLabelText={"Tags"} value={this.props.typedTag} onKeyDown={(e) => this.keypressed(e)}
                           onChange={(elt) => (this.props.updateTyped({ typedTag: elt.target.value }))}/>
                <IconButton iconClassName="Icon-Add" onClick={() => this.handleTagAdd()}/>
            </div>
            <List id="addLinkTaglist">
                {
                    this.props.tags.map((tag) => {
                        return <ListItem primaryText={"#" + tag.name} key={tag.id}
                                         onClick={() => this.handleTagRemove(tag)}/>;
                    })
                }
            </List>
        </Dialog>;
    }
}

export default withRouter(connect(
    state => ({
        dialogOpen: state.addlinksReducer.open,
        typedTag: state.addlinksReducer.typedTag,
        tags: state.addlinksReducer.tags,
        knownTags: state.filterReducer.tags,
        url: state.addlinksReducer.url
    }),
    dispatch => ({
        clear: bindActionCreators(clearDialogAction, dispatch),
        toggleDialog: bindActionCreators(toggleDialogAction, dispatch),
        updateTyped: bindActionCreators(updateTypedAction, dispatch),
        discover: bindActionCreators(discoverDialogAction, dispatch),
        updateSnackbarAction: bindActionCreators(updateSnackbarAction, dispatch)
    })
)(AddLink));