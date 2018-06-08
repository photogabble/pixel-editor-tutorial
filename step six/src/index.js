import {Mouse} from './mouse';
import App from './app.class';
import ImageCanvas from './image-canvas.class';
import Preview from './preview.class';
import Palette from './palette.class';

(function($, window, document, undefined) {
    "use strict";

    let iPalette = new Palette();
    let iCanvas  = new ImageCanvas({
        iPalette: iPalette
    });
    let iPreview = new Preview({
        iCanvas: iCanvas
    });

    $(document).ready(function () {
        let mainCanvas = document.getElementById('paintMe');

        $('#saveBtn').on('click', function () {
            var cCanvas = $('<canvas/>').attr({width: 16, height: 16});
            var cContext = cCanvas.get(0).getContext("2d");
            var mPixels = iCanvas.get('pixels');

            for (var y = 1; y <= 16; y += 1) {
                for (var x = 1; x <= 16; x += 1) {
                    var currentPixel = mPixels.getPixel(x, y);
                    if (currentPixel.on === true) {
                        cContext.fillStyle = currentPixel.colour;
                        cContext.fillRect((x - 1), (y - 1), 1, 1);
                    }
                }
            }

            var link = document.createElement('a');
            link.download = 'image.png';
            link.href = cCanvas.get(0).toDataURL("image/png");
            link.click();
        });

        new App({
            canvas: mainCanvas,
            fps: 60,
            update: function (step, canvas, context) {

                ////////////////////////////////////////////////////////////////////////////////////////////////////
                // Mouse Events
                ////////////////////////////////////////////////////////////////////////////////////////////////////

                // Has the mouse event changed since it was last logged?
                if (Mouse.previousEvents.mouseover !== Mouse.events.mouseover) {
                    Mouse.previousEvents.mouseover = Mouse.events.mouseover;
                    console.log('Mouse Over Event Changed');
                }

                if (Mouse.previousEvents.mousemove !== Mouse.events.mousemove) {
                    Mouse.previousEvents.mousemove = Mouse.events.mousemove;
                    console.log('Mouse Move Event Changed');
                }

                if (Mouse.previousEvents.mouseup !== Mouse.events.mouseup) {
                    Mouse.previousEvents.mouseup = Mouse.events.mouseup;
                    console.log('Mouse Up Event Changed');
                }

                if (Mouse.previousEvents.mousedown !== Mouse.events.mousedown) {
                    Mouse.previousEvents.mousedown = Mouse.events.mousedown;
                    console.log('Mouse Down Event Changed');
                }

                if (Mouse.previousEvents.mouseButton !== Mouse.events.mouseButton) {
                    Mouse.previousEvents.mouseButton = Mouse.events.mouseButton;
                    console.log('Mouse Button Event Changed');
                }

                iCanvas.update(step, canvas, context);
                iPreview.update(step, canvas, context);
                iPalette.update(step, canvas, context);

            },
            render: function (step, canvas, context) {
                iCanvas.render(step, canvas, context);
                iPreview.render(step, canvas, context);
                iPalette.render(step, canvas, context);
            }
        });
    });

}(window.jQuery, window, document));