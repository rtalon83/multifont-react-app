MULTIFONT PACKER
=

![image](https://raw.githubusercontent.com/rtalon83/multifont-react-app/master/doc/capture1.jpg)

MultiFont Packer is a web based tool for make BitmapFonts, like [Shoe Box](https://renderhjs.net/shoebox/).
The main objective of this tool is to optimize font based resources by using a single atlas to support multiple bitmap fonts.
In this first version we use the XML descriptor format [Angel Code](https://www.angelcode.com/products/bmfont/).

```
<font>
     <info face="{{name}}" size="{{size}}" />
     <common lineHeight="{{lineHeight}}" scaleW="{{scaleW}}" scaleH="{{scaleH}}" pages="{{num_pages}}" />
     <pages>
     {{#pages}}
         <page id="{{id_page}}" file="{{file_name}}" />
     {{/pages}}
     </pages>
     <chars count="{{chars_count}}">
     {{#chars}}
         <char letter="{{letter}}" id="{{code}}" x="{{x}}" y="{{y}}" width="{{width}}" height="{{height}}" xoffset="{{xoffset}}" yoffset="{{yoffset}}" xadvance="{{xadvance}}" />
     {{/chars}}
     </chars>
     <kernings count="{{kernings_count}}">
     {{#kernings}}
     {{/kernings}}
     </kernings>
 </font>
```

## How to use?

1. Drag and Drop your font image pre-created (ex. Photoshop)
![tuto1](https://raw.githubusercontent.com/rtalon83/multifont-react-app/master/doc/tuto1.jpg)

2. Set correct letter in each image. In the future I'll use [Tesseract.js](https://tesseract.projectnaptha.com/)
![tuto2](https://raw.githubusercontent.com/rtalon83/multifont-react-app/master/doc/tuto2.jpg)

3. You can set font properties.
![tuto3](https://raw.githubusercontent.com/rtalon83/multifont-react-app/master/doc/tuto4.jpg)

4. And test the result.
![tuto4](https://raw.githubusercontent.com/rtalon83/multifont-react-app/master/doc/tuto3.jpg)

## Pixi.js Test

Inside this project you can test the result with Pixi.js engine.

`folder: /test/`

1. npm install
2. Modify `/src/index.js` PIXI.BitmapText, your correct name font and size.
3. **webpack** to compile
4. Launch a server ( ex. http-server ) in `/test/dist/`
5. And look at the result

![tuto6](https://raw.githubusercontent.com/rtalon83/multifont-react-app/master/doc/tuto6.jpg)

## References
This project is based on:

- Free Texture Packer [Web](http://free-tex-packer.com/) [GitHub](https://github.com/odrick/free-tex-packer)
- Sprite Splitter [GitHub](https://github.com/bmarwane/spriteSplitter)
- Bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## To Do

- OCR Tesseract.js
- Improve Sprite Splitter alpha threshold.
- To add new xml format `mfnt`
- To add popups (loading, help, waiting...)
- To add languages
