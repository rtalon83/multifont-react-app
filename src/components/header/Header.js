import React, {Component} from 'react';
import {EVENT, Observer} from "../../utils/Observer";
import {POPUP} from "../popups/PopupType";

import appInfo from '../../../package.json';
import logo from '../../images/logo_app.png';

import '../../styles/header.css';

class Header extends Component {
    constructor(props) {
        super(props);

        // Bind
        this.onAboutClicked = this.onAboutClicked.bind(this);
    }

    onAboutClicked(event) {
        Observer.emit(EVENT.SHOW_POPUP, {
            type: POPUP.ABOUT
        })
    }

    render() {
        return (
            <div className="header">
                <div className="header-title">
                    <img src={logo} alt="logo"/>
                    <div className="title">MultiFont Packer BETA {appInfo.version}</div>
                </div>
                <div className="about">
                    <span onClick={this.onAboutClicked}>ABOUT</span>
                </div>
            </div>
        )
    }
}

export default Header;
