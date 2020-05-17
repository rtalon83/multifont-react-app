import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import packers, {getPackerByType} from '../../utils/packing/packers';
import {EVENT, Observer} from '../../utils/Observer';
import {TEXTURES_BACKGROUND as Textures} from "../../model/constants/background";
import list from '../../utils/exporter/list';
import Exporter from "../../utils/exporter/Export";

import '../../styles/properties.css';

class Properties extends Component {
    constructor(props) {
        super(props);

        this.changeTab = this.changeTab.bind(this);
        this.toggleChange = this.toggleChange.bind(this);
        this.onFontPropChanged = this.onFontPropChanged.bind(this);
        this.onPackerChange = this.onPackerChange.bind(this);
        this.startExport = this.startExport.bind(this);
        this.onFontSelected = this.onFontSelected.bind(this);
        this.onCharSelected = this.onCharSelected.bind(this);
        this.setBack = this.setBack.bind(this);
        this.onToggleSwitchChange = this.onToggleSwitchChange.bind(this);
        this.onExporterChanged = this.onExporterChanged.bind(this);
        this.onDimChanged = this.onDimChanged.bind(this);

        this.methodItems = null;
        this.packOptions = this.setPackDefault();
        this.updatePackerMethods();

        this.state = {
            multiTexture: false,
            textureBack: 'grid-back',
            packer: this.packOptions.packer,
            selectedFont: '',
            selectedChar: ''
        };

        Observer.on(EVENT.FONT_SELECTED, this.onFontSelected);
        Observer.on(EVENT.CHAR_SELECTED, this.onCharSelected);
    }

    onExporterChanged(event) {
        const exporter = Exporter.getExporterByType(ReactDOM.findDOMNode(this.refs.exporter).value);

        ReactDOM.findDOMNode(this.refs.allowRotation).disabled = !exporter.allowRotation;
        ReactDOM.findDOMNode(this.refs.allowTrim).disabled = !exporter.allowTrim;
        ReactDOM.findDOMNode(this.refs.trimmode).disabled = !exporter.allowTrim;

        ReactDOM.findDOMNode(this.refs.toggleSwitch).disabled = !(exporter.allowMultiFont && exporter.allowOneFont);

        if (ReactDOM.findDOMNode(this.refs.toggleSwitch).disabled) {
            ReactDOM.findDOMNode(this.refs.toggleSwitch).checked = exporter.allowMultiFont;
        }

        this.packOptions.exporter = exporter;
        this.packOptions.allowTrim = exporter.allowTrim;
        this.packOptions.allowRotation = exporter.allowRotation;

        this.emitChanges();
    }

    onFontSelected(data) {
        this.state.selectedFont = data.selectedFont;
        this.updateFontProps();
    }

    onCharSelected(data) {
        this.state.selectedChar = data.selectedChar;
        this.state.selectedFont = data.selectedFont;
        this.updateFontProps();
    }

    updateFontProps() {
        if (this.state.selectedFont) {
            this.packOptions.selectedFont = this.state.selectedFont;

            const fontData = this.props.bitmapfonts[this.state.selectedFont];

            ReactDOM.findDOMNode(this.refs.bmpfSelected).value = this.state.selectedFont;
            ReactDOM.findDOMNode(this.refs.size).value = fontData.size;
            ReactDOM.findDOMNode(this.refs.lineHeight).value = fontData.lineHeight;
            ReactDOM.findDOMNode(this.refs.spaceWidth).value = fontData.spaceWidth;
            ReactDOM.findDOMNode(this.refs.tabWidth).value = fontData.tabWidth;
            ReactDOM.findDOMNode(this.refs.monoSpace).checked = fontData.monospace;

            const charData = fontData.getCharById(this.state.selectedChar);

            if (charData) {
                ReactDOM.findDOMNode(this.refs.selectedChar).value = charData.text;
                ReactDOM.findDOMNode(this.refs.asciiCode).value = charData.code;
                ReactDOM.findDOMNode(this.refs.xOffSet).value = charData.xoffset;
                ReactDOM.findDOMNode(this.refs.yOffSet).value = charData.yoffset;
                ReactDOM.findDOMNode(this.refs.xAdvance).value = charData.xadvance;
            }
            else {
                ReactDOM.findDOMNode(this.refs.xOffSet).value = 0;
                ReactDOM.findDOMNode(this.refs.yOffSet).value = 0;
                ReactDOM.findDOMNode(this.refs.xAdvance).value = 0;
            }
        }
    }

