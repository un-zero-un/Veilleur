import {
    toggleDialogAction,
    clearDialogAction,
    updateTypedAction,
    discoverDialogAction
}                                                              from "../actions/addlinks_actions";
import {Dialog, Button, IconButton, List, ListItem, TextField} from "@material-ui/core/index.js";
import {updateSnackbarAction}                                  from "../actions/snackbar_actions";
import {bindActionCreators}                                    from "redux";
import React, {Component}                                      from 'react';
import {withRouter}                                            from "react-router-dom";
import {connect}                                               from "react-redux";

import AddIcon       from "@material-ui/icons/Add";

import '../assets/scss/AddLink.scss';
import DialogTitle   from "@material-ui/core/DialogTitle/DialogTitle";
import ListItemText  from "@material-ui/core/ListItemText/ListItemText";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";

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
        console.log(tags);
        this.props.updateTyped({tags});
    }

    handleTagAdd() {
        let tag = this.props.typedTag;


        if (tag.trim().length < 1)
            return;

        let exists = false;
        for (let a = 0; a < this.props.tags.length; ++a)
            if (this.props.tags[a].name === tag)
                exists = true;

        if (!exists)
            this.props.updateTyped({
                tags: [...this.props.tags, {id: tag, name: tag}],
                typedTag: '',
            });
        else
            this.props.updateTyped({typedTag: ''});
    }

    keypressed(e) {
        if (13 === e.keyCode) {
            this.handleTagAdd();
        }
    }

    render() {
        return <Dialog id="AddLink__Dialog" className="frame" aria-labelledby="addlink-title" open={this.props.dialogOpen}
                       onClose={() => this.props.toggleDialog()}>
            <DialogTitle id="addlink-title">Ajouter un lien</DialogTitle>
            <DialogContent id="AddLinkDialog__Content">
                <TextField fullWidth label={"URL"} onChange={(val) => this.props.updateTyped({url: val.target.value})}/>
                <div id="AddLinkDialog__TagFields">
                    <div>
                        <TextField fullWidth label={"Tags"} value={this.props.typedTag} onKeyDown={(e) => this.keypressed(e)}
                               onChange={(elt) => (this.props.updateTyped({typedTag: elt.target.value}))}/>
                    </div>
                    <IconButton onClick={() => this.handleTagAdd()}>
                        <AddIcon/>
                    </IconButton>
                </div>
                <List id="addLinkTaglist">
                    {
                        this.props.tags.map((tag) => {
                            return <ListItem className={"listItem"} key={tag.id}
                                             onClick={() => this.handleTagRemove(tag)}>
                                <ListItemText className={"text"} primary={"#" + tag.name}/>
                            </ListItem>;
                        })
                    }
                </List>
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