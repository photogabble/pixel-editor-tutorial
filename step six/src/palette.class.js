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