import {Mouse} from './mouse';

export default class {
    constructor(options) {
        this.offset = (options !== undefined && options.offset !== undefined) ? options.offset : {x: 341, y: 63};
        this.loaded = false;
        this.cCache = null;

        this.cCanvas = document.createElement('canvas');
        this.cCanvas.width = 43;
        this.cCanvas.height = 222;
        this.cContext = this.cCanvas.getContext("2d");

        this.palette = [
            '#000000',
            '#FFFFFF',
            '#9D9D9D',
            '#BE2633',
            '#E06F8B',
            '#493C2B',
            '#A46422',
            '#EB8931',
            '#F7E26B',
            '#2F484E',
            '#44891A',
            '#A3CE27',
            '#1B2632',
            '#005784',
            '#31A2F2',
            '#B2DCEF'
        ];

        this.currentColour = '#000000';
        this.hasFocus = false;
        this.paletteMousePositions = [];
        this.setUpMousePositions();
    }

    setUpMousePositions() {
        this.paletteMousePositions = [];
        let x = 1;
        let y = 1;

        for (let i = 0; i <= this.palette.length - 1; i += 1) {
            let temp = {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 0,
                color: this.palette[i]
            };

            temp.x1 = x;
            temp.y1 = y;
            temp.x2 = temp.x1 + 20;
            temp.y2 = temp.y1 + 20;

            x += 21;

            if (i % 2 === 1) {
                y += 21;
                x = 1;
            }
            this.paletteMousePositions[i] = temp;
        }
        this.loaded = true;
    }

    update(step, canvas) {
        // Sometimes this method is called by the main loop before the objects
        // constructor has time to initialise, the following line stops
        // that from happening.
        if (this.loaded === false) {
            return;
        }

        // Check to see if the Pallet object has focus, and resetting the mouse
        // cursor if not.
        if (
            Mouse.x >= this.offset.x &&
            Mouse.x <= (this.offset.x + 43) &&
            Mouse.y >= this.offset.y &&
            Mouse.y <= (this.offset.y + 222)
        ) {
            this.hasFocus = true;
        } else {
            this.hasFocus = false;
            canvas.style.cursor = 'auto';
        }

        if (this.hasFocus === true) {
            // Check to see if the mouse cursor is within the pallet picker
            // area, and over a selectable colour then change the cursor to
            // let the user know that they can interact
            if (
                Mouse.x >= (this.offset.x + 1) &&
                Mouse.x <= (this.offset.x + 43) &&
                Mouse.y >= (this.offset.y + 1) &&
                Mouse.y <= (this.offset.y + 168)
            ) {
                canvas.style.cursor = 'pointer';

                // If the mouse is clicked then the current palette colour
                // to the hex value of the selected item
                if (Mouse.events.mousedown === true) {
                    for (let i = 0; i <= this.paletteMousePositions.length - 1; i += 1) {
                        if (
                            Mouse.x >= (this.offset.x + this.paletteMousePositions[i].x1) &&
                            Mouse.x <= (this.offset.x + this.paletteMousePositions[i].x2) &&
                            Mouse.y >= (this.offset.y + this.paletteMousePositions[i].y1) &&
                            Mouse.y <= (this.offset.y + this.paletteMousePositions[i].y2)
                        ) {
                            if (this.currentColour !== this.paletteMousePositions[i].color) {
                                this.currentColour = this.paletteMousePositions[i].color;
                            }
                        }
                    }
                }
            } else {
                canvas.style.cursor = 'auto';
            }
        }
    }

    render(step, canvas, context) {
        // Sometimes this method is called by the main loop before the objects
        // constructor has time to initialise, the following line stops
        // that from happening.
        if (this.loaded === false) {
            return;
        }

        // Clear the Palette context, ready for a re-draw
        this.cContext.clearRect(0, 0, 42, 170);

        // Draw a border and background
        this.cContext.fillStyle = "#000000";
        this.cContext.fillRect(0, 0, 43, 169);
        this.cContext.fillStyle = "#000000";
        this.cContext.fillRect(0, 179, 43, 43);

        // Draw each coloured box for the pallet
        let x = 1;
        let y = 1;

        for (let i = 0; i <= this.palette.length - 1; i += 1) {
            this.cContext.fillStyle = this.palette[i];
            this.cContext.fillRect(x, y, 20, 20);

            x += 21;

            if (i % 2 === 1) {
                y += 21;
                x = 1;
            }
        }

        // Draw the current colour
        this.cContext.fillStyle = this.currentColour;
        this.cContext.fillRect(1, 180, 41, 41);

        // Get the image data from the palette context and apply
        // it to the main canvas context passed through by the
        // main loop
        context.putImageData(this.cContext.getImageData(0, 0, 43, 222), this.offset.x, this.offset.y);
    }

    getCurrentColour() {
        return this.currentColour;
    }
}