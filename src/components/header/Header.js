import React, { Component } from 'react';
import '../../styles/header.css';

class Header extends Component
{
    render()
    {
        return (
            <div className="header">
                <div className="header-title">
                    <img src="images/logo_app.png" alt="logo"/>
                    <div className="title">MultiFont Packer BETA 0.1.3</div>
                </div>
            </div>
        )
    }
}

export default Header;
