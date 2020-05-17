import {GET} from "../connection/ajax";
import mustache from "mustache/mustache";
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import Parser from "./Parser";
import list from './list.json';

class Exporter {

    /**
     * @param type
     * @returns {null|Object}
     */
    static getExporterByType(type) {
        for (let item of list) {
            if (item.type === type) {
                return item;
            }
        }
        return null;
    }

    static async startExporter(buffer, data, packOptions) {
        let files = [];
        let mtsFile = 'exporters/' + packOptions.exporter.template;
        let parsed = [];

        // ToDo: correct export identification. At the moment, we have one completed loader PIXI.extras.BitmapText
        if (packOptions.exporter.type === 'Pixi.js BitmapFont') {
            if (packOptions.multiFont) {
                for (const fontId in data) {
                    if (data.hasOwnProperty(fontId)) {
                        parsed.push(Parser.parseFont(data[fontId], {
                            "width": buffer.width,
                            "height": buffer.height,
                            "textureName": packOptions.textureName,
                            "textureFormat": packOptions.textureFormat
                        }));
                    }
                }
            }
            else {
                parsed.push(Parser.parseFont(data[packOptions.selectedFont], {
                    "width": buffer.width,
                    "height": buffer.height,
                    "textureName": packOptions.textureName,
                    "textureFormat": packOptions.textureFormat
                }));
            }
        }
        else if ( packOptions.exporter.type === 'Pixi.js MultiBitmapFont') {
            parsed.push(Parser.parseMultiFont(data, {
                "width": buffer.width,
                "height": buffer.height,
                "textureName": packOptions.textureName,
                "textureFormat": packOptions.textureFormat
            }));
        }
        else {
            // ToDo
        }

        try {
            let i;
            let results = [];
            const len = parsed.length;

            for ( i = 0; i < len; i++ ) {
                results.push(await this.loadTemplate(parsed[i], mtsFile));
            }

            let imageData = buffer.toDataURL(packOptions.textureFormat === 'png' ? 'image/png' : 'image/jpeg');
            let parts = imageData.split(",");
            parts.shift();
            imageData = parts.join(",");

            files.push({
                name: packOptions.textureName + "." + packOptions.textureFormat,
                content: imageData,
                base64: true
            });

            if ( results.length > 1 ) {
                for ( const index in results ) {
                    if ( results.hasOwnProperty(index) ) {
                        files.push({
                            name: packOptions.textureName + "_" + index + ".xml",
                            content: results[index]
                        });
                    }
                }
            }
            else {
                files.push({
                    name: packOptions.textureName  + ".xml",
                    content: results[0]
                });
            }

            let zip = new JSZip();

            for (let file of files) {
                zip.file(file.name, file.content, {base64: !!file.base64});
            }

            zip.generateAsync({type: "blob"})
                .then((content) => {
                    FileSaver.saveAs(content, packOptions.fileName + '.zip');
                });
        }
        catch (e) {

        }

    }

    static loadTemplate(data, mtsFile) {
        return new Promise((resolve, reject) => {
            GET(mtsFile, null, (template) => {
                this.renderTemplate(template, data, resolve, reject);
            }, () => reject('multifont.mts not found'));
        });
    }

    static renderTemplate(template, data, resolve, reject) {
        try {
            let ret = mustache.render(template, data);
            resolve(ret);
        }
        catch (e) {
            reject(e.message);
        }
    }

}

export default Exporter;
