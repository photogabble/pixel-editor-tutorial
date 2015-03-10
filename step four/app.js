// Image is a reserved word in JavaScript so I use Pixels instead
var Pixels = function( options ) {
    // Private Properties & Methods
    var private      = {};
    private.xPixels  = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
    private.yPixels  = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
    private.pixelH   = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
    private.pixelW   = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;
    private.pixels   = [];

    // Public Properties & Methods
    var public      = {
        reset: function()
        {
            for (var y = 1; y <= private.yPixels; y += 1)
            {
                for (var x = 1; x <= private.xPixels; x += 1)
                {
                    this.setPixel(
                        x, y, {
                            mouseOver: false,
                            on: false,
                            x: ((x - 1) * private.pixelW),
                            y: ((y - 1) * private.pixelH),
                            h: (private.pixelH - 1),
                            w: (private.pixelW - 1)
                        }
                    );
                }
            }
        },
        setPixel: function( row, col, value )
        {
            private.pixels[ private.xPixels * row + col ] = value;
        },

        getPixel: function( row, col )
        {
            return private.pixels[ private.xPixels * row + col ];
        },

        getPixels: function()
        {
            return private.pixels;
        },

        setPixels: function( pixels )
        {
            private.pixels = pixels;
        }
    };

    public.reset();
    return public;
};

var Preview = function( options ){

    var private      = {};
    private.xPixels  = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
    private.yPixels  = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
    private.offset   = (options !== undefined && options.offset !== undefined) ? options.offset : { x: 341, y: 295 };
    private.loaded   = false;
    private.cCanvas  = $('<canvas/>').attr({ width: 43, height: 36 });
    private.cContext = private.cCanvas.get(0).getContext("2d");
    private.cCache   = null;

    return {

        update: function( step, canvas, context ){

            private.cContext.clearRect(0, 0, 43, 36);

            private.cContext.font      = '10px Arial';
            private.cContext.fillStyle = '#000000';
            private.cContext.fillText( 'Preview', 3.5, 10);

            private.cContext.fillRect( 13, 15, 18, 18);

            private.cContext.fillStyle = '#FFFFFF';
            private.cContext.fillRect( 14, 16, 16, 16);

            var mPixels = iCanvas.get('pixels');

            for (var y = 1; y <= private.yPixels; y+= 1)
            {
                for (var x = 1; x <= private.xPixels; x+= 1)
                {
                    var currentPixel = mPixels.getPixel( x, y);
                    if ( currentPixel.on === true )
                    {
                        private.cContext.fillStyle = '#000000';
                        private.cContext.fillRect( (14 + x - 1) ,( 16 + y - 1), 1, 1);
                    }
                }
            }

            private.cCache = private.cContext.getImageData( 0, 0, 43, 36);
            private.loaded = true;

        },

        render: function( step, canvas, context ){
            if ( ! private.loaded ){ return; }
            context.putImageData( private.cCache, private.offset.x, private.offset.y );
        }

    };

};

