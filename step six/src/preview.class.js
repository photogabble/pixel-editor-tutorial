export default class {
    constructor(options) {
        this.xPixels = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
        this.yPixels = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
        this.offset = (options !== undefined && options.offset !== undefined) ? options.offset : {x: 341, y: 295};
        this.loaded = false;
        this.cCache = null;

        this.cCanvas = document.createElement('canvas');
        this.cCanvas.width = 43;
        this.cCanvas.height = 36;
        this.cContext = this.cCanvas.getContext("2d");

        if (options === undefined || options.iCanvas === undefined) {
            throw new Error('Preview requires iCanvas be passed to it.');
        }

        this.iCanvas = options.iCanvas;
    }

    render(step, canvas, context) {
        if (!this.loaded) {
            return;
        }
        context.putImageData(this.cCache, this.offset.x, this.offset.y);
    }

    update() {
        this.cContext.clearRect(0, 0, 43, 36);

        this.cContext.font = '10px Arial';
        this.cContext.fillStyle = '#000000';
        this.cContext.fillText('Preview', 3.5, 10);

        this.cContext.fillRect(13, 15, 18, 18);

        this.cContext.fillStyle = '#FFFFFF';
        this.cContext.fillRect(14, 16, 16, 16);

        let mPixels = this.iCanvas.get('pixels');

        for (let y = 1; y <= this.yPixels; y += 1) {
            for (let x = 1; x <= this.xPixels; x += 1) {
                let currentPixel = mPixels.getPixel(x, y);
                if (currentPixel.on === true) {
                    this.cContext.fillStyle = currentPixel.colour;
                    this.cContext.fillRect((14 + x - 1), (16 + y - 1), 1, 1);
                }
            }
        }

        this.cCache = this.cContext.getImageData(0, 0, 43, 36);
        this.loaded = true;
    }
}