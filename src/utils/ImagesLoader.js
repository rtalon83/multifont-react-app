const TYPES = ["image/png", "image/jpg", "image/jpeg", "image/gif"];

export class ImagesLoader {
    constructor() {
        this._data = null;

        this._images = {};

        // Bind
        this.onEnd = null;
        this.checkDone = this.checkDone.bind(this);
    }

    /**
     * @param {FileList} data
     * @param {Function} callBack
     */
    load(data, callBack) {
        let i;
        const len = data.length;

        this._data = [];

        for (i = 0; i < len; i++) {
            this._data.push(data[i]);
        }

        this.onEnd = callBack;
        this.loadNext();
    }

    loadNext() {
        if (this._data.length > 0) {
            let item = this._data.shift();

            if (TYPES.indexOf(item.type) !== -1) {
                let img = new Image();

                let reader = new FileReader();
                reader.onload = event => {
                    img.src = event.target.result;
                    img._base64 = event.target.result;

                    this._images[item.name] = img;
                    this.loadNext();
                };

                reader.readAsDataURL(item);
            }
            else {
                this.loadNext();
            }
        }
        else {
            this.checkDone();
        }
    }

    checkDone() {
        let ready = true;

        for (let key of Object.keys(this._images)) {
            if (!this._images[key].complete) {
                ready = false;
                break;
            }
        }

        if (ready) {
            this.onEnd(this._images);
        }
        else {
            setTimeout(this.checkDone, 50);
        }
    }
}
