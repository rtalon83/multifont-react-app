class Character
{
    constructor()
    {
        /**
         * @type {string}
         * @private
         */
        this._text = '';

        /**
         * ASCII code
         * @type {number}
         * @private
         */
        this._code = -1;

        /**
         * @type {{w: number, x: number, h: number, y: number}}
         * @private
         */
        this._frame = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };

        /**
         * @type {{w: number, h: number}}
         * @private
         */
        this._sourceSize = {
            w: 0,
            h: 0
        };

        /**
         *
         * @type {{w: number, x: number, h: number, y: number}}
         * @private
         */
        this._spriteSourceSize = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        };

        /**
         * @type {HTMLImageElement} HTML Image
         */
        this._image = null;

        /**
         * @type {boolean}
         * @private
         */
        this._rotated = false;

        /**
         * @type {number}
         * @private
         */
        this._xoffset = 0;

        /**
         * @type {number}
         * @private
         */
        this._yoffset = 0;

        /**
         * @type {number}
         * @private
         */
        this._xadvance = 0;
    }

    set rotated(value)
    {
        this._rotated = value;
    }

    get rotated()
    {
        return this._rotated;
    }

    set frame(value)
    {
        this._frame = value;
    }

    get frame()
    {
        return this._frame;
    }

    set sourceSize(value)
    {
        this._sourceSize = value;
    }

    get sourceSize()
    {
        return this._sourceSize;
    }

    set spriteSourceSize(value)
    {
        this._spriteSourceSize = value;
    }

    get spriteSourceSize()
    {
        return this._spriteSourceSize;
    }

    set image(value)
    {
        this._image = value;
    }

    get image()
    {
        return this._image;
    }

    set text(value)
    {
        this._text = value;
        this._code = value.charCodeAt(0);
    }

    get text()
    {
        return this._text;
    }

    get xadvance()
    {
        return this._xadvance
    }

    set xadvance(value)
    {
        this._xadvance = value;
    }

    get xoffset()
    {
        return this._xoffset;
    }

    set xoffset(value)
    {
        this._xoffset = value;
    }

    get yoffset()
    {
        return this._yoffset;
    }

    set yoffset(value)
    {
        this._yoffset = value;
    }

    get code()
    {
        return this._code;
    }
}

export default Character;
