export default class {
    constructor(options) {
        this.pixels = [];
        this.xPixels = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
        this.yPixels = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
        this.pixelH = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
        this.pixelW = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;
        this.reset();
    }

    reset() {
        for (let y = 1; y <= this.yPixels; y += 1) {
            for (let x = 1; x <= this.xPixels; x += 1) {
                this.setPixel(
                    x, y, {
                        mouseOver: false,
                        colour: '#000000',
                        on: false,
                        x: ((x - 1) * this.pixelW),
                        y: ((y - 1) * this.pixelH),
                        h: (this.pixelH - 1),
                        w: (this.pixelW - 1)
                    }
                );
            }
        }
    }

    setPixel(row, col, value) {
        this.pixels[this.xPixels * row + col] = value;
    }

    getPixel(row, col) {
        return this.pixels[this.xPixels * row + col];
    }

    getPixels() {
        return this.pixels;
    }

    setPixels(pixels) {
        this.pixels = pixels;
    }
}