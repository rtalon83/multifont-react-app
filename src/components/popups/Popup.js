import React, {Component} from "react";
import {EVENT, Observer} from "../../utils/Observer";
import {POPUP} from "./PopupType";

import loading from '../../images/loading.gif';
import error from '../../images/error.png';
import logo from '../../images/logo_app.png';
import appInfo from '../../../package.json';

import '../../styles/popup.css';

class Popup extends Component {
    constructor(props) {
        super(props);

        // Bind
        this.onShowPopup = this.onShowPopup.bind(this);
        this.onClosePopup = this.onClosePopup.bind(this);

        // Listeners
        Observer.on(EVENT.SHOW_POPUP, this.onShowPopup);
        Observer.on(EVENT.CLOSE_POPUP, this.onClosePopup);

        // Message
        this.state = {
            type: null,
            message: ''
        };
    }

    onClosePopup(event) {
        this.setState({
            type: null
        });
    }

    onShowPopup(data) {
        this.setState({
            message: data.message,
            type: data.type
        });
    }

    render() {
        let popup = <div></div>;
        if ( this.state.type ) {
            switch (this.state.type) {
                case POPUP.ABOUT: {
                    popup = <div className="popup">
                        <div className="popup-box popup-box-about">
                            <div className="popup-about-logo">
                                <img src={logo} alt="logo" />
                            </div>
                            <div className="popup-about-title popup-about-content">
                                MultiFont Packer {appInfo.version}
                            </div>
                            <hr/>
                            <table className="popup-about-content">
                                <tbody>
                                <tr>
                                    <td>GitHub</td>
                                    <td><a href={appInfo.github} target="_blank">{appInfo.github}</a></td>
                                </tr>
                                <tr>
                                    <td>Issues</td>
                                    <td><a href={appInfo.issues} target="_blank">{appInfo.issues}</a></td>
                                </tr>

                                <tr>
                                    <td>Libs</td>
                                    <td>
                                        <div>
                                            <a href="https://facebook.github.io/react" target="_blank">React</a>
                                        </div>
                                        <div>
                                            <a href="https://stuk.github.io/jszip" target="_blank">JSZip</a>
                                        </div>
                                        <div>
                                            <a href="https://github.com/eligrey/FileSaver.js" target="_blank">FileSaver.js</a>
                                        </div>
                                        <div>
                                            <a href="https://github.com/janl/mustache.js" target="_blank">mustache.js</a>
                                        </div>
                                        <div>
                                            <a href="https://github.com/06wj/MaxRectsBinPack" target="_blank">MaxRectsBinPack</a>
                                        </div>
                                        <div>
                                            <a href="https://www.npmjs.com/package/maxrects-packer" target="_blank">MaxRectsPacker</a>
                                        </div>
                                        <div>
                                            <a href="http://free-tex-packer.com/" target="_blank">Free Texture Packer</a>
                                        </div>
                                        <div>
                                            <a href="https://github.com/bmarwane/spriteSplitter" target="_blank">Sprite Splitter</a>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>Contributors</td>
                                    <td>
                                        Rubén Talón
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div>
                                <button className="app-button" onClick={this.onClosePopup}>OK</button>
                            </div>
                        </div>
                    </div>;
                    break;
                }
                case POPUP.LOADING: {
                    popup = <div className="popup">
                        <div className="popup-box popup-box-message">
                            <div className="popup-box-center popup-box-row">
                                <img src={loading} alt="loading" />
                            </div>
                            <div className="popup-box-center popup-box-row">
                                {this.state.message}
                            </div>
                        </div>
                    </div>;
                    break;
                }

                case POPUP.ERROR_EXPORTING: {
                    popup = <div className="popup">
                        <div className="popup-box popup-box-message">
                            <div className="popup-box-center popup-box-col">
                                <div className="popup-icon">
                                    <img alt="error" src={error} />
                                </div>
                                {this.state.message}
                            </div>
                            <div className="popup-box-center popup-box-col">
                                <button className="app-button" onClick={this.onClosePopup}>OK</button>
                            </div>
                        </div>
                    </div>;
                    break;
                }

                case POPUP.WARNING: {
                    popup = <div className="popup">
                        <div className="popup-box popup-box-message">
                            <div className="popup-box-center popup-box-col">
                                {this.state.message}
                            </div>
                            <div className="popup-box-center popup-box-col">
                                <button className="app-button" onClick={this.onClosePopup}>OK</button>
                            </div>
                        </div>
                    </div>;
                    break;
                }

                default: {
                    popup = <div></div>;
                }
            }
        }
        return (
            <div>{popup}</div>
        );
    }
}

export default Popup;