    emitChanges() {
        let data = Object.assign({}, this.packOptions);
        data.packer = getPackerByType(data.packer);

        Observer.emit(EVENT.PACK_OPTIONS_CHANGED, data);
    }

    setPackDefault() {
        let data = {};

        data.selectedFont = null;
        data.multiFont = false;
        data.exporter = list[0];
        data.fileName = 'pack-result';
        data.textureName = 'texture';
        data.textureFormat = 'png';
        data.scale = 1;
        data.width = 2048;
        data.height = 2048;
        data.fixedSize = false;
        data.powerOfTwo = false;
        data.allowRotation = false;
        data.allowTrim = false;
        data.trimMode = 'trim';
        data.detectIdentical = true;
        data.packer = packers[0].type;
        data.packerMethod = Object.keys(packers[0].methods)[0];

        return data;
    }

    componentDidMount() {
        // Pack properties selected
        document.getElementById("id_button_pack")
            .click();
        this.emitChanges();
    }

    changeTab(event) {
        if (event.currentTarget.id === 'id_button_pack') {
            ReactDOM.findDOMNode(this.refs.tab_font).style.display = "none";
            ReactDOM.findDOMNode(this.refs.tab_properties).style.display = "block";

            let refTabButtonPack = ReactDOM.findDOMNode(this.refs.tab_button_pack);
            refTabButtonPack.className += " active";

            let refTabButtonFont = ReactDOM.findDOMNode(this.refs.tab_button_font);
            refTabButtonFont.className = refTabButtonFont.className.replace(" active", "");
        }
        else {
            ReactDOM.findDOMNode(this.refs.tab_font).style.display = "block";
            ReactDOM.findDOMNode(this.refs.tab_properties).style.display = "none";

            let refTabButtonFont = ReactDOM.findDOMNode(this.refs.tab_button_font);
            refTabButtonFont.className += " active";

            let refTabButtonPack = ReactDOM.findDOMNode(this.refs.tab_button_pack);
            refTabButtonPack.className = refTabButtonPack.className.replace(" active", "");
        }
    }

    updatePackerMethods() {
        let currentPacker = getPackerByType(this.packOptions.packer);

        if (!currentPacker) {
            currentPacker = packers[0];
        }

        this.methodItems = [];

        let methods = Object.keys(currentPacker.methods);
        for (let item of methods) {
            this.methodItems.push(<option value={item} key={"packer-method-" + item}>{item}</option>);
        }

        this.packOptions.packerMethod = methods[0];
    }

    onPackerChange(event) {
        this.packOptions.packer = ReactDOM.findDOMNode(this.refs.packer).value;
        this.updatePackerMethods();

        this.setState({
            packer: this.packOptions.packer
        });

        this.emitChanges();
    }

    onFontPropChanged(event) {
        this.props.bitmapfonts[this.state.selectedFont].size = Number(ReactDOM.findDOMNode(this.refs.size).value);
        this.props.bitmapfonts[this.state.selectedFont].lineHeight = Number(ReactDOM.findDOMNode(this.refs.lineHeight).value);
        this.props.bitmapfonts[this.state.selectedFont].spaceWidth = Number(ReactDOM.findDOMNode(this.refs.spaceWidth).value);
        this.props.bitmapfonts[this.state.selectedFont].tabWidth = Number(ReactDOM.findDOMNode(this.refs.tabWidth).value);
        this.props.bitmapfonts[this.state.selectedFont].monospace = ReactDOM.findDOMNode(this.refs.monoSpace).checked;

        if (this.props.bitmapfonts[this.state.selectedFont].monospace) {
            this.props.bitmapfonts[this.state.selectedFont].setCharMonospace();
        }
        else {
            const charData = this.props.bitmapfonts[this.state.selectedFont].getCharById(this.state.selectedChar);

            if (charData) {
                this.props.bitmapfonts[this.state.selectedFont].characters[this.state.selectedChar].xoffset = Number(ReactDOM.findDOMNode(this.refs.xOffSet).value);
                this.props.bitmapfonts[this.state.selectedFont].characters[this.state.selectedChar].yoffset = Number(ReactDOM.findDOMNode(this.refs.yOffSet).value);
                this.props.bitmapfonts[this.state.selectedFont].characters[this.state.selectedChar].xadvance = Number(ReactDOM.findDOMNode(this.refs.xAdvance).value);
            }
        }

        Observer.emit(EVENT.UPDATE_RESULT);
    }

