import {v4 as uuidv4} from 'uuid';

class SpriteSplitter {
    constructor() {
        /**
         * @type {?Array<Object>}
         * @private
         */
        this._listSelections = null;

        /**
         * @type {Image}
         * @private
         */
        this._img = null;

        /**
         * @type {?Uint8ClampedArray}
         * @private
         */
        this._rawData = null;

        /**
         * @type {Object}
         * @private
         */
        this._refPixel = null;

        /**
         * @type {?string}
         * @private
         */
        this._fontName = null;

        /**
         * @type {HTMLCanvasElement}
         * @private
         */
        this._auxCanvas = document.createElement('canvas');
    }

    /**
     * @param img
     * @param {string} fontName
     * @returns {?Array<Object>}
     */
    split(img, fontName) {
        this._listSelections = [];
        this._img = img;
        this._fontName = fontName;

        this._auxCanvas.width = img.width;
        this._auxCanvas.height = img.height;

        this._auxCanvas.getContext('2d')
            .drawImage(img, 0, 0, img.width, img.height);
        this._rawData = this._auxCanvas.getContext('2d')
            .getImageData(0, 0, img.width, img.height).data;

        this._refPixel = this.getPixel(0, 0);

        let next = true;

        do {
            next = this.selectFrameAt();
        }
        while (next);

        return this._listSelections;
    }

    selectFrameAt() {
        let firstPixel = this.findNextStartPixel();

        if (this.isFinalPixel(firstPixel)) {
            return false;
        }

        let selection = this.selectFrame(firstPixel);

        if (selection) {
            //selection.id = Date.now(); // unique identification
            selection.id = uuidv4(); // ToDo make it easier
            selection.fontName = this._fontName;
            selection.imagedata = this._auxCanvas.getContext('2d')
                .getImageData(selection.x, selection.y, selection.width, selection.height);

            this._listSelections.push(selection);
        }

        return true;
    }

    selectFrame(firstPixel) {
        let selection = {
            id: 0,
            fontName: '',
            x: firstPixel.x,
            y: firstPixel.y,
            width: 1,
            height: 1,
            imagedata: null
        };

        this.expandFromPixel(selection);

        return selection
    }

    expandFromPixel(selection) {
        let isFinished = false;

        while (!isFinished) {
            let offset = this.expandFromAllDirections(selection);

            if (offset === 0) {
                isFinished = true
            }
        }
    }

    expandFromAllDirections(selection) {
        let offset = 0;

        offset += this.expandToTheRight(selection);
        offset += this.expandToTheBottom(selection);
        offset += this.expandToTheLeft(selection);
        offset += this.expandToTheTop(selection);

        return offset
    }

    expandToTheTop(selection) {
        let offset = 0;
        let isFinished = false;

        while (!isFinished) {
            if (this.isLineEmptyToTheTop(selection)) {
                isFinished = true;
                break
            }

            offset += 1;
            selection.y -= 1;
            selection.height += 1;
        }
        return offset
    }

    isLineEmptyToTheTop(selection) {
        let xToCheck = selection.x;
        let yToCheck = selection.y - 1;

        if (yToCheck < 0) {
            return true;
        }

        for (let x = xToCheck, max = (xToCheck + selection.width); x < max; x++) {
            if (!this.isEmptyPixel(this.getPixel(x, yToCheck))) {
                return false
            }
        }

        return true
    }

    expandToTheLeft(selection) {
        let offset = 0;
        let isFinished = false;

        while (!isFinished) {
            if (this.isLineEmptyToTheLeft(selection)) {
                isFinished = true;
                break
            }

            offset += 1;
            selection.x -= 1;
            selection.width += 1;
        }

        return offset
    }

    isLineEmptyToTheLeft(selection) {
        let xToCheck = selection.x - 1;
        let yToCheck = selection.y;

        if (xToCheck < 0) {
            return true;
        }

        for (let y = yToCheck, max = (yToCheck + selection.height); y < max; y++) {
            if (!this.isEmptyPixel(this.getPixel(xToCheck, y))) {
                return false
            }
        }

        return true
    }

    expandToTheRight(selection) {
        let offset = 0;
        let isFinished = false;

        while (!isFinished) {
            if (this.isLineEmptyToTheRight(selection)) {
                isFinished = true;
                break
            }

            offset += 1;
            selection.width += 1;
        }

        return offset
    }

    expandToTheBottom(selection) {
        let offset = 0;
        let isFinished = false;

        while (!isFinished) {
            if (this.isLineEmptyToTheBottom(selection)) {
                isFinished = true;
                break
            }
            else {
                offset += 1;
                selection.height += 1;
            }
        }

        return offset
    }

    isLineEmptyToTheBottom(selection) {
        let xToCheck = selection.x;
        let yToCheck = selection.y + selection.height;

        if (yToCheck > this._img.height) {
            return true;
        }

        for (let x = xToCheck, max = (xToCheck + selection.width); x < max; x++) {
            if (!this.isEmptyPixel(this.getPixel(x, yToCheck))) {
                return false
            }
        }

        return true
    }

    isLineEmptyToTheRight(selection) {
        let xToCheck = selection.x + selection.width;
        let yToCheck = selection.y;

        if (xToCheck > this._img.width) {
            return true;
        }

        for (let y = yToCheck, max = (yToCheck + selection.height); y < max; y++) {
            if (!this.isEmptyPixel(this.getPixel(xToCheck, y))) {
                return false
            }
        }

        return true
    }

    getPixel(x, y) {
        return {
            x: x,
            y: y,
            red: this._rawData[(this._img.width * y + x) * 4],
            green: this._rawData[(this._img.width * y + x) * 4 + 1],
            blue: this._rawData[(this._img.width * y + x) * 4 + 2],
            alpha: this._rawData[(this._img.width * y + x) * 4 + 3]
        }
    }

    isEmptyPixel(targetPixel) {
        return targetPixel.red === this._refPixel.red
            && targetPixel.blue === this._refPixel.blue
            && targetPixel.green === this._refPixel.green
            && targetPixel.alpha === this._refPixel.alpha
    }


    findNextStartPixel() {
        return this.searchPixel();
    }

    isFinalPixel(pixel) {
        return pixel === undefined || (pixel.x === this._img.width - 1 && pixel.y === this._img.height - 1)
    }

    searchPixel() {
        for (let y = 0, max = this._img.height; y < max; y++) {
            for (let x = 0, maxX = this._img.width; x < maxX; x++) {
                let targetPixel = this.getPixel(x, y);
                if (!this.isEmptyPixel(targetPixel) && !this.isPixelInSelections(this._listSelections, targetPixel)) {
                    //lastPixel = targetPixel;
                    return targetPixel;
                }
            }
        }
    }

    isPixelInSelections(selections, pixel) {
        return this.findSelectionOfPixel(selections, pixel).length > 0
    }

    findSelectionOfPixel(selections, pixel) {
        return selections.filter(function (selection) {
            let minX = selection.x;
            let minY = selection.y;

            let maxX = selection.x + selection.width;
            let maxY = selection.y + selection.height;

            if (pixel.x >= minX && pixel.x <= maxX && pixel.y >= minY && pixel.y <= maxY) {
                return selection
            }
            else {
                return false
            }
        })
    }
}

export default SpriteSplitter;
