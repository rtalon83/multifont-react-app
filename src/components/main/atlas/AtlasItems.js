import React, {Component} from 'react';
import ReactDOM from "react-dom";
import {EVENT, Observer} from "../../../utils/Observer";

import '../../../styles/atlasitems.css';

class AtlasItems extends Component {
    constructor(props) {
        super(props);

        // Bind
        this.onSelect = this.onSelect.bind(this);

        this._divSelected = null;
    }

    onSelect(event) {
        Observer.emit(EVENT.FONT_SELECTED, {
            selectedFont: event.currentTarget.id,
            selectedChar: null
        });

        event.currentTarget.className = "item-wrapper" + " item-selected";

        if ( this._divSelected ) {
            this._divSelected.className = 'item-wrapper';
        }

        this._divSelected = event.currentTarget;

        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    componentDidUpdate() {
        if ( this.props.data && this._divSelected == null ) {
            this._divSelected = ReactDOM.findDOMNode(this.refs.it_0);
            this._divSelected.className = 'item-wrapper' + ' item-selected';
        }
    }

    render() {
        const keys = Object.keys(this.props.data);

        if (keys.length > 0) {
            const list = keys.map((item, index) =>
                <div key={"id_" + index} className="item-wrapper" id={item} ref={'it_' + index} onClick={this.onSelect}>
                    <div className="item-image-container">
                        <img className="item-image" alt={'imagen'} src={this.props.data[item].src}/>
                    </div>
                    <div className="item-text-container">{item}</div>
                </div>
            );

            return (
                <div>
                    {list}
                </div>
            )
        }
        else {
            return (<span></span>);
        }
    }
}

export default AtlasItems;
