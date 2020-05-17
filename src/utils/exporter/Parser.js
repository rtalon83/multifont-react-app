const SPECIAL_CHAR = {
    SPACE: {
        CODE: 32,
        ID: 'space'
    },
    TAB: {
        CODE: 9,
        ID: 'tab'
    }
};

class Parser
{
    static parseChar(data) {
        let parsed = null;
        switch(data.code) {
            case SPECIAL_CHAR.SPACE.CODE:
            case SPECIAL_CHAR.TAB.CODE: {
                parsed = {
                    "letter": data.letter,
                    "code": data.code,
                    "x": 0,
                    "y": 0,
                    "width": 0,
                    "height": 0,
                    "xoffset": 0,
                    "yoffset": 0,
                    "xadvance": data.xadvance
                };
                break;
            }
            default: {
                parsed = {
                    "letter": data.text,
                    "code": data.code,
                    "x": data.frame.x,
                    "y": data.frame.y,
                    "width": data.frame.w,
                    "height": data.frame.h,
                    "xoffset": data.xoffset,
                    "yoffset": data.yoffset,
                    "xadvance": data.xadvance
                };
                break;
            }
        }

        return parsed;
    }

    static parseFont(data, params) {
        let parsed = {
            "name": data.name,
            "size": data.size,
            "lineHeight": data.lineHeight,
            "scaleW": params.width,
            "scaleH": params.height,
            "num_pages": 0,
            "pages": [
                {
                    "id_page": 0,
                    "file_name": params.textureName + "." + params.textureFormat
                }
            ],
        };

        const chars = Object.keys(data.characters);
        parsed["chars_count"] = chars.length;
        parsed["chars"] = [];

        for ( const charId in data.characters ) {
            parsed["chars"].push(
                this.parseChar(data.characters[charId])
            )
        }

        // Space
        parsed["chars"].push(
            this.parseChar({
                "code": SPECIAL_CHAR.SPACE.CODE,
                "letter": SPECIAL_CHAR.SPACE.ID,
                "xadvance": data.spaceWidth
            })
        );

        // Tabs
        parsed["chars"].push(
            this.parseChar({
                "code": SPECIAL_CHAR.TAB.CODE,
                "letter": SPECIAL_CHAR.TAB.ID,
                "xadvance": data.tabWidth
            })
        );

        parsed["kernings_count"] = 0;
        parsed["kernings"] = [];

        return parsed;
    }

    static parseMultiFont(data, params) {
        let parsed = {
            "scaleW": params.width,
            "scaleH": params.height,
            "file_name": params.textureName + "." + params.textureFormat
        };

        parsed["fonts"] = [];
        for (const fontId in data) {
            if (data.hasOwnProperty(fontId)) {
                let fontParsed = {
                    "name": data[fontId].name,
                    "size": data[fontId].size,
                    "lineHeight": data[fontId].lineHeight,
                };

                const chars = Object.keys(data[fontId].characters);
                fontParsed["chars_count"] = chars.length;
                fontParsed["chars"] = [];

                for ( const charId in data[fontId].characters ) {
                    fontParsed["chars"].push(
                        this.parseChar(data[fontId].characters[charId])
                    )
                }

                // Space
                fontParsed["chars"].push(
                    this.parseChar({
                        "code": SPECIAL_CHAR.SPACE.CODE,
                        "letter": SPECIAL_CHAR.SPACE.ID,
                        "xadvance": data[fontId].spaceWidth
                    })
                );

                // Tabs
                fontParsed["chars"].push(
                    this.parseChar({
                        "code": SPECIAL_CHAR.TAB.CODE,
                        "letter": SPECIAL_CHAR.TAB.ID,
                        "xadvance": data[fontId].tabWidth
                    })
                );

                fontParsed["kernings_count"] = 0;
                fontParsed["kernings"] = [];

                parsed["fonts"].push(fontParsed);
            }
        }

        return parsed;
    }
}

export default Parser;
