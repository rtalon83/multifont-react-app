import {EVENT, Observer} from "../../../utils/Observer";
import React, {Component} from 'react';
import {ImagesLoader} from "../../../utils/ImagesLoader";
import AtlasItems from "./AtlasItems";
import {POPUP} from "../../popups/PopupType";

import '../../../styles/atlaslist.css';


class AtlasList extends Component {
    constructor(props) {
        super(props);

        // Bind
        this.onFilesDrop = this.onFilesDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onLoadImagesComplete = this.onLoadImagesComplete.bind(this);

        this.state = {
            atlas: {}
        }
    }

    onFilesDrop(event) {
        event.preventDefault();

        if (event.dataTransfer.files.length) {

            Observer.emit(EVENT.SHOW_POPUP, {
                message: 'Loading, please wait',
                type: POPUP.LOADING
            });

            const loader = new ImagesLoader();
            loader.load(event.dataTransfer.files, this.onLoadImagesComplete)
        }

        return false;
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onLoadImagesComplete(event) {
        const names = Object.keys(event);

        if (names.length) {
            let atlas = this.state.atlas;

            for (const name of names) {
                atlas[name] = event[name];
            }

            this.setState({
                atlas: atlas
            });

            Observer.emit(EVENT.ATLAS_LIST_CHANGED, atlas);
        }
    }

    render() {
        const dropHelp = Object.keys(this.state.atlas).length > 0 ? null : (<div ref="dropHelp" className="image-drop-help">drag'n'drop images here</div>);

        return (
            <div className="atlas-list" onDrop={this.onFilesDrop} onDragOver={this.onDragOver}>
                <div>
                    <AtlasItems data={this.state.atlas}/>
                    {dropHelp}
                </div>
            </div>
        );
    }
}

export default AtlasList;
