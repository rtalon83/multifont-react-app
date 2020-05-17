import {EVENT, Observer} from "./utils/Observer";

import React, {Component} from 'react';
import Header from "./components/header/Header";
import Viewer from "./components/main/Viewer";
import AtlasList from "./components/main/atlas/AtlasList";
import Properties from "./components/main/Properties";
import SpriteSplitter from "./utils/SpriteSplitter";
import BitmapFontData from "./model/BitmapFontData";
import PackProcessor from "./utils/packing/PackProcessor";
import TextureRenderer from "./utils/TextureRenderer";
import Exporter from "./utils/exporter/Export";

import './styles/app.css';

//import Tesseract from 'tesseract.js/dist/tesseract.min';
//import { createWorker } from 'tesseract.js';

class App extends Component {
    constructor(props) {
        super(props);

        // Bind
        this.onAtlasListChanged = this.onAtlasListChanged.bind(this);
        this.onCharImageLoaded = this.onCharImageLoaded.bind(this);
        this.onPackOptionsChanged = this.onPackOptionsChanged.bind(this);
        this.startExport = this.startExport.bind(this);
        this.onFontSelected = this.onFontSelected.bind(this);

        // Data
        this._bitmapFonts = {};

        // Packing algorithm result
        this._packResult = null;

        // charas images
        this._packCharas = null;

        // Packing Options
        this._packOptions = {};

        // Tools
        this._spriteSplitter = new SpriteSplitter();

        this._totalCharasToLoad = 0;
        this._numCharasLoaded = 0;

        this._selectedFont = null;

        // Global Listeners
        Observer.on(EVENT.ATLAS_LIST_CHANGED, this.onAtlasListChanged);
        Observer.on(EVENT.PACK_OPTIONS_CHANGED, this.onPackOptionsChanged);
        Observer.on(EVENT.START_EXPORT, this.startExport);
        Observer.on(EVENT.FONT_SELECTED, this.onFontSelected);
    }

    onFontSelected(data) {
        this._selectedFont = data.selectedFont;

        this._packCharas = this.getImageCharas();
        this.doPack();
    }

    onPackOptionsChanged(data) {
        this._packOptions = data;

        if (data.selectedFont) {
            this._selectedFont = data.selectedFont;
        }

        this._packCharas = this.getImageCharas();
        this.doPack();
    }

    onAtlasListChanged(data) {
        let listCharas = [];

        for (const fontName in data) {
            if (data.hasOwnProperty(fontName)) {
                const img = data[fontName];

                if (!this._bitmapFonts.hasOwnProperty(fontName)) {
                    this._bitmapFonts[fontName] = new BitmapFontData(fontName, img);

                    let charas = this._spriteSplitter.split(img, fontName);
                    this._totalCharasToLoad += charas.length;

                    this._bitmapFonts[fontName].characters = charas;
                    listCharas = listCharas.concat(charas);
                }
            }
        }

        /// Test Tesseract

        // Tesseract.recognize(
        //     listCharas[0].imagedata,
        //     'eng',
        //     { logger: m => console.log(m) }
        // ).then(({ data: { text } }) => {
        //     console.log(text);
        // });

        // const worker = createWorker({
        //     logger: m => console.log(m)
        // });
        //
        // (async () => {
        //     await worker.load();
        //     await worker.loadLanguage('eng');
        //     await worker.initialize('eng');
        //     const { data: { text } } = await worker.recognize(listCharas[0].imagedata);
        //     console.log(text);
        //     await worker.terminate();
        // })();

        ///

        const auxCanvas = document.createElement('canvas');
        const auxCtx = auxCanvas.getContext('2d');

        const len = listCharas.length;
        let i;

        for (i = 0; i < len; i++) {
            auxCanvas.width = listCharas[i].imagedata.width;
            auxCanvas.height = listCharas[i].imagedata.height;

            auxCtx.putImageData(listCharas[i].imagedata, 0, 0);

            let image = new Image();

            this._bitmapFonts[listCharas[i].fontName].characters[listCharas[i].id].image = image;

            image.addEventListener('load', this.onCharImageLoaded);
            image._base64 = auxCanvas.toDataURL(); // ToDo
            image._id = listCharas[i].id;
            image._fontName = listCharas[i].fontName;
            image.width = listCharas[i].imagedata.width;
            image.height = listCharas[i].imagedata.height;
            image.src = auxCanvas.toDataURL();
        }
    }

