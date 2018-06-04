import { linkingClickAction, linkTagAction, toggleLinkingAction } from "../actions/linkingtags_actions";
import { Dialog, FlatButton, FontIcon, List, ListItem } from "material-ui";
import { updateSnackbarAction } from "../actions/snackbar_actions";
import { bindActionCreators } from "redux";
import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import '../assets/scss/LinkTags.scss';

class LinkingTags extends Component {

    handleClose() {
        this.props.clickTagAction({ masterTag: null, slaveTag: null });
        this.props.toggleDialog();
    }

    handleValidate() {
        this.props.linkTagsAction({ masterTag: this.props.masterTag, slaveTag: this.props.slaveTag });
    }

    handleTagClick(tag) {
        let value = { masterTag: this.props.masterTag, slaveTag: this.props.slaveTag };

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
        let value = { masterTag: this.props.masterTag, slaveTag: this.props.slaveTag };

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
        let actions = [
            <FlatButton
                label="Annuler"
                primary={true}
                onClick={() => this.handleClose()}
            />,
            <FlatButton
                label="Lier"
                primary={true}
                onClick={() => this.handleValidate()}
                disabled={this.props.masterTag === null || this.props.slaveTag === null}
            />,
        ];

        return <Dialog title="Lier des tags" actions={actions} modal={false} open={this.props.dialogOpen}
                       onRequestClose={() => this.props.toggleDialog()}>
            <div id="taglink-show">
                <FlatButton label={this.props.masterTag != null ? this.props.masterTag.name : ""}
                            onClick={() => this.clearField(0)}/>
                <FontIcon className="Icon-Arrowequals"/>
                <FlatButton label={this.props.slaveTag != null ? this.props.slaveTag.name : ""}
                            onClick={() => this.clearField(1)}/>
            </div>
            <List id="addLinkTaglist">
                {
                    this.props.tags.map((tag) => {
                        return <ListItem primaryText={"#" + tag.name} key={tag.id}
                                         onClick={() => this.handleTagClick(tag)}/>;
                    })
                }
            </List>
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