    toggleChange(event) {
        this.packOptions.fileName = ReactDOM.findDOMNode(this.refs.fileName).value;
        this.packOptions.textureFormat = ReactDOM.findDOMNode(this.refs.textureFormat).value;
        this.packOptions.textureName = ReactDOM.findDOMNode(this.refs.textureName).value;
        this.packOptions.scale = ReactDOM.findDOMNode(this.refs.scale).value;
        this.packOptions.width = ReactDOM.findDOMNode(this.refs.width).value;
        this.packOptions.height = ReactDOM.findDOMNode(this.refs.height).value;
        this.packOptions.fixedSize = ReactDOM.findDOMNode(this.refs.fixedSize).checked;
        this.packOptions.powerOfTwo = ReactDOM.findDOMNode(this.refs.powerOfTwo).checked;
        this.packOptions.detectIdentical = ReactDOM.findDOMNode(this.refs.detectIdentical).checked;
        this.packOptions.allowTrim = ReactDOM.findDOMNode(this.refs.allowTrim).checked;
        this.packOptions.allowRotation = ReactDOM.findDOMNode(this.refs.allowRotation).checked;
        this.packOptions.packer = ReactDOM.findDOMNode(this.refs.packer).value;
        this.packOptions.packerMethod = ReactDOM.findDOMNode(this.refs.packerMethod).value;

        // emit changes
        this.emitChanges();
    }

    startExport() {
        Observer.emit(EVENT.START_EXPORT);
    }

    setBack(event) {
        let classNames = event.target.className.split(" ");

        Observer.emit(EVENT.BACKGROUND_TEXTURE_CHANGED, classNames[1]);
    }

    onToggleSwitchChange(event) {
        this.packOptions.multiFont = event.currentTarget.checked;

        // emit changes
        this.emitChanges();
    }

    onDimChanged(event) {
        if (event) {
            let key = event.keyCode || event.which;
            if (key === 13) {
                if ( event.currentTarget.value === '' ) {
                    event.currentTarget.value = 1;
                }
                this.toggleChange();
            }
        }
    }

