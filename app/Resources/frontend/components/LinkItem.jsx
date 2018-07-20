import {ContextMenu, Item, theme, ContextMenuProvider} from 'react-contexify';
import React, {Component}                              from 'react';
import {withRouter}                                    from "react-router-dom";
import {connect}                                       from "react-redux";

import 'react-contexify/dist/ReactContexify.min.css';
import {bindActionCreators}                            from "redux";
import {askRemoveLinkAction, modifyLinkAction}         from "../actions/links_actions";

class LinkItem extends Component {

    handleRemove(eltRemove) {
        this.props.toggleRemove({eltRemove});
    }

    handleEdit(eltEdit) {
        this.props.toggleEdit({eltEdit});
    }

    generateMenu() {
        let tempThis = this;
        return <ContextMenu id={this.props.link.id} theme={theme.dark}>
            <Item onClick={() => {
                tempThis.handleEdit(this.props.link);
            }}>Modifier</Item>
            <Item onClick={() => {
                tempThis.handleRemove(this.props.link);
            }}>Supprimer</Item>
        </ContextMenu>;
    }

    render() {
        const fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAYAAAA8AXHiAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4gQSByAxWd0b4AAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAARjSURBVHja7d3JbuswDIVhilAXtrvog/T9n6ubRBsD6aJwb26RyYlpm+R/loGQCR8sWQNdPj8/T3KWUor0fS/DMEitVQi5l3Ec5XA4yPF4lNPph5P+bXQ6neR4PMrhcJBxHPnXyGxUIiJaShFwkSVRiYho3/cCLrIkKhERHYZBwEWWRFVKEa21CrjIkqj6vv8ZvIOLLIlqGIZ/d4XgIkuhqrX+P90ALrIEKpEL81jgIq+iuggLXORVVFdhgYu8guomLHCB6llUd2GBC1TPoHoIFrhANRfVw7DABaq526l0zoeDC1SP7tHTuV8CXKAygQUuUJnBAheozGCBC1RmsMAFKjNY4AKVGSxwgcoMFrhAZQYLXKAygwUuUJnBAlduVKawwJUXlTkscOVEtQoscOVDtRoscOVCtSoscOVBtToscOVAtQkscMVHtRkscMVGtSkscMVFtTkscMVEtQtY4IqHajewwBUL1a5ggSsOqt3BAlcMVLuEBS7/qHYLC1y+Ue0aVmZc3lHtHlZGXBFQuYCVCVcUVG5gZcAVCZUrWJFxRUPlDlZEXBFRuYQVCVdUVG5hRcAVGZVrWJ5xRUflHpZHXBlQhYDlCVcWVGFgecCVCVUoWHvGlQ1VOFh7xJURVUhYe8KVFVVYWHvAlRlVaFhb4sqOKjysLXCBKgmsNXGBKhmsNXCBKiksS1ygSg7LAheogLU4LlABa3FcoALW4rhA9cB/K8kz4RKRi1AmXCLy2w5UwFoU1/R6aw1UwFr+ynUpoGKM9fSYC1TAWg0XqIA1G1fXdXfbdl0HKmARYG2YaZ6qtXa3bWuNUuHcFT6O6to81d+cT0VMXeKcgT9XLFDdxNVak6+vL65cwJqHarr7u7X8M70HuOgKZ6GaJlBLKVcnUVtrUkphSQdU8xeUh2H4RXRvbTErLgXV/AXlaZ7r2kCdZ/8khvXq1pdaq3x8fEjXdeAC1jKopjZvb2/y/v7O41mAtfwmPR7PAiyznZ/gSgzLejsxuBLCWmuPOrgSwVr74AO4EsDa6jQNuALD2vqIVnZcCiq7JZfMuBRUtsmKS0El4AKWP1RZcSmowAUsx6iy4VJQgQtYAVBlwaWgApfJb/P0Zc9PwkQpJTS3PpeXPfSuYI3j+Ht2L1J9qoi41BOqqUuIWPQsWreonlBFr6QXCZd6QXVroB6plFAUXOod1fkZvyiJgKt6RhW56Jn3AX31iipDeUbPuBRUdIvhYYEqDi4FFbjCwgJVPFwKKnCFgwWquLgUVOAKAwtU8XEpqMDlHhao8uBSUIHLLSxQ5cOloAKXO1igyotLQQUuC1wKKnBZ4FJQgcsCl4IKXBa4FFTgssCloAKXBS4FFbgscCmowGWBS0EFLgtcCipwWeBSUIHLApeCiljgUlARC1wKKmKBS0FFLHApqIgFLgUVscCloCIWuBRUxAKXgopY4KqgInNwiTxYthJUxAKXgopYdIsKKmKBS0FFLHApqIgFLgUVscD1DbwFQjt2EBaXAAAAAElFTkSuQmCC";
        let imageURL        = this.props.link.image;

        if (!imageURL || 0 === imageURL.length)
            imageURL = fallbackImage;

        let content = <div className={"item"} onClick={() => window.open(this.props.link.url, "_blank").focus()}>
            <img src={imageURL} onError={(elt) => {
                elt.target.src = fallbackImage;
            }} alt={this.props.link.title}/>
            <div>
                    <span>
                        {this.props.link.name}
                    </span>
                <span>
                        {this.props.link.url}
                    </span>
            </div>
        </div>;

        if (null !== this.props.user && this.props.user.isAdmin()) {
            content = <ContextMenuProvider id={this.props.link.id}>
                {content}
            </ContextMenuProvider>;
        }

        return <div id={this.props.link.id}>
            {content}
            {this.generateMenu()}
        </div>;
    }

}

export default withRouter(connect(
    state => ({
        user: state.tokenReducer.user,
        elementRemove: state.linksReducer.elementRemove,
    }),
    dispatch => ({
        toggleRemove: bindActionCreators(askRemoveLinkAction, dispatch),
        toggleEdit: bindActionCreators(modifyLinkAction, dispatch),
    }),
)(LinkItem));