var ImageCanvas = function( options ) {
    // Private Properties & Methods
    var private      = {};
    private.xPixels  = (options !== undefined && options.xPixels !== undefined) ? options.xPixels : 16;
    private.yPixels  = (options !== undefined && options.yPixels !== undefined) ? options.yPixels : 16;
    private.pixelH   = (options !== undefined && options.pixelH !== undefined) ? options.pixelH : 20;
    private.pixelW   = (options !== undefined && options.pixelW !== undefined) ? options.pixelW : 20;

    private.offset   = (options !== undefined && options.offset !== undefined) ? options.offset : { x: 10, y: 10 };

    private.pixels   = new Pixels( {
        xPixels: private.xPixels,
        yPixels: private.yPixels,
        pixelW: private.pixelW,
        pixelH: private.pixelH
    });

    private.cWidth   = (private.xPixels * private.pixelW);
    private.cHeight  = (private.yPixels * private.pixelH);
    private.hasFocus = false;

    private.cCanvas  = $('<canvas/>').attr({ width: private.cWidth, height: private.cHeight });
    private.cContext = private.cCanvas.get(0).getContext("2d");

    private.cContext.fillStyle = '#999999';
    private.cContext.fillRect(0,0, private.cWidth, private.cHeight);

    private.cContext.fillStyle = '#FFFFFF';
    private.cContext.fillRect(1,1, (private.cWidth - 2), (private.cHeight - 2));

    private.cContext.beginPath();
    private.cContext.strokeStyle = "#DDDDDD";
    private.cContext.lineWidth   = "1";

    for (var y = 20; y <= private.cHeight; y += private.pixelH) {
        private.cContext.moveTo(0.5 + y, 1);
        private.cContext.lineTo(0.5 + y, private.cHeight - 1);
    }

    for (var x = 20; x <= private.cWidth; x += private.pixelW) {
        private.cContext.moveTo(1, 0.5 + x);
        private.cContext.lineTo(private.cWidth - 1, 0.5 + x);
    }

    private.cContext.stroke();

    private.cGrid = private.cContext.getImageData(0,0, private.cWidth, private.cHeight);

    // Public Properties & Methods
    return {

        // Public getter
        get: function( prop ) {
            if ( private.hasOwnProperty( prop ) ) {
                return private[ prop ];
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
                (Mouse.x >= 0 && Mouse.x <= private.cWidth)  &&
                (Mouse.y >= 0 && Mouse.y <= private.cHeight)
            ){
                console.log('ImageCanvas has focus!');
                private.hasFocus = true;
            }else{
                private.hasFocus = false;
            }

            if (private.hasFocus === true)
            {
                for (var y = 1; y <= private.yPixels; y+= 1)
                {
                    for (var x = 1; x <= private.xPixels; x+= 1)
                    {
                        var currentPixel = private.pixels.getPixel( x,y );

                        // Reset mouseover
                        currentPixel.mouseOver = false;

                        if ( Mouse.x >= (private.offset.x + currentPixel.x) && Mouse.x <= (private.offset.x + currentPixel.x + currentPixel.w)){
                            if ( Mouse.y >= (private.offset.y + currentPixel.y) && Mouse.y <= (private.offset.y + currentPixel.y + currentPixel.h) ){
                                currentPixel.mouseOver = true;
                                if (Mouse.events.mousedown === true)
                                {
                                    currentPixel.on = ( Mouse.events.mouseButton === 1);
                                }
                            }
                        }
                        private.pixels.setPixel( x, y, currentPixel );
                    }
                }
            }
        },

        render: function ( step, canvas, context )
        {
            context.putImageData( private.cGrid, private.offset.x, private.offset.y );

            for (var y = 1; y <= private.yPixels; y+= 1)
            {
                for (var x = 1; x <= private.xPixels; x+= 1)
                {
                    var currentPixel = private.pixels.getPixel( x, y );

                    if ( currentPixel.on === true)
                    {
                        context.fillStyle = 'rgba(0,0,0,1)';
                        context.fillRect( (private.offset.x + currentPixel.x + 1), (private.offset.y + currentPixel.y + 1), (private.pixelW - 1), (private.pixelH - 1) );
                    }

                    if ( currentPixel.mouseOver === true)
                    {
                        context.fillStyle = 'rgba(0,0,0,0.2)';
                        context.fillRect( (private.offset.x + currentPixel.x + 1), (private.offset.y + currentPixel.y + 1), (private.pixelW - 1), (private.pixelH - 1) );
                    }
                }
            }
        }
    };
};

var Palette = function( options ){
    var private      = {};
    private.offset   = (options !== undefined && options.offset !== undefined) ? options.offset : { x: 341, y: 63 };
    private.loaded   = false;
    private.cCanvas  = $('<canvas/>').attr({ width: 43, height: 222 });
    private.cContext = private.cCanvas.get(0).getContext("2d");
    private.cCache   = null;

    private.palette   = [
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

    private.currentColour = '#000000';
    private.hasFocus  = false;
    private.paletteMousePositions = [];

    private.setUpMousePositions = function()
    {
        private.paletteMousePositions = [];
        var x  = 1;
        var y  = 1;

        for ( var i = 0; i<= private.palette.length - 1; i += 1)
        {
            var temp = {
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 0,
                color: private.palette[i]
            };

            temp.x1 = x;
            temp.y1 = y;
            temp.x2 = temp.x1 + 20;
            temp.y2 = temp.y1 + 20;

            x += 21;

            if ( i % 2 == 1){ y+= 21; x = 1; }

            private.paletteMousePositions[i] = temp;
        }

        private.loaded = true;
    };

    private.setUpMousePositions();

    return {

        update: function( step, canvas, context)
        {

        },
        render: function( step, canvas, context)
        {

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

$('#paintMe').on('mouseover', function(e){
    Mouse.events.mouseover   = true;
    Mouse.x                  = Math.floor(e.clientX - $(this).offset().left);
    Mouse.y                  = Math.floor(e.clientY - $(this).offset().top);
});

$('#paintMe').on('mouseout', function(e)
{
    Mouse.events.mousemove   = false;
    Mouse.events.mouseover   = false;
    Mouse.events.mousedown   = false;
    Mouse.events.mouseout    = true;
    Mouse.events.mouseButton = 0;

    Mouse.x                  = 0;
    Mouse.y                  = 0;
});

$('#paintMe').on('mousemove', function(e)
{
    Mouse.events.mousemove   = true;
    Mouse.x                  = Math.floor(e.clientX - $(this).offset().left);
    Mouse.y                  = Math.floor(e.clientY - $(this).offset().top);
    return false;
});

$('#paintMe').on('mousedown', function(e)
{
    Mouse.events.mousedown   = true;
    Mouse.events.mouseup     = false;
    Mouse.events.mouseButton = e.which;
    return false;
});

$('#paintMe').on('mouseup', function(e)
{
    Mouse.events.mousedown   = false;
    Mouse.events.mouseup     = true;
    Mouse.events.mouseButton = 0;
    return false;
});

// This returns false to disable the operating systems context menu on right click
$('#paintMe').contextmenu(function() {
    return false;
});

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

var iCanvas = new ImageCanvas();
var iPreview = new Preview();
var iPalette = new Palette();

App.run({
    canvas: $('#paintMe'),
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