    render() {
        return (
            <div className="properties">
                <div className="tabs">
                    <div className="tab">
                        <button ref="tab_button_pack" id="id_button_pack" className="tab-button"
                                onClick={this.changeTab}>Pack Properties
                        </button>
                        <button ref="tab_button_font" id="id_button_font" className="tab-button"
                                onClick={this.changeTab}>Font Properties
                        </button>
                    </div>
                    <div ref="tab_properties" className="tab-content">
                        <div className="properties-input">
                            <span className="properties-input-item">Pack Name</span>
                            <input className="properties-input-field" ref="fileName"
                                   defaultValue={this.packOptions.fileName}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Texture Name</span>
                            <input className="properties-input-field" ref="textureName"
                                   defaultValue={this.packOptions.textureName}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Format</span>
                            <select className="properties-input-field" ref="textureFormat"
                                    defaultValue={this.packOptions.textureFormat} onChange={this.toggleChange}>
                                <option value="png">png</option>
                                <option value="jpg">jpg</option>
                            </select>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Exporter</span>
                            <select className="properties-input-field" ref="exporter" onChange={this.onExporterChanged}
                                    defaultValue={this.packOptions.exporter}>
                                {list.map(node => {
                                    return (<option key={"exporter-" + node.type}
                                                    defaultValue={node.type}>{node.type}</option>)
                                })}
                            </select>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Scale</span>
                            <input className="properties-input-field" ref="scale"
                                   defaultValue={this.packOptions.scale}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Width</span>
                            <input className="properties-input-field" ref="width" type="number" min="0" onKeyDown={this.onDimChanged}
                                   defaultValue={this.packOptions.width}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Height</span>
                            <input className="properties-input-field" ref="height" type="number" min="0" onKeyDown={this.onDimChanged}
                                   defaultValue={this.packOptions.height}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Fixed size</span>
                            <label className="checkbox-container">
                                <input type="checkbox" ref="fixedSize"
                                       defaultChecked={this.packOptions.fixedSize ? "checked" : ""}
                                       onChange={this.toggleChange}/>
                                <span className="checkmark"/>
                            </label>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Power of two</span>
                            <label className="checkbox-container">
                                <input type="checkbox" ref="powerOfTwo" onChange={this.toggleChange}
                                       defaultChecked={this.packOptions.powerOfTwo ? "checked" : ""}/>
                                <span className="checkmark"/>
                            </label>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Allow Rotation</span>
                            <label className="checkbox-container">
                                <input type="checkbox" ref="allowRotation"
                                       disabled={!this.packOptions.exporter.allowRotation}
                                       onChange={this.toggleChange}
                                       defaultChecked={this.packOptions.allowRotation ? "checked" : ""}/>
                                <span className="checkmark"/>
                            </label>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Allow Trim</span>
                            <label className="checkbox-container">
                                <input type="checkbox" ref="allowTrim" onChange={this.toggleChange}
                                       disabled={!this.packOptions.exporter.allowTrim}
                                       defaultChecked={this.packOptions.allowTrim ? "checked" : ""}/>
                                <span className="checkmark"/>
                            </label>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Trim mode</span>
                            <select className="properties-input-field" ref="trimmode">
                                <option value="trim">Trim</option>
                                <option value="crop">Crop</option>
                            </select>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Detect identical</span>
                            <label className="checkbox-container">
                                <input type="checkbox" ref="detectIdentical" onChange={this.toggleChange}
                                       defaultChecked={this.packOptions.detectIdentical ? "checked" : ""}/>
                                <span className="checkmark"/>
                            </label>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Packer</span>
                            <select className="properties-input-field" ref="packer" onChange={this.onPackerChange}>
                                {
                                    packers.map(node => {
                                        return (<option key={"packer-" + node.type}
                                                        defaultValue={node.type}>{node.type}</option>)
                                    })
                                }
                            </select>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Method</span>
                            <select className="properties-input-field" ref="packerMethod" onChange={this.toggleChange}
                                    disabled={this.packOptions.packer === "OptimalPacker"}>
                                {this.methodItems}
                            </select>
                        </div>
                        <div className="bg-texture-container">
                            Background texture
                            <div className="bg-texture-container-buttons">
                                {Textures.map(name => {
                                    return (
                                        <div key={"bg-texture-" + name}>
                                            <div
                                                className={"bg-texture-button " + name + (this.state.textureBack === name ? " selected" : "")}
                                                onClick={this.setBack}>&nbsp;</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="bg-texture-container properties-input properties-switch">
                            <div className="properties-switch-op">One Font</div>
                            <div>
                                <label className="switch">
                                    <input type="checkbox" ref="toggleSwitch" onClick={this.onToggleSwitchChange}/>
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="properties-switch-op">Multi Font</div>
                        </div>
                    </div>
                    <div ref="tab_font" className="tab-content">
                        <div className="properties-input">
                            <span className="properties-input-item">BitmapFont</span>
                            <input className="properties-input-field" ref="bmpfSelected" defaultValue="" readOnly
                                   disabled/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Monospace</span>
                            <label className="checkbox-container">
                                <input type="checkbox" ref="monoSpace" onChange={this.onFontPropChanged}/>
                                <span className="checkmark"/>
                            </label>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Font size</span>
                            <input className="properties-input-field" type="number" ref="size" defaultValue="0"
                                   onChange={this.onFontPropChanged}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Line height</span>
                            <input className="properties-input-field" type="number" ref="lineHeight" defaultValue="0"
                                   onChange={this.onFontPropChanged}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Space width</span>
                            <input className="properties-input-field" type="number" ref="spaceWidth" defaultValue="0"
                                   onChange={this.onFontPropChanged}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">Tab width</span>
                            <input className="properties-input-field" type="number" ref="tabWidth" defaultValue="0"
                                   onChange={this.onFontPropChanged}/>
                        </div>
                        <br/>
                        <hr/>
                        <div className="properties-input">
                            <span className="properties-input-item">Selected Char</span>
                            <input className="properties-input-field" ref="selectedChar" defaultValue="" readOnly
                                   disabled/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">ASCII Code</span>
                            <input className="properties-input-field" ref="asciiCode" defaultValue="" readOnly
                                   disabled/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">xoffset</span>
                            <input className="properties-input-field" type="number" ref="xOffSet" defaultValue="0"
                                   onChange={this.onFontPropChanged}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">yoffset</span>
                            <input className="properties-input-field" type="number" ref="yOffSet" defaultValue="0"
                                   onChange={this.onFontPropChanged}/>
                        </div>
                        <div className="properties-input">
                            <span className="properties-input-item">xadvance</span>
                            <input className="properties-input-field" type="number" ref="xAdvance" defaultValue="0"
                                   onChange={this.onFontPropChanged}/>
                        </div>
                    </div>
                </div>
                <div>
                    <button className="app-button" ref="exportButton" onClick={this.startExport}>EXPORT</button>
                </div>
            </div>
        );
    }
}

export default Properties;


