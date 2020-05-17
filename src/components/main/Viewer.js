import React, {Component} from 'react';
import {EVENT, Observer} from "../../utils/Observer";
import TextureView from "./TextureView";
import Tester from "./Tester";

import '../../styles/viewer.css';

class Viewer extends Component {
    constructor(props) {
        super(props);

        this.onFontSelected = this.onFontSelected.bind(this);
        this.onCharSelected = this.onCharSelected.bind(this);
        this.onCharChanged = this.onCharChanged.bind(this);
        this.onChangeBackgroundTexture = this.onChangeBackgroundTexture.bind(this);
        this.blurHandler = this.blurHandler.bind(this);

        this.state = {
            textureBack: 'grid-texture',
            packResult: null,
            selectedChar: null,
            selectedFont: null
        };

        Observer.on(EVENT.FONT_SELECTED, this.onFontSelected);
        Observer.on(EVENT.CHAR_SELECTED, this.onCharSelected);
        Observer.on(EVENT.PACK_COMPLETED, this.updateViewer, this);
        Observer.on(EVENT.BACKGROUND_TEXTURE_CHANGED, this.onChangeBackgroundTexture);
    }

    onChangeBackgroundTexture(data) {
        this.setState({
            textureBack: data
        });
    }

    onCharSelected(data) {
        this.setState({
            selectedChar: data.selectedChar,
            selectedFont: data.selectedFont
        });
    }

    onCharChanged(data) {
        const charData = this.props.bitmapfonts[this.state.selectedFont].getCharById(this.state.selectedChar);
        if (charData) {
            charData.text = data.currentTarget.value;
        }

        Observer.emit(EVENT.CHAR_SELECTED, {
            selectedChar: this.state.selectedChar,
            selectedFont: this.state.selectedFont
        });
    }

    onFontSelected(data) {
        this.setState({
            selectedFont: data.selectedFont,
            selectedChar: null
        });
    }

    updateViewer(data) {
        if (!this.state.selectedFont) {
            this.state.selectedFont = data[0].selectedFont;
        }

        this.state.selectedChar = null;
        this.setState({packResult: data});
    }

    blurHandler() {
        this.setState({
            selectedChar: null
        });
    }

    render() {
        let views = [], ix = 0;
        let input = [];

        if (this.state.packResult) {
            for (let item of this.state.packResult) {
                views.push((
                    <TextureView key={"tex-view-" + ix}
                                 buffer={item.buffer}
                                 textureBack={this.state.textureBack}
                                 bitmapfonts={this.props.bitmapfonts}
                                 scale={1.0}
                                 multifont={item.multifont}
                                 selectedChar={this.state.selectedChar}
                                 selectedFont={this.state.selectedFont}/>
                ));

                ix++;
            }
        }

        if (this.state.selectedChar) {
            for (const fontId in this.props.bitmapfonts) {
                if (this.props.bitmapfonts.hasOwnProperty(fontId)) {
                    const charData = this.props.bitmapfonts[fontId].getCharById(this.state.selectedChar);

                    if (charData) {
                        input.push(<input
                            onChange={this.onCharChanged}
                            key={"id" + this.state.selectedChar}
                            maxLength="1"
                            id={this.state.selectedChar}
                            defaultValue={charData.text}
                            autoFocus={true}
                            className="input-letter"
                            style={
                                {
                                    left: charData.frame.x,
                                    top: charData.frame.y,
                                }
                            }/>);

                        break;
                    }
                }
            }
        }

        return (
            <div className="viewer-main">
                <div className="viewer">
                    <div className="result-view-container">
                        <div className="viewer-texture">
                            <div className="viewer-input" onBlur={this.blurHandler} tabIndex={0}>
                                {input}
                            </div>
                            {views}
                        </div>
                    </div>
                    <Tester bitmapfonts={this.props.bitmapfonts} selectedfont={this.state.selectedFont}/>
                </div>
            </div>
        );
    }
}

export default Viewer;