    onCharImageLoaded(event) {
        event.target.removeEventListener('load', this.onCharImageLoaded);
        this._numCharasLoaded++;

        if (this._numCharasLoaded === this._totalCharasToLoad) {
            this._totalCharasToLoad = 0; // reset
            this._numCharasLoaded = 0;

            // It's firts load, then, load firts font.
            if (!this._selectedFont) {
                this._selectedFont = Object.keys(this._bitmapFonts)[0];
                this._packOptions.selectedFont = this._selectedFont;

                Observer.emit(EVENT.FONT_SELECTED, {
                    selectedFont: this._selectedFont
                })
            }

            this._packCharas = this.getImageCharas();
            this.doPack();
        }
    }

    getImageCharas() {
        if (!this._selectedFont) {
            return;
        }

        let data = {};

        if (this._packOptions.multiFont) {
            for (const fontName in this._bitmapFonts) {
                for (const charId in this._bitmapFonts[fontName].characters) {
                    if (this._bitmapFonts[fontName].characters.hasOwnProperty(charId)) {
                        data[charId] = this._bitmapFonts[fontName].characters[charId].image;
                    }
                }
            }
        }
        else {
            for (const charId in this._bitmapFonts[this._selectedFont].characters) {
                if (this._bitmapFonts[this._selectedFont].characters.hasOwnProperty(charId)) {
                    data[charId] = this._bitmapFonts[this._selectedFont].characters[charId].image;
                }
            }
        }

        return data;
    }

    updateBitmapFonts(data) {
        let i;
        const len = data.length;

        for (i = 0; i < len; i++) {
            const fontId = data[i].file;
            const charId = data[i].charId;

            this._bitmapFonts[fontId].characters[charId].frame.x = data[i].frame.x;
            this._bitmapFonts[fontId].characters[charId].frame.y = data[i].frame.y;
            this._bitmapFonts[fontId].characters[charId].frame.w = data[i].frame.w;
            this._bitmapFonts[fontId].characters[charId].frame.h = data[i].frame.h;
            this._bitmapFonts[fontId].characters[charId].sourceSize.w = data[i].sourceSize.w;
            this._bitmapFonts[fontId].characters[charId].sourceSize.h = data[i].sourceSize.h;
            this._bitmapFonts[fontId].characters[charId].spriteSourceSize.x = data[i].spriteSourceSize.x;
            this._bitmapFonts[fontId].characters[charId].spriteSourceSize.y = data[i].spriteSourceSize.y;
            this._bitmapFonts[fontId].characters[charId].spriteSourceSize.w = data[i].spriteSourceSize.w;
            this._bitmapFonts[fontId].characters[charId].spriteSourceSize.h = data[i].spriteSourceSize.h;
            this._bitmapFonts[fontId].characters[charId].rotated = data[i].rotated;
        }
    }

    doPack() {
        if (this._packCharas == null) {
            return;
        }

        const keys = Object.keys(this._packCharas);

        if (keys.length > 0) {
            PackProcessor.pack(this._packCharas, this._packOptions, (res) => {
                this._packResult = [];

                for (let data of res) {
                    let renderer = new TextureRenderer(data, this._packOptions);

                    this.updateBitmapFonts(data);

                    this._packResult.push({
                        buffer: renderer.buffer,
                        renderer: renderer,
                        multifont: this._packOptions.multiFont,
                        selectedFont: this._selectedFont
                    });
                }

                Observer.emit(EVENT.PACK_COMPLETED, this._packResult);

            }, null);
        }
    }

    startExport() {
        try {
            let promise = Exporter.startExporter(this._packResult[0].buffer,
                this._bitmapFonts,
                this._packOptions);
        }
        catch (e) {
            console.error("Error exporting");
        }
    }

    render() {
        return (
            <div className="app-main">
                <div className="app-wrapper">
                    <Header/>
                    <div className="app-layout">
                        <AtlasList/>
                        <Properties bitmapfonts={this._bitmapFonts}/>
                        <Viewer bitmapfonts={this._bitmapFonts}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
