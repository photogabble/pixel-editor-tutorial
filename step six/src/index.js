import {Mouse} from './mouse';
import App from './app.class';
import ImageCanvas from './image-canvas.class';
import Preview from './preview.class';
import Palette from './palette.class';

// eslint-disable-next-line no-unused-vars
(function (window, document, undefined) {
    let iPalette = new Palette();
    let iCanvas = new ImageCanvas({iPalette: iPalette});
    let iPreview = new Preview({iCanvas: iCanvas});
    let mainCanvas = document.getElementById('paintMe');

    document.getElementById('saveBtn').addEventListener('click', () => {iCanvas.save()});

    new App({
        canvas: mainCanvas,
        fps: 60,
        update: function (step, canvas, context) {
            // Has the mouse event changed since it was last logged?
            if (Mouse.previousEvents.mouseover !== Mouse.events.mouseover) {
                Mouse.previousEvents.mouseover = Mouse.events.mouseover;
            }

            if (Mouse.previousEvents.mousemove !== Mouse.events.mousemove) {
                Mouse.previousEvents.mousemove = Mouse.events.mousemove;
            }

            if (Mouse.previousEvents.mouseup !== Mouse.events.mouseup) {
                Mouse.previousEvents.mouseup = Mouse.events.mouseup;
            }

            if (Mouse.previousEvents.mousedown !== Mouse.events.mousedown) {
                Mouse.previousEvents.mousedown = Mouse.events.mousedown;
            }

            if (Mouse.previousEvents.mouseButton !== Mouse.events.mouseButton) {
                Mouse.previousEvents.mouseButton = Mouse.events.mouseButton;
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
}(window, document));