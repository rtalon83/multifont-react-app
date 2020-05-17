import Character from "./Character";
import EventEmitter from "eventemitter3";

class BitmapFontData extends EventEmitter {
    constructor(fontName, image) {
        super();

        /**
         * @type {string} font name
         * @private
         */
        this._name = fontName.split('.')
            .slice(0, -1)
            .join('.');

        /**
         * @type {string}
         * @private
         */
        this._fileName = fontName;

        /**
         * @type {Image}
         * @private
         */
        this._image = image;

        /**
         * @type {number} font size
         * @private
         */
        this._size = 0;

        /**
         * @type {number}
         * @private
         */
        this._lineHeight = 0;

        /**
         * @type {number}
         * @private
         */
        this._spaceWidth = 0;

        /**
         * @type {number}
         * @private
         */
        this._tabWidth = 0;

        /**
         * @type {boolean}
         * @private
         */
        this._monospace = false;

        /**
         * @type {number}
         * @private
         */
        this._monospaceValue = 0;

        /**
         * @type {Object}
         * @private
         */
        this._characters = {};
    }

    get characters() {
        return this._characters;
    }

    set characters(value) {
        const len = value.length;
        let i;
        let maxWidth = 0;
        let maxHeight = 0;

        for (i = 0; i < len; i++) {
            this._characters[value[i].id] = new Character();

            // default value
            this._characters[value[i].id].xadvance = value[i].width;

            maxWidth = value[i].width > maxWidth ? value[i].width : maxWidth;
            maxHeight = value[i].height > maxHeight ? value[i].height : maxHeight;
        }

        this._monospaceValue = maxWidth;
        this._lineHeight = maxHeight;
        this._size = maxHeight;

        // ToDo default values
        this._spaceWidth = 20;
        this._tabWidth = 30;
    }

    /**
     * @param charId
     * @returns {null|Character}
     */
    getCharById(charId) {
        let chara = null;

        if (this._characters.hasOwnProperty(charId)) {
            chara = this._characters[charId];
        }

        return chara;
    }

    /**
     * @param text
     * @returns {null|Character}
     */
    getCharByText(text) {
        let chara = null;

        for (const charId in this._characters) {
            if (this._characters.hasOwnProperty(charId)) {
                if (this._characters[charId].text === text) {
                    chara = this._characters[charId];
                }
            }
        }

        return chara;
    }

    setCharMonospace() {
        for (const charId in this._characters) {
            if (this._characters.hasOwnProperty(charId)) {
                this._characters[charId].xoffset = (this._monospaceValue - this._characters[charId].frame.w) / 2.0;
                this._characters[charId].xadvance = this._monospaceValue + (this._monospaceValue - this._characters[charId].frame.w) / 2.0;
            }
        }
    }

    get spaceWidth() {
        return this._spaceWidth;
    }

    set spaceWidth(value) {
        this._spaceWidth = value;
    }

    get tabWidth() {
        return this._tabWidth
    }

    set tabWidth(value) {
        this._tabWidth = value;
    }

    get monospace() {
        return this._monospace;
    }

    set monospace(value) {
        this._monospace = value;
    }

    get monospaceValue() {
        return this._monospaceValue;
    }

    set monospaceValue(value) {
        this._monospaceValue = value;
    }

    get lineHeight() {
        return this._lineHeight;
    }

    set lineHeight(value) {
        this._lineHeight = value;
    }

    get size() {
        return this._size;
    }

    set size(value) {
        this._size = value;
    }

    get name() {
        return this._name;
    }

    get fileName() {
        return this._fileName;
    }
}

export default BitmapFontData;
