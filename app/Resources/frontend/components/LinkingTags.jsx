import {linkingClickAction, linkTagAction, toggleLinkingAction} from "../actions/linkingtags_actions";
import {Dialog, Button, List, ListItem} from "@material-ui/core/index.js";
import {updateSnackbarAction} from "../actions/snackbar_actions";
import {bindActionCreators}   from "redux";
import React, {Component}     from 'react';
import {withRouter}           from "react-router-dom";
import {connect}              from "react-redux";

import '../assets/scss/LinkTags.scss';
import DialogActions          from "@material-ui/core/DialogActions/DialogActions";
import DialogTitle            from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent          from "@material-ui/core/DialogContent/DialogContent";
import ListItemText           from "@material-ui/core/ListItemText/ListItemText";

import ArrowIcon  from "@material-ui/icons/ArrowBack";

class LinkingTags extends Component {

    handleClose() {
        this.props.clickTagAction({masterTag: null, slaveTag: null});
        this.props.toggleDialog();
    }

    handleValidate() {
        this.props.linkTagsAction({masterTag: this.props.masterTag, slaveTag: this.props.slaveTag});
    }

    handleTagClick(tag) {
        let value = {masterTag: this.props.masterTag, slaveTag: this.props.slaveTag};

        if (this.props.masterTag === tag) {
            value.masterTag = null;
        } else if (this.props.slaveTag === tag) {
            value.slaveTag = null;
        } else if (this.props.masterTag == null) {
            value.masterTag = tag;
        } else if (this.props.slaveTag == null) {
            value.slaveTag = tag;
        }

        this.props.clickTagAction(value);
    }

    clearField(field) {
        let value = {masterTag: this.props.masterTag, slaveTag: this.props.slaveTag};

        switch (field) {
            case 0:
                value.masterTag = null;
                break;
            case 1:
                value.slaveTag = null;
                break;
            default:
                return;
        }

        this.props.clickTagAction(value);
    }

    render() {
        return <Dialog open={this.props.dialogOpen} onClose={() => this.props.toggleDialog()}>
            <DialogTitle>
                Lier des tags
            </DialogTitle>
            <DialogContent id="TagLink__Dialog">
                <div id="taglink-show">
                    <Button onClick={() => this.clearField(0)}>
                        {this.props.masterTag != null ? this.props.masterTag.name : ""}
                    </Button>
                    <ArrowIcon/>
                    <Button onClick={() => this.clearField(1)}>
                        {this.props.slaveTag != null ? this.props.slaveTag.name : ""}
                    </Button>
                </div>
                <List id="addLinkTaglist">
                    {
                        this.props.tags.map((tag) => {
                            return <ListItem className="listItem" key={tag.id} onClick={() => this.handleTagClick(tag)}>
                                <ListItemText className="text" primary={"#" + tag.name} />
                            </ListItem>;
                        })
                    }
                </List>
            </DialogContent>
            <DialogActions>
                <Button colors="primary" onClick={() => this.handleClose()}>
                    Annuler
                </Button>
                <Button colors="primary" onClick={() => this.handleValidate()} disabled={this.props.masterTag === null || this.props.slaveTag === null}>
                    Lier
                </Button>
            </DialogActions>
        </Dialog>;
    }
}

export default withRouter(connect(
    state => ({
        dialogOpen: state.linkingTagsReducer.open,
        tags: state.filterReducer.tags,
        masterTag: state.linkingTagsReducer.masterTag,
        slaveTag: state.linkingTagsReducer.slaveTag

    }),
    dispatch => ({
        toggleDialog: bindActionCreators(toggleLinkingAction, dispatch),
        updateSnackbarAction: bindActionCreators(updateSnackbarAction, dispatch),
        clickTagAction: bindActionCreators(linkingClickAction, dispatch),
        linkTagsAction: bindActionCreators(linkTagAction, dispatch)
    })
)(LinkingTags));