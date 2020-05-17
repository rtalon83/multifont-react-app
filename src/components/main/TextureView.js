import React from 'react';
import ReactDOM from 'react-dom';
import {EVENT, Observer} from "../../utils/Observer";

import '../../styles/viewer.css';

class TextureView extends React.Component {
    constructor(props) {
        super(props);

        this.onViewClick = this.onViewClick.bind(this);
    }

    componentDidMount() {
        this.updateView();
    }

    componentDidUpdate() {
        this.updateView();
    }

    updateView() {
        let view = ReactDOM.findDOMNode(this.refs.view);
        if (view) {
            view.width = this.props.buffer.width;
            view.height = this.props.buffer.height;

            view.style.width = Math.floor(view.width * this.props.scale) + "px";
            view.style.height = Math.floor(view.height * this.props.scale) + "px";

            let ctx = view.getContext("2d");

            ctx.clearRect(0, 0, view.width, view.height);
            // ctx.rect(0, 0, view.width, view.height);
            // ctx.fillStyle = 'red';
            // ctx.fill();

            if (this.props.selectedChar) {
                ctx.globalAlpha = 0.35;
            }

            ctx.drawImage(this.props.buffer, 0, 0, view.width, view.height, 0, 0, view.width, view.height);

            // if(this.props.displayOutline) {
            //     for (let item of this.props.data.data) {
            //         if(!item.cloned) {
            //             this.drawOutline(ctx, item);
            //         }
            //     }
            // }

            ctx.globalAlpha = 1;

            if (this.props.selectedChar) {
                for (const fontId in this.props.bitmapfonts) {
                    if (this.props.bitmapfonts.hasOwnProperty(fontId)) {
                        const fontData = this.props.bitmapfonts[fontId];

                        if (fontData.characters.hasOwnProperty(this.props.selectedChar)) {
                            const charData = fontData.characters[this.props.selectedChar];

                            let frame = charData.frame;

                            let w = frame.w, h = frame.h;
                            if (charData.rotated) {
                                w = frame.h;
                                h = frame.w;
                            }

                            ctx.clearRect(frame.x, frame.y, w, h);
                            ctx.drawImage(this.props.buffer, frame.x, frame.y, w, h, frame.x, frame.y, w, h);

                            //if(this.props.displayOutline) this.drawOutline(ctx, item);

                            ctx.beginPath();

                            //if(ctx.setLineDash) ctx.setLineDash([4, 2]);
                            //ctx.strokeStyle = "#000";
                            //ctx.lineWidth = 2;
                            ctx.rect(frame.x, frame.y, w, h);

                            ctx.stroke();
                        }
                    }
                }
            }

            view.className = this.props.textureBack;
        }
    }

    drawOutline(ctx, item) {
        let frame = item.frame;
        let w = frame.w, h = frame.h;
        if (item.rotated) {
            w = frame.h;
            h = frame.w;
        }

        ctx.strokeStyle = "#00F";
        ctx.fillStyle = "rgba(0,0,255,0.25)";
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.fillRect(frame.x, frame.y, w, h);
        ctx.rect(frame.x, frame.y, w, h);
        ctx.moveTo(frame.x, frame.y);
        ctx.lineTo(frame.x + w, frame.y + h);
        ctx.stroke();
    }

    getCharByClick(fontData, x, y) {
        let charFound = null;

        for (const charId in fontData.characters) {
            if (fontData.characters.hasOwnProperty(charId)) {
                const charData = fontData.characters[charId];

                let w = charData.frame.w;
                let h = charData.frame.h;
                if (charData.rotated) {
                    w = charData.frame.h;
                    h = charData.frame.w;
                }

                if (x >= charData.frame.x && x < charData.frame.x + w && y >= charData.frame.y && y < charData.frame.y + h) {
                    charFound = charId;
                    break;
                }
            }
        }

        return charFound;
    }

    onViewClick(event) {
        let selectedChar = null;
        let selectedFont = this.props.selectedFont;

        const canvas = ReactDOM.findDOMNode(this.refs.view);
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / this.props.scale;
        const y = (event.clientY - rect.top) / this.props.scale;

        // multifont mode, search in every fonts
        if (this.props.multifont) {
            for (const fontId in this.props.bitmapfonts) {
                if (this.props.bitmapfonts.hasOwnProperty(fontId)) {
                    let charClicked = this.getCharByClick(this.props.bitmapfonts[fontId], x, y);
                    if (charClicked) {
                        selectedChar = charClicked;
                        selectedFont = fontId;
                        break;
                    }
                }
            }
        }
        else { // simple font, search in a font
            let charClicked = this.getCharByClick(this.props.bitmapfonts[this.props.selectedFont], x, y);
            if (charClicked) {
                selectedChar = charClicked;
                selectedFont = this.props.selectedFont;
            }
        }

        if (selectedChar) {
            this.updateView();

            Observer.emit(EVENT.CHAR_SELECTED, {
                selectedChar: selectedChar,
                selectedFont: selectedFont
            });
        }

        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    render() {
        return (
            <div ref="back">
                <canvas ref="view" onClick={this.onViewClick}/>
            </div>
        );
    }
}

export default TextureView;
