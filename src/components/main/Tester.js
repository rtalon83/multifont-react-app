import React, {Component} from "react";
import ReactDOM from "react-dom";
import {EVENT, Observer} from "../../utils/Observer";

class Tester extends Component {
    constructor(props) {
        super(props);

        // Test message to show
        this._testMessage = '';

        // Bind
        this.updateResult = this.updateResult.bind(this);

        // Listeners
        Observer.on(EVENT.UPDATE_RESULT, this.updateResult);
    }

    componentDidUpdate() {
        this.updateResult();
    }

    updateResult(event = null) {
        if (this.props.selectedfont == null) {
            return;
        }

        if (this.props.bitmapfonts.hasOwnProperty(this.props.selectedfont)) {
            const fontData = this.props.bitmapfonts[this.props.selectedfont];

            // ToDo, Array.from() IE 11 problem

            let canvas = ReactDOM.findDOMNode(this.refs.canvasTextResult);
            let ctx = canvas.getContext("2d");

            canvas.width = 1280;
            canvas.height = 768;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (event) {
                this._testMessage = event.currentTarget.value;
            }

            const charsToShow = this._testMessage.split('');
            const len = charsToShow.length;
            let i;
            let fromX = 0;
            let fromY = 0;

            for (i = 0; i < len; i++) {
                if (charsToShow[i] === "\n") {
                    fromY += this.props.bitmapfonts[this.props.selectedfont].lineHeight;
                    fromX = 0;
                }
                else if (charsToShow[i] === " ") {
                    fromX += this.props.bitmapfonts[this.props.selectedfont].spaceWidth;
                }
                else if (charsToShow[i] === "\r") {
                    fromX += this.props.bitmapfonts[this.props.selectedfont].tabWidth;
                }
                else {
                    const charData = fontData.getCharByText(charsToShow[i]);

                    if (charData) {
                        const xoffset = fromX + charData.xoffset;
                        const yoffset = fromY + charData.yoffset;

                        ctx.drawImage(charData.image, xoffset, yoffset);
                        fromX += charData.xadvance;
                    }
                }
            }
        }
    }

    render() {
        return (
            <div className="viewer-tester">
                <div className="tester-text">
                    <div className="tester-text-info">Write here</div>
                    <div>
                        <textarea className="text-area" ref="text_area" onChange={this.updateResult}/>
                    </div>
                </div>
                <div className="tester-view">
                    <div className="tester-text-info">Background</div>
                    <div className="canvas-text-result">
                        <canvas ref="canvasTextResult"/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Tester;
