import {Mouse} from "./mouse";
import Pixels from "./pixels.class";

export default class {
    constructor(options) {
        this.xPixels = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
        this.yPixels = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
        this.pixelH = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
        this.pixelW = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;

        this.offset = (options !== undefined && options.offset !== undefined) ? options.offset : {x: 10, y: 10};

        this.pixels = new Pixels({
            xPixels: this.xPixels,
            yPixels: this.yPixels,
            pixelW: this.pixelW,
            pixelH: this.pixelH
        });

        this.cWidth = (this.xPixels * this.pixelW);
        this.cHeight = (this.yPixels * this.pixelH);
        this.hasFocus = false;

        this.cCanvas = document.createElement('canvas');
        this.cCanvas.width = this.cWidth;
        this.cCanvas.height = this.cHeight;
        this.cContext = this.cCanvas.getContext("2d");

        this.cContext.fillStyle = '#999999';
        this.cContext.fillRect(0, 0, this.cWidth, this.cHeight);

        this.cContext.fillStyle = '#FFFFFF';
        this.cContext.fillRect(1, 1, (this.cWidth - 2), (this.cHeight - 2));

        this.cContext.beginPath();
        this.cContext.strokeStyle = "#DDDDDD";
        this.cContext.lineWidth = "1";

        for (let y = 20; y <= this.cHeight; y += this.pixelH) {
            this.cContext.moveTo(0.5 + y, 1);
            this.cContext.lineTo(0.5 + y, this.cHeight - 1);
        }

        for (let x = 20; x <= this.cWidth; x += this.pixelW) {
            this.cContext.moveTo(1, 0.5 + x);
            this.cContext.lineTo(this.cWidth - 1, 0.5 + x);
        }

        this.cContext.stroke();

        this.cGrid = this.cContext.getImageData(0, 0, this.cWidth, this.cHeight);

        if (options === undefined || options.iPalette === undefined) {
            throw new Error('ImageCanvas requires iPalette be passed to it.');
        }

        this.iPalette = options.iPalette;
    }

    get(prop) {
        if (this.hasOwnProperty(prop)) {
            return this[prop];
        }
    }

    load(pixels) {
        // ...
    }

    save() {
        // ...
    }

    update() {
        if (
            (Mouse.x > 0 && Mouse.y > 0) &&
            (Mouse.x >= 0 && Mouse.x <= this.cWidth) &&
            (Mouse.y >= 0 && Mouse.y <= this.cHeight)
        ) {
            console.log('ImageCanvas has focus!');
            this.hasFocus = true;
        } else {
            this.hasFocus = false;
        }

        if (this.hasFocus === true) {
            for (let y = 1; y <= this.yPixels; y += 1) {
                for (let x = 1; x <= this.xPixels; x += 1) {
                    let currentPixel = this.pixels.getPixel(x, y);

                    // Reset mouseover
                    currentPixel.mouseOver = false;

                    if (Mouse.x >= (this.offset.x + currentPixel.x) && Mouse.x <= (this.offset.x + currentPixel.x + currentPixel.w)) {
                        if (Mouse.y >= (this.offset.y + currentPixel.y) && Mouse.y <= (this.offset.y + currentPixel.y + currentPixel.h)) {
                            currentPixel.mouseOver = true;
                            if (Mouse.events.mousedown === true) {
                                // If the left mouse button is pressed then switch the
                                // pixel on and set its colour. Otherwise switch the pixel
                                // off and reset its colour.
                                if (Mouse.events.mouseButton === 1) {
                                    currentPixel.on = true;
                                    currentPixel.colour = this.iPalette.getCurrentColour();
                                } else {
                                    currentPixel.on = false;
                                    currentPixel.colour = '#FFFFFF';
                                }
                            }
                        }
                    }
                    this.pixels.setPixel(x, y, currentPixel);
                }
            }
        }
    }

    render(step, canvas, context) {
        context.putImageData(this.cGrid, this.offset.x, this.offset.y);

        for (let y = 1; y <= this.yPixels; y += 1) {
            for (let x = 1; x <= this.xPixels; x += 1) {
                let currentPixel = this.pixels.getPixel(x, y);

                if (currentPixel.on === true) {
                    // Use the currentPixel.colour to display the pixel
                    context.fillStyle = currentPixel.colour;
                    context.fillRect(
                        (this.offset.x + currentPixel.x + 1),
                        (this.offset.y + currentPixel.y + 1),
                        (this.pixelW - 1),
                        (this.pixelH - 1)
                    );
                }

                if (currentPixel.mouseOver === true) {
                    context.fillStyle = 'rgba(0,0,0,0.2)';
                    context.fillRect(
                        (this.offset.x + currentPixel.x + 1),
                        (this.offset.y + currentPixel.y + 1),
                        (this.pixelW - 1),
                        (this.pixelH - 1)
                    );
                }
            }
        }
    }
}