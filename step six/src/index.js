import {Pixels} from './pixels.class';

(function($, window, document, undefined) {
    "use strict";

    /*
    // Image is a reserved word in JavaScript so I use Pixels instead
    var Pixels = function( options ) {
        // Private Properties & Methods
        var privateVars      = {};
        privateVars.xPixels  = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
        privateVars.yPixels  = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
        privateVars.pixelH   = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
        privateVars.pixelW   = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;
        privateVars.pixels   = [];

        // Public Properties & Methods
        var publicVars      = {
            reset: function()
            {
                for (var y = 1; y <= privateVars.yPixels; y += 1)
                {
                    for (var x = 1; x <= privateVars.xPixels; x += 1)
                    {
                        this.setPixel(
                            x, y, {
                                mouseOver: false,
                                colour: '#000000',
                                on: false,
                                x: ((x - 1) * privateVars.pixelW),
                                y: ((y - 1) * privateVars.pixelH),
                                h: (privateVars.pixelH - 1),
                                w: (privateVars.pixelW - 1)
                            }
                        );
                    }
                }
            },
            setPixel: function( row, col, value )
            {
                privateVars.pixels[ privateVars.xPixels * row + col ] = value;
            },

            getPixel: function( row, col )
            {
                return privateVars.pixels[ privateVars.xPixels * row + col ];
            },

            getPixels: function()
            {
                return privateVars.pixels;
            },

            setPixels: function( pixels )
            {
                privateVars.pixels = pixels;
            }
        };

        publicVars.reset();
        return publicVars;
    }; */

    var Preview = function( options ){

        var privateVars      = {};
        privateVars.xPixels  = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
        privateVars.yPixels  = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
        privateVars.offset   = (options !== undefined && options.offset !== undefined) ? options.offset : { x: 341, y: 295 };
        privateVars.loaded   = false;
        privateVars.cCanvas  = $('<canvas/>').attr({ width: 43, height: 36 });
        privateVars.cContext = privateVars.cCanvas.get(0).getContext("2d");
        privateVars.cCache   = null;

        return {

            update: function( step, canvas, context ){

                privateVars.cContext.clearRect(0, 0, 43, 36);

                privateVars.cContext.font      = '10px Arial';
                privateVars.cContext.fillStyle = '#000000';
                privateVars.cContext.fillText( 'Preview', 3.5, 10);

                privateVars.cContext.fillRect( 13, 15, 18, 18);

                privateVars.cContext.fillStyle = '#FFFFFF';
                privateVars.cContext.fillRect( 14, 16, 16, 16);

                var mPixels = iCanvas.get('pixels');

                for (var y = 1; y <= privateVars.yPixels; y+= 1)
                {
                    for (var x = 1; x <= privateVars.xPixels; x+= 1)
                    {
                        var currentPixel = mPixels.getPixel( x, y);
                        if ( currentPixel.on === true )
                        {
                            privateVars.cContext.fillStyle = currentPixel.colour;
                            privateVars.cContext.fillRect( (14 + x - 1) ,( 16 + y - 1), 1, 1);
                        }
                    }
                }

                privateVars.cCache = privateVars.cContext.getImageData( 0, 0, 43, 36);
                privateVars.loaded = true;

            },

            render: function( step, canvas, context ){
                if ( ! privateVars.loaded ){ return; }
                context.putImageData( privateVars.cCache, privateVars.offset.x, privateVars.offset.y );
            }

        };

    };

    var ImageCanvas = function( options ) {
        // Private Properties & Methods
        var privateVars      = {};
        privateVars.xPixels  = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
        privateVars.yPixels  = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
        privateVars.pixelH   = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
        privateVars.pixelW   = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;

        privateVars.offset   = (options !== undefined && options.offset !== undefined) ? options.offset : { x: 10, y: 10 };

        privateVars.pixels   = new Pixels( {
            xPixels: privateVars.xPixels,
            yPixels: privateVars.yPixels,
            pixelW: privateVars.pixelW,
            pixelH: privateVars.pixelH
        });

        privateVars.cWidth   = (privateVars.xPixels * privateVars.pixelW);
        privateVars.cHeight  = (privateVars.yPixels * privateVars.pixelH);
        privateVars.hasFocus = false;

        privateVars.cCanvas  = $('<canvas/>').attr({ width: privateVars.cWidth, height: privateVars.cHeight });
        privateVars.cContext = privateVars.cCanvas.get(0).getContext("2d");

        privateVars.cContext.fillStyle = '#999999';
        privateVars.cContext.fillRect(0,0, privateVars.cWidth, privateVars.cHeight);

        privateVars.cContext.fillStyle = '#FFFFFF';
        privateVars.cContext.fillRect(1,1, (privateVars.cWidth - 2), (privateVars.cHeight - 2));

        privateVars.cContext.beginPath();
        privateVars.cContext.strokeStyle = "#DDDDDD";
        privateVars.cContext.lineWidth   = "1";

        for (var y = 20; y <= privateVars.cHeight; y += privateVars.pixelH) {
            privateVars.cContext.moveTo(0.5 + y, 1);
            privateVars.cContext.lineTo(0.5 + y, privateVars.cHeight - 1);
        }

        for (var x = 20; x <= privateVars.cWidth; x += privateVars.pixelW) {
            privateVars.cContext.moveTo(1, 0.5 + x);
            privateVars.cContext.lineTo(privateVars.cWidth - 1, 0.5 + x);
        }

        privateVars.cContext.stroke();

        privateVars.cGrid = privateVars.cContext.getImageData(0,0, privateVars.cWidth, privateVars.cHeight);

        // Public Properties & Methods
        return {

            // Public getter
            get: function( prop ) {
                if ( privateVars.hasOwnProperty( prop ) ) {
                    return privateVars[ prop ];
                }
            },

            load: function ( pixels )
            {
                // ...
            },

            save: function ()
            {
                // ...
            },

            update: function ( step, canvas, context )
            {
                if(
                    (Mouse.x > 0 && Mouse.y > 0) &&
                    (Mouse.x >= 0 && Mouse.x <= privateVars.cWidth)  &&
                    (Mouse.y >= 0 && Mouse.y <= privateVars.cHeight)
                ){
                    console.log('ImageCanvas has focus!');
                    privateVars.hasFocus = true;
                }else{
                    privateVars.hasFocus = false;
                }

                if (privateVars.hasFocus === true)
                {
                    for (var y = 1; y <= privateVars.yPixels; y+= 1)
                    {
                        for (var x = 1; x <= privateVars.xPixels; x+= 1)
                        {
                            var currentPixel = privateVars.pixels.getPixel( x,y );

                            // Reset mouseover
                            currentPixel.mouseOver = false;

                            if ( Mouse.x >= (privateVars.offset.x + currentPixel.x) && Mouse.x <= (privateVars.offset.x + currentPixel.x + currentPixel.w)){
                                if ( Mouse.y >= (privateVars.offset.y + currentPixel.y) && Mouse.y <= (privateVars.offset.y + currentPixel.y + currentPixel.h) ){
                                    currentPixel.mouseOver = true;
                                    if (Mouse.events.mousedown === true)
                                    {
                                        // If the left mouse button is pressed then switch the
                                        // pixel on and set its colour. Otherwise switch the pixel
                                        // off and reset its colour.
                                        if (Mouse.events.mouseButton === 1){
                                            currentPixel.on = true;
                                            currentPixel.colour = iPalette.getCurrentColour();
                                        }else{
                                            currentPixel.on = false;
                                            currentPixel.colour = '#FFFFFF';
                                        }
                                    }
                                }
                            }
                            privateVars.pixels.setPixel( x, y, currentPixel );
                        }
                    }
                }
            },

            render: function ( step, canvas, context )
            {
                context.putImageData( privateVars.cGrid, privateVars.offset.x, privateVars.offset.y );

                for (var y = 1; y <= privateVars.yPixels; y+= 1)
                {
                    for (var x = 1; x <= privateVars.xPixels; x+= 1)
                    {
                        var currentPixel = privateVars.pixels.getPixel( x, y );

                        if ( currentPixel.on === true)
                        {
                            // Use the currentPixel.colour to display the pixel
                            context.fillStyle = currentPixel.colour;
                            context.fillRect(
                                (privateVars.offset.x + currentPixel.x + 1),
                                (privateVars.offset.y + currentPixel.y + 1),
                                (privateVars.pixelW - 1),
                                (privateVars.pixelH - 1)
                            );
                        }

                        if ( currentPixel.mouseOver === true)
                        {
                            context.fillStyle = 'rgba(0,0,0,0.2)';
                            context.fillRect(
                                (privateVars.offset.x + currentPixel.x + 1),
                                (privateVars.offset.y + currentPixel.y + 1),
                                (privateVars.pixelW - 1),
                                (privateVars.pixelH - 1)
                            );
                        }
                    }
                }
            }
        };
    };

    var Palette = function( options ){
        var privateVars      = {};
        privateVars.offset   = (options !== undefined && options.offset !== undefined) ? options.offset : { x: 341, y: 63 };
        privateVars.loaded   = false;
        privateVars.cCanvas  = $('<canvas/>').attr({ width: 43, height: 222 });
        privateVars.cContext = privateVars.cCanvas.get(0).getContext("2d");
        privateVars.cCache   = null;

        privateVars.palette   = [
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

        privateVars.currentColour = '#000000';
        privateVars.hasFocus  = false;
        privateVars.paletteMousePositions = [];

        privateVars.setUpMousePositions = function()
        {
            privateVars.paletteMousePositions = [];
            var x  = 1;
            var y  = 1;

            for ( var i = 0; i<= privateVars.palette.length - 1; i += 1)
            {
                var temp = {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 0,
                    color: privateVars.palette[i]
                };

                temp.x1 = x;
                temp.y1 = y;
                temp.x2 = temp.x1 + 20;
                temp.y2 = temp.y1 + 20;

                x += 21;

                if ( i % 2 == 1){ y+= 21; x = 1; }

                privateVars.paletteMousePositions[i] = temp;
            }

            privateVars.loaded = true;
        };

        privateVars.setUpMousePositions();

        return {

            update: function( step, canvas, context)
            {

                // Sometimes this method is called by the main loop before the objects
                // constructor has time to initialise, the following line stops
                // that from happening.
                if ( privateVars.loaded === false ){ return; }

                // Check to see if the Pallet object has focus, and resetting the mouse
                // cursor if not.
                if (
                    Mouse.x >= privateVars.offset.x &&
                    Mouse.x <= ( privateVars.offset.x + 43 ) &&
                    Mouse.y >= privateVars.offset.y &&
                    Mouse.y <= ( privateVars.offset.y + 222 )
                ){
                    privateVars.hasFocus = true;
                }else{
                    privateVars.hasFocus = false;
                    canvas.css('cursor', 'auto');
                }

                if (privateVars.hasFocus === true)
                {
                    // Check to see if the mouse cursor is within the pallet picker
                    // area, and over a selectable colour then change the cursor to
                    // let the user know that they can interact
                    if(
                        Mouse.x >= (privateVars.offset.x + 1) &&
                        Mouse.x <= (privateVars.offset.x + 43 ) &&
                        Mouse.y >= (privateVars.offset.y + 1) &&
                        Mouse.y <= (privateVars.offset.y + 168 )
                    ){
                        canvas.css('cursor', 'pointer');

                        // If the mouse is clicked then the current palette colour
                        // to the hex value of the selected item
                        if ( Mouse.events.mousedown === true) {
                            for (var i = 0; i <= privateVars.paletteMousePositions.length - 1; i += 1) {
                                if (
                                    Mouse.x >= ( privateVars.offset.x + privateVars.paletteMousePositions[i].x1 ) &&
                                    Mouse.x <= ( privateVars.offset.x + privateVars.paletteMousePositions[i].x2 ) &&
                                    Mouse.y >= ( privateVars.offset.y + privateVars.paletteMousePositions[i].y1 ) &&
                                    Mouse.y <= ( privateVars.offset.y + privateVars.paletteMousePositions[i].y2 )
                                ){
                                    if (privateVars.currentColour !== privateVars.paletteMousePositions[i].color)
                                    {
                                        privateVars.currentColour = privateVars.paletteMousePositions[i].color;
                                    }
                                }
                            }
                        }

                    }else{
                        canvas.css('cursor', 'auto');
                    }
                }

            },
            render: function( step, canvas, context)
            {

                // Sometimes this method is called by the main loop before the objects
                // constructor has time to initialise, the following line stops
                // that from happening.
                if ( privateVars.loaded === false ){ return; }

                // Clear the Palette context, ready for a re-draw
                privateVars.cContext.clearRect( 0 , 0 , 42, 170 );

                // Draw a border and background
                privateVars.cContext.fillStyle = "#000000";
                privateVars.cContext.fillRect( 0, 0, 43, 169);
                privateVars.cContext.fillStyle = "#000000";
                privateVars.cContext.fillRect( 0, 179, 43, 43);

                // Draw each coloured box for the pallet
                var x = 1;
                var y = 1;

                for ( var i = 0; i<= privateVars.palette.length - 1; i += 1)
                {
                    privateVars.cContext.fillStyle = privateVars.palette[i];
                    privateVars.cContext.fillRect( x, y, 20, 20);

                    x += 21;

                    if ( i % 2 == 1){ y+= 21; x = 1; }
                }

                // Draw the current colour
                privateVars.cContext.fillStyle = privateVars.currentColour;
                privateVars.cContext.fillRect( 1, 180, 41, 41);

                // Get the image data from the palette context and apply
                // it to the main canvas context passed through by the
                // main loop
                context.putImageData( privateVars.cContext.getImageData(0,0, 43, 222), privateVars.offset.x, privateVars.offset.y );

            },
            getCurrentColour: function(){
                return privateVars.currentColour;
            }
        }
    };

    var Mouse = {
        x: 0,
        y: 0,
        events: {
            mouseover: false,
            mouseout: false,
            mousedown: false,
            mousemove: false,
            mouseButton: 0
        },
        previousEvents: {
            mouseover: false,
            mouseout: false,
            mousedown: false,
            mousemove: false,
            mouseButton: 0
        }
    };

    var App = {
        timestamp: function() {
            return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
        },

        run: function(options)
        {
            var now,
                dt       = 0,
                last     = App.timestamp(),
                slow     = options.slow || 1, // slow motion scaling factor
                step     = 1/options.fps,
                slowStep = slow * step,
                update   = options.update,
                render   = options.render,
                canvas   = options.canvas,
                context  = options.canvas.get(0).getContext("2d");

            function frame() {
                now = App.timestamp();
                dt = dt + Math.min(1, (now - last) / 1000);
                while(dt > slowStep) {
                    dt = dt - slowStep;
                    update(step, canvas, context);
                }
                render(dt/slow, canvas, context);
                last = now;
                requestAnimationFrame(frame, canvas);
            }
            requestAnimationFrame(frame);
        }
    };

    var iCanvas  = new ImageCanvas();
    var iPreview = new Preview();
    var iPalette = new Palette();

    $(document).ready(function(){
        var mainCanvas = $('#paintMe');

        mainCanvas.on('mouseover', function(e){
            Mouse.events.mouseover   = true;
            Mouse.x                  = Math.floor(e.clientX - $(this).offset().left);
            Mouse.y                  = Math.floor(e.clientY - $(this).offset().top);
        });

        mainCanvas.on('mouseout', function(e)
        {
            Mouse.events.mousemove   = false;
            Mouse.events.mouseover   = false;
            Mouse.events.mousedown   = false;
            Mouse.events.mouseout    = true;
            Mouse.events.mouseButton = 0;

            Mouse.x                  = 0;
            Mouse.y                  = 0;
        });

        mainCanvas.on('mousemove', function(e)
        {
            Mouse.events.mousemove   = true;
            Mouse.x                  = Math.floor(e.clientX - $(this).offset().left);
            Mouse.y                  = Math.floor(e.clientY - $(this).offset().top);
            return false;
        });

        mainCanvas.on('mousedown', function(e)
        {
            Mouse.events.mousedown   = true;
            Mouse.events.mouseup     = false;
            Mouse.events.mouseButton = e.which;
            return false;
        });

        mainCanvas.on('mouseup', function(e)
        {
            Mouse.events.mousedown   = false;
            Mouse.events.mouseup     = true;
            Mouse.events.mouseButton = 0;
            return false;
        });

        // This returns false to disable the operating systems context menu on right click
        mainCanvas.contextmenu(function() {
            return false;
        });

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

        App.run({
            canvas: mainCanvas,
            fps: 60,
            update: function(step, canvas, context){

                ////////////////////////////////////////////////////////////////////////////////////////////////////
                // Mouse Events
                ////////////////////////////////////////////////////////////////////////////////////////////////////

                // Has the mouse event changed since it was last logged?
                if ( Mouse.previousEvents.mouseover !== Mouse.events.mouseover )
                {
                    Mouse.previousEvents.mouseover = Mouse.events.mouseover;
                    console.log('Mouse Over Event Changed');
                }

                if ( Mouse.previousEvents.mousemove !== Mouse.events.mousemove )
                {
                    Mouse.previousEvents.mousemove = Mouse.events.mousemove;
                    console.log('Mouse Move Event Changed');
                }

                if ( Mouse.previousEvents.mouseup !== Mouse.events.mouseup )
                {
                    Mouse.previousEvents.mouseup = Mouse.events.mouseup;
                    console.log('Mouse Up Event Changed');
                }

                if ( Mouse.previousEvents.mousedown !== Mouse.events.mousedown )
                {
                    Mouse.previousEvents.mousedown = Mouse.events.mousedown;
                    console.log('Mouse Down Event Changed');
                }

                if ( Mouse.previousEvents.mouseButton !== Mouse.events.mouseButton )
                {
                    Mouse.previousEvents.mouseButton = Mouse.events.mouseButton;
                    console.log('Mouse Button Event Changed');
                }

                iCanvas.update( step, canvas, context );
                iPreview.update( step, canvas, context);
                iPalette.update( step, canvas, context);

            },
            render: function(step, canvas, context){

                iCanvas.render( step, canvas, context );
                iPreview.render( step, canvas, context );
                iPalette.render( step, canvas, context);

            }
        });
    });

}(window.jQuery, window, document